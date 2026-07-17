from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
import logging
import json
from backend.config.settings import settings

logger = logging.getLogger("LearnPath-AI")
router = APIRouter(tags=["Learning Path"])

class LearningPathRequest(BaseModel):
    topic: str

@router.post("/learning-path")
async def generate_learning_path(request: LearningPathRequest):
    topic = request.topic
    logger.info(f"Generating learning path for topic: {topic}")
    
    # Check if Groq API key is present
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
            Design a comprehensive, logically sequenced learning path for the topic: "{topic}".
            
            Return ONLY a valid JSON object matching the following structure (do not return any markdown formatting or backticks, just the raw JSON text):
            {{
              "modules": [
                {{ "title": "Module 1 Title", "difficulty": "Beginner", "duration": "2h 30m", "progress": 0 }},
                {{ "title": "Module 2 Title", "difficulty": "Intermediate", "duration": "4h 15m", "progress": 0 }},
                {{ "title": "Module 3 Title", "difficulty": "Advanced", "duration": "5h 10m", "progress": 0 }},
                {{ "title": "Module 4 Title", "difficulty": "Advanced", "duration": "3h 45m", "progress": 0 }}
              ],
              "projects": [
                {{ "title": "Project 1 Title", "difficulty": "Beginner", "duration": "2h", "skills": ["SkillA", "SkillB"] }},
                {{ "title": "Project 2 Title", "difficulty": "Intermediate", "duration": "4h", "skills": ["SkillC", "SkillD"] }},
                {{ "title": "Project 3 Title", "difficulty": "Advanced", "duration": "8h", "skills": ["SkillE", "SkillF"] }}
              ],
              "interview": [
                "Interview question 1 related to topic?",
                "Interview question 2 related to topic?",
                "Interview question 3 related to topic?"
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
            return {
                "status": "success",
                "topic": topic,
                "modules": result.get("modules", []),
                "projects": result.get("projects", []),
                "interview": result.get("interview", [])
            }
        except Exception as e:
            logger.error(f"Error calling Groq API: {str(e)}. Falling back to mock generator.")
            
    # Fallback / Mock Generator based on requested topic
    fallback_modules = [
        { "title": f"Foundations of {topic}", "difficulty": "Beginner", "duration": "2h 40m", "progress": 0 },
        { "title": f"Applied {topic} Practices", "difficulty": "Intermediate", "duration": "4h 10m", "progress": 0 },
        { "title": f"Advanced {topic} Architecture", "difficulty": "Advanced", "duration": "6h 20m", "progress": 0 },
        { "title": f"{topic} Interview & Capstone Review", "difficulty": "Advanced", "duration": "3h 15m", "progress": 0 }
    ]
    
    fallback_projects = [
        { "title": f"Build a {topic} Recommender", "difficulty": "Intermediate", "duration": "4h", "skills": ["Design", "Logic", "APIs"] },
        { "title": f"Train a {topic} Classifier", "difficulty": "Beginner", "duration": "2h", "skills": ["Python", "Metrics", "Validation"] },
        { "title": f"Deploy a {topic} Assistant", "difficulty": "Advanced", "duration": "8h", "skills": ["Agents", "Deployment", "Evaluation"] }
    ]
    
    fallback_interview = [
        f"Explain the core architecture of a {topic} application.",
        f"How do you resolve latency issues in a production {topic} pipeline?",
        f"Design a scalable data ingestion system for {topic} models."
    ]
    
    return {
        "status": "success",
        "topic": topic,
        "modules": fallback_modules,
        "projects": fallback_projects,
        "interview": fallback_interview
    }
