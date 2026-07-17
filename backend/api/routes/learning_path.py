from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import logging
import json
from datetime import datetime

from backend.config.settings import settings
from backend.api.dependencies.core import get_db, get_current_user
from backend.models.user import User, UserProfile
from backend.models.learning_path import LearningPath
from backend.schemas.user_schema import LearningPathResponse

logger = logging.getLogger("LearnPath-AI")
router = APIRouter(tags=["Learning Path"])

class LearningPathRequest(BaseModel):
    topic: str

@router.post("/learning-path")
async def generate_learning_path(
    request: LearningPathRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generates a personalized 4-module roadmap. If a path for this topic already exists
    for this user in the database, it returns the cached path instead of calling the LLM.
    """
    topic = request.topic
    logger.info(f"Generating learning path for user {current_user.email} and topic: {topic}")
    
    # 1. Check Cache
    cached_path = db.query(LearningPath).filter(
        LearningPath.user_id == current_user.id,
        LearningPath.topic.ilike(topic)
    ).first()
    
    if cached_path:
        logger.info(f"Returning cached learning path for {topic}")
        return json.loads(cached_path.path_data)
        
    # 2. Fetch User Profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        # Fallback profile if user hasn't filled it
        profile = UserProfile(
            user_id=current_user.id,
            learning_goal=topic,
            target_role="Software Engineer",
            current_skill_level="Beginner",
            education="Self-taught",
            languages_known="Python, JavaScript",
            technologies="React",
            learning_style="Project-based",
            daily_study_hours="2",
            weekly_goal="Complete 1 module",
            target_completion_date="2026-12-31",
            experience_level="None",
            career_objective="Get a job",
            preferred_difficulty="Beginner"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # 3. Call Llama 3 via Groq (if key present)
    if settings.GROQ_API_KEY and not settings.GROQ_API_KEY.startswith("your_"):
        try:
            from langchain_groq import ChatGroq
            llm = ChatGroq(
                model="llama3-70b-8192",
                temperature=0.5,
                groq_api_key=settings.GROQ_API_KEY
            )
            
            prompt = f"""
            You are an expert Educational Architect and Curriculum Designer.
            Design a highly personalized, logically sequenced learning path for a student with the following profile:
            - Learning Goal: {profile.learning_goal}
            - Target Role: {profile.target_role}
            - Skill Level: {profile.current_skill_level}
            - Education: {profile.education}
            - Known Languages: {profile.languages_known}
            - Technologies of Interest: {profile.technologies}
            - Preferred Learning Style: {profile.learning_style}
            - Daily Study Hours: {profile.daily_study_hours}
            - Target Completion Date: {profile.target_completion_date}
            - Preferred Difficulty: {profile.preferred_difficulty}

            Generate a roadmap consisting of exactly 4 structured modules.
            Return ONLY a valid JSON object matching the following structure (do not return any markdown formatting, explanation, or backticks, just the raw JSON text):
            {{
              "modules": [
                {{ "title": "Module 1 Title", "difficulty": "Beginner", "duration": "2h 30m", "progress": 0, "lesson": null, "resources": null, "quiz": null, "projects": null }},
                {{ "title": "Module 2 Title", "difficulty": "Intermediate", "duration": "4h 15m", "progress": 0, "lesson": null, "resources": null, "quiz": null, "projects": null }},
                {{ "title": "Module 3 Title", "difficulty": "Advanced", "duration": "5h 10m", "progress": 0, "lesson": null, "resources": null, "quiz": null, "projects": null }},
                {{ "title": "Module 4 Title", "difficulty": "Advanced", "duration": "3h 45m", "progress": 0, "lesson": null, "resources": null, "quiz": null, "projects": null }}
              ],
              "interview": [
                {{ "question": "Technical question 1?", "type": "Technical", "difficulty": "Beginner", "expected_answer": "...", "hint": "..." }},
                {{ "question": "Coding question 2?", "type": "Coding", "difficulty": "Intermediate", "expected_answer": "...", "hint": "..." }},
                {{ "question": "Scenario question 3?", "type": "Scenario", "difficulty": "Advanced", "expected_answer": "...", "hint": "..." }},
                {{ "question": "HR question 4?", "type": "HR", "difficulty": "Beginner", "expected_answer": "...", "hint": "..." }},
                {{ "question": "System Design question 5?", "type": "System Design", "difficulty": "Advanced", "expected_answer": "...", "hint": "..." }}
              ]
            }}
            """
            response = await llm.ainvoke(prompt)
            content = response.content.strip()
            
            # Clean up potential markdown backticks
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
            content = content.strip()
            
            result = json.loads(content)
            result["status"] = "success"
            result["topic"] = topic
            
            # Save to Database
            new_path = LearningPath(
                user_id=current_user.id,
                topic=topic,
                path_data=json.dumps(result)
            )
            db.add(new_path)
            db.commit()
            
            return result
        except Exception as e:
            logger.error(f"Error calling Groq API: {str(e)}. Falling back to mock generator.")

    # 4. Fallback / Mock Generator
    fallback_modules = [
        { "title": f"Foundations of {topic}", "difficulty": "Beginner", "duration": "2h 40m", "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None },
        { "title": f"Applied {topic} Practices", "difficulty": "Intermediate", "duration": "4h 10m", "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None },
        { "title": f"Advanced {topic} Architecture", "difficulty": "Advanced", "duration": "6h 20m", "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None },
        { "title": f"{topic} Interview & Capstone Review", "difficulty": "Advanced", "duration": "3h 15m", "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None }
    ]
    
    fallback_projects = [
        { "title": f"Build a {topic} Recommender", "difficulty": "Intermediate", "duration": "4h", "skills": ["Design", "Logic", "APIs"] },
        { "title": f"Train a {topic} Classifier", "difficulty": "Beginner", "duration": "2h", "skills": ["Python", "Metrics", "Validation"] },
        { "title": f"Deploy a {topic} Assistant", "difficulty": "Advanced", "duration": "8h", "skills": ["Agents", "Deployment", "Evaluation"] }
    ]
    
    fallback_interview = [
        { "question": f"Explain the core architecture of a {topic} application.", "type": "Technical", "difficulty": "Beginner", "expected_answer": "It relies on components coordinated to load model resources.", "hint": "Think about model weights." },
        { "question": f"How do you resolve latency issues in a production {topic} pipeline?", "type": "Technical", "difficulty": "Intermediate", "expected_answer": "By using async uvicorn pipelines.", "hint": "Look at batch size." },
        { "question": f"Design a scalable data ingestion system for {topic} models.", "type": "System Design", "difficulty": "Advanced", "expected_answer": "Use a vector DB and message broker.", "hint": "Think about event streaming." }
    ]
    
    result = {
        "status": "success",
        "topic": topic,
        "modules": fallback_modules,
        "projects": fallback_projects,
        "interview": fallback_interview
    }
    
    # Save to Database
    new_path = LearningPath(
        user_id=current_user.id,
        topic=topic,
        path_data=json.dumps(result)
    )
    db.add(new_path)
    db.commit()
    
    return result

@router.get("/learning-path/current")
def get_current_learning_path(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the latest generated learning path for the currently logged-in user.
    """
    path_record = db.query(LearningPath).filter(
        LearningPath.user_id == current_user.id
    ).order_by(LearningPath.created_at.desc()).first()
    
    if not path_record:
        raise HTTPException(status_code=404, detail="No active learning path found")
        
    return json.loads(path_record.path_data)

@router.post("/learning-path/modules/{module_index}/generate")
async def generate_module_content(
    module_index: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lazy-loads and caches lesson, quiz (5-10 questions), resources, and project content
    for a specific module index.
    """
    path_record = db.query(LearningPath).filter(
        LearningPath.user_id == current_user.id
    ).order_by(LearningPath.created_at.desc()).first()
    
    if not path_record:
        raise HTTPException(status_code=404, detail="No active learning path found")
        
    path_data = json.loads(path_record.path_data)
    modules_list = path_data.get("modules", [])
    
    if module_index < 0 or module_index >= len(modules_list):
        raise HTTPException(status_code=400, detail="Invalid module index")
        
    module = modules_list[module_index]
    
    # Check if already generated
    if module.get("lesson") is not None and module.get("quiz") is not None:
        logger.info(f"Module {module_index} content already generated. Returning cache.")
        return path_data
        
    # Generate content using Groq if key is present
    if settings.GROQ_API_KEY and not settings.GROQ_API_KEY.startswith("your_"):
        try:
            from langchain_groq import ChatGroq
            llm = ChatGroq(
                model="llama3-70b-8192",
                temperature=0.5,
                groq_api_key=settings.GROQ_API_KEY
            )
            
            prompt = f"""
            You are an expert Content Creator, Assessment specialist, and Software Engineer.
            Generate the rich learning content, quiz questions, and practice projects for the module "{module['title']}" inside the learning path for "{path_data['topic']}".
            The difficulty level is {module['difficulty']}.

            Return ONLY a valid JSON object matching the following structure (do not return any markdown formatting, explanation, or backticks, just the raw JSON text):
            {{
              "lesson": {{
                "explanation": "Detailed explanation of concepts with examples and formatting...",
                "examples": "Provide concrete examples here...",
                "code_snippet": "Provide relevant code snippets...",
                "tips": "Provide helpful tips for mental models...",
                "best_practices": "Provide best practices for clean code/architecture...",
                "common_mistakes": "Highlight common pitfalls and how to avoid them...",
                "summary": "Provide a concise summary..."
              }},
              "resources": [
                {{ "title": "Official Documentation", "url": "https://docs.python.org/3/" }},
                {{ "title": "Real Python Tutorials", "url": "https://realpython.com/" }},
                {{ "title": "GitHub Practice Repository", "url": "https://github.com" }},
                {{ "title": "W3Schools Reference", "url": "https://w3schools.com" }},
                {{ "title": "Cheat Sheet Guide", "url": "https://roadmap.sh" }}
              ],
              "quiz": [
                {{
                  "question": "Question 1 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option B",
                  "explanation": "Why Option B is correct..."
                }},
                {{
                  "question": "Question 2 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option A",
                  "explanation": "Why Option A is correct..."
                }},
                {{
                  "question": "Question 3 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option C",
                  "explanation": "Why Option C is correct..."
                }},
                {{
                  "question": "Question 4 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option D",
                  "explanation": "Why Option D is correct..."
                }},
                {{
                  "question": "Question 5 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option B",
                  "explanation": "Why Option B is correct..."
                }}
              ],
              "projects": [
                {{
                  "title": "Mini Practice Lab",
                  "type": "Mini",
                  "difficulty": "Beginner",
                  "description": "Create a console helper for calculations.",
                  "objectives": ["Write functions", "Input parsing"],
                  "technologies": ["Python"],
                  "expected_output": "Takes 2 inputs and adds them.",
                  "outcomes": "Demonstrates core control flow.",
                  "checklist": ["Create add function", "Verify negative numbers"]
                }},
                {{
                  "title": "Portfolio Core Project",
                  "type": "Portfolio",
                  "difficulty": "Intermediate",
                  "description": "Construct a localized repository system.",
                  "objectives": ["Model schemas", "Query data"],
                  "technologies": ["Python", "SQLite"],
                  "expected_output": "Creates tables and saves data.",
                  "outcomes": "Understands local database relationships.",
                  "checklist": ["Set up table schema", "Connect database pool"]
                }},
                {{
                  "title": "Capstone Endpoint Deployment",
                  "type": "Capstone",
                  "difficulty": "Advanced",
                  "description": "Build and host a web API service.",
                  "objectives": ["Deploy endpoints", "Validate JWTs"],
                  "technologies": ["Python", "FastAPI", "Uvicorn"],
                  "expected_output": "Returns token on auth login.",
                  "outcomes": "Demonstrates production readiness.",
                  "checklist": ["Register routers", "Configure proxy rewrite"]
                }}
              ]
            }}
            """
            response = await llm.ainvoke(prompt)
            content = response.content.strip()
            
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
            content = content.strip()
            
            result = json.loads(content)
            module["lesson"] = result.get("lesson")
            module["resources"] = result.get("resources")
            module["quiz"] = result.get("quiz")
            module["projects"] = result.get("projects")
            
            # Save updated path_data to DB
            path_record.path_data = json.dumps(path_data)
            db.commit()
            return path_data
        except Exception as e:
            logger.error(f"Error calling Groq API: {str(e)}. Falling back to mock content.")

    # Fallback / Mock content for the module
    mock_result = {
        "lesson": {
            "explanation": f"Detailed lesson content on {module['title']}. Learning concepts and practical execution setups.",
            "examples": "Example code: print('Hello World') or fetch('/api').",
            "code_snippet": "def example_code():\n    return 'Execution OK'\n",
            "tips": "Tip: Always modularize routing logic for scalability.",
            "best_practices": "Best Practice: Use environment variables for API secrets.",
            "common_mistakes": "Common Mistake: Forgetting to close connections.",
            "summary": "Summary: This module establishes foundations of the topic."
        },
        "resources": [
            { "title": "Official Documentation", "url": "https://docs.python.org/3/" },
            { "title": "Real Python", "url": "https://realpython.com" },
            { "title": "Roadmap.sh Reference", "url": "https://roadmap.sh" }
        ],
        "quiz": [
            {
                "question": f"What is the main objective of {module['title']}?",
                "options": ["To build foundations", "To compile binaries", "To configure environments", "All of the above"],
                "answer": "All of the above",
                "explanation": "This module covers core setup, execution, and deployment architecture."
            },
            {
                "question": f"Which best practice is suggested for {module['title']}?",
                "options": ["Static hardcoding", "Using environment variables", "Ignoring errors", "Single-threaded loops"],
                "answer": "Using environment variables",
                "explanation": "Environment variables protect secrets in production."
            }
        ],
        "projects": [
            {
                "title": "Mini Practice Task",
                "type": "Mini",
                "difficulty": "Beginner",
                "description": "Establish a basic code structure.",
                "objectives": ["Write main function"],
                "technologies": ["Python"],
                "expected_output": "Printed success log.",
                "outcomes": "Demonstrates runtime environment configuration.",
                "checklist": ["Verify main imports"]
            },
            {
                "title": f"{module['title']} Portfolio Sprint",
                "type": "Portfolio",
                "difficulty": "Intermediate",
                "description": "Create a data store manager.",
                "objectives": ["Implement CRUD operations"],
                "technologies": ["Python", "SQLAlchemy"],
                "expected_output": "Create, Read, Update records.",
                "outcomes": "Understands ORM mappings.",
                "checklist": ["Implement database session local"]
            },
            {
                "title": "Capstone API Service",
                "type": "Capstone",
                "difficulty": "Advanced",
                "description": "Deploy a hosted service endpoint.",
                "objectives": ["FastAPI endpoint", "Cross-Origin headers"],
                "technologies": ["Python", "FastAPI"],
                "expected_output": "Healthy API heartbeat.",
                "outcomes": "Production API routing.",
                "checklist": ["Test deployment health"]
            }
        ]
    }
    
    module["lesson"] = mock_result["lesson"]
    module["resources"] = mock_result["resources"]
    module["quiz"] = mock_result["quiz"]
    module["projects"] = mock_result["projects"]
    
    path_record.path_data = json.dumps(path_data)
    db.commit()
    return path_data
