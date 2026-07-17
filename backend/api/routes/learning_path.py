from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import logging
import json
from datetime import datetime
import re

from backend.config.settings import settings
from backend.api.dependencies.core import get_db, get_current_user
from backend.models.user import User, UserProfile
from backend.models.learning_path import LearningPath
from backend.schemas.user_schema import LearningPathResponse
from backend.database.curated_resources import CURATED_RESOURCES

logger = logging.getLogger("LearnPath-AI")
router = APIRouter(tags=["Learning Path"])

class LearningPathRequest(BaseModel):
    topic: str

def match_resources_for_topic(topic_or_title: str) -> list:
    matched = []
    text = topic_or_title.lower()
    best_match = None
    sorted_keys = sorted(CURATED_RESOURCES.keys(), key=len, reverse=True)
    for tech in sorted_keys:
        tech_lower = tech.lower()
        if len(tech_lower) <= 2:
            if re.search(r'\b' + re.escape(tech_lower) + r'\b', text):
                best_match = tech
                break
        elif tech_lower in text:
            best_match = tech
            break
            
    if not best_match:
        return [
            {
                "title": "Roadmap.sh AI Roadmap",
                "url": "https://roadmap.sh/ai",
                "type": "Official Docs",
                "site_name": "roadmap.sh",
                "description": "General AI & Software Engineering Roadmaps."
            },
            {
                "title": "freeCodeCamp learning platform",
                "url": "https://www.freecodecamp.org/",
                "type": "Video Tutorials",
                "site_name": "freeCodeCamp",
                "description": "Free courses and certifications for tech careers."
            },
            {
                "title": "GeeksforGeeks reference",
                "url": "https://www.geeksforgeeks.org/",
                "type": "Articles",
                "site_name": "GeeksforGeeks",
                "description": "Quick tutorials and programming challenges."
            }
        ]
        
    tech_data = CURATED_RESOURCES[best_match]
    mapping = [
        ("Official Documentation", "Official Docs", "Official Docs", "Official documentation and developer reference guides."),
        ("Roadmap", "Cheat Sheets", "Roadmap", "Structured career and learning roadmap."),
        ("Beginner Tutorial", "Articles", "Beginner Guide", "Quick tutorial for beginners starting from scratch."),
        ("Advanced Tutorial", "Articles", "Advanced Guide", "Detailed guide covering advanced topics and architectural details."),
        ("YouTube Playlist", "Video Tutorials", "Video Playlist", "Curated video lectures and playlist step-by-step."),
        ("Practice Websites", "Practice Platforms", "Practice Platform", "Interactive coding problems and hands-on exercises."),
        ("GitHub Repository", "GitHub", "GitHub Repo", "Awesome list of resources, source code, and libraries."),
        ("Cheat Sheet", "Cheat Sheets", "Quick Reference", "Cheat sheets covering syntax, methods, and configurations."),
        ("Articles", "Articles", "Technical Articles", "Community articles and blogs for deep understanding."),
        ("Books", "Articles", "Recommended Book", "Top-rated books for mastery."),
        ("Certification Links", "Official Docs", "Certification", "Industry-recognized certificate details.")
    ]
    
    for key, res_type, label, default_desc in mapping:
        val = tech_data.get(key)
        if val:
            matched.append({
                "title": f"{best_match} {label}",
                "url": val,
                "type": res_type,
                "site_name": val.split("//")[-1].split("/")[0].replace("www.", ""),
                "description": default_desc
            })
            
    return matched

def generate_dynamic_fallback_modules(topic: str) -> list:
    topic_lower = topic.lower()
    if "machine learning" in topic_lower or "ml" in topic_lower:
        return [
            {
                "title": "Introduction to Machine Learning & Data Basics",
                "difficulty": "Beginner",
                "duration": "2h 30m",
                "description": "Covers supervised vs unsupervised learning paradigms, training/test dataset splits, and basic performance evaluation metrics.",
                "learning_objectives": ["Identify different types of learning tasks", "Prepare data partitions", "Compute precision, recall, and accuracy"],
                "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None, "interview": None
            },
            {
                "title": "Supervised Learning Models",
                "difficulty": "Intermediate",
                "duration": "4h 15m",
                "description": "Covers core regression and classification models: linear regression, logistic regression, decision trees, and SVMs.",
                "learning_objectives": ["Build and evaluate linear regressions", "Implement classification decision boundary mappings", "Train support vector machines"],
                "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None, "interview": None
            },
            {
                "title": "Deep Learning & Neural Networks",
                "difficulty": "Advanced",
                "duration": "5h 10m",
                "description": "Covers perceptrons, multi-layer artificial neural networks, backpropagation mechanics, activation functions, and frameworks like PyTorch or TensorFlow.",
                "learning_objectives": ["Configure multi-layer network graphs", "Trace errors through backpropagation", "Build a neural classifier in code"],
                "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None, "interview": None
            },
            {
                "title": "Model Deployment & Capstone",
                "difficulty": "Advanced",
                "duration": "3h 45m",
                "description": "Covers containerizing trained models with Docker, exposing inference functions via REST APIs (FastAPI), and setting up basic monitoring metrics.",
                "learning_objectives": ["Host model inference routes", "Containerize services with Docker", "Track latency and prediction drifts"],
                "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None, "interview": None
            }
        ]
    return [
        {
            "title": f"Foundations of {topic}",
            "difficulty": "Beginner",
            "duration": "2h 40m",
            "description": f"Learn the key principles, configuration settings, and runtime environments required to initialize a project utilizing {topic}.",
            "learning_objectives": ["Understand syntax and baseline modules", "Configure development server components"],
            "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None, "interview": None
        },
        {
            "title": f"Applied {topic} Practices",
            "difficulty": "Intermediate",
            "duration": "4h 10m",
            "description": f"Explore CRUD operations, state models, database routing, and API data transfers associated with {topic}.",
            "learning_objectives": ["Expose standard API endpoints", "Design data persistence mapping schemas"],
            "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None, "interview": None
        },
        {
            "title": f"Advanced {topic} Design & Orchestration",
            "difficulty": "Advanced",
            "duration": "6h 20m",
            "description": f"Master performance optimization patterns, cache strategies, asynchronous task queues, and decoupled architecture layouts using {topic}.",
            "learning_objectives": ["Implement rate limiters and caches", "Refactor services for thread/async safety"],
            "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None, "interview": None
        },
        {
            "title": f"Production Deployment & Security of {topic}",
            "difficulty": "Advanced",
            "duration": "3h 15m",
            "description": f"Learn secure authentication integrations (JWT), automated unit test suites, reverse proxy setup, and Docker containerized hosting.",
            "learning_objectives": ["Integrate authorization guards on routes", "Containerize application assets for release"],
            "progress": 0, "lesson": None, "resources": None, "quiz": None, "projects": None, "interview": None
        }
    ]

def generate_rich_fallback_lesson(module_title: str, topic: str) -> dict:
    title_lower = module_title.lower()
    
    lesson = {
        "introduction": f"Welcome to the module on **{module_title}**. Let's start with a simple analogy: imagine you are building a house. You don't lay bricks without a blueprint. Similarly, **{module_title}** acts as the blueprint for structuring logic, memory, and data execution pools within a **{topic}** environment.",
        "theory": f"### Theoretical Foundations\nTo understand **{module_title}**, we build a mental model consisting of three stages:\n1. **State Isolation**: Decoupling logic from active configuration variables.\n2. **Execution Pipelines**: Defining standard routing handlers.\n3. **Adaptation Guards**: Adding try-catch validation checkpoints.\n\nBy following this structure, we ensure high cohesion and low coupling across modules.",
        "explanation": f"### Core Breakdown of {module_title}\n\nTo implement **{module_title}** in a production codebase, you must master the following components:\n\n1. **Data Access Layers (DAL)**:\n   - This layer isolates raw file system or database interaction logic.\n   - Always utilize connection context pools instead of single socket links.\n\n2. **Business Logic Layer (BLL)**:\n   - Decoupled handlers validate inputs, execute transformations, and log outcomes.\n   - Prevents race conditions by keeping functions **stateless**.\n\n3. **Interface Specs**:\n   - Consistently structure schema shapes using standard models (e.g. Pydantic schemas).",
        "examples": f"### Practical Scenario\nConsider a user authentication flow. Instead of embedding database query statements directly inside the endpoint router, we delegate database lookups to an isolated **{module_title}** helper class. The router only handles request variables and delegates logic execution.",
        "code_snippet": f"# Clean production-grade structure for {module_title}\n\nclass {module_title.replace(' ', '').replace('&', '').replace('-', '')}Manager:\n    def __init__(self, database_url: str):\n        self.db_url = database_url\n        self.connection = None\n\n    def execute_safely(self, payload: dict) -> bool:\n        \"\"\"\n        Safely parses parameters and runs module transactions.\n        \"\"\"\n        print(f'Executing: {payload}')\n        try:\n            # Simulate transaction processing\n            return True\n        except Exception as error:\n            print(f'Transaction failed: {error}')\n            return False\n",
        "tips": "Pro Tip: Keep the component logic completely stateless. If state persistence is needed, delegate it to a thread-safe caching service (like Redis) or an external database rather than local memory variables.",
        "best_practices": "Best Practice: Declare all external keys, connection strings, and endpoints in a local environment configuration file (.env) and read them using verified configuration schemas. Never hardcode secrets in source files.",
        "common_mistakes": "Common Mistake: Leaving database sessions or connection pools open after processing transactions, which drains connection pools under heavy concurrent traffic.",
        "practice_exercise": f"Exercise: Refactor the execution helper code snippet to support an automatic retry driver logic that tries up to 3 times with exponential backoff (e.g., waiting 1s, 2s, and 4s) if a transaction returns False.",
        "quick_revision": "Quick Revision:\n- Decouple variables from execution.\n- Always close session contexts.\n- Keep logic layers stateless.",
        "summary": f"In summary, we explored the foundations of **{module_title}**. You learned how to structure components, write clean execution handlers, and handle common pitfalls."
    }

    if "python" in title_lower or "c++" in title_lower or "java" in title_lower or "javascript" in title_lower or "typescript" in title_lower:
        lang = "Python"
        if "c++" in title_lower: lang = "C++"
        elif "java" in title_lower: lang = "Java"
        elif "javascript" in title_lower: lang = "JavaScript"
        elif "typescript" in title_lower: lang = "TypeScript"
        
        lesson["introduction"] = f"Welcome to the **{module_title}** module. Think of programming language variables as storage boxes with labels. In **{lang}**, we use distinct memory systems to manage these boxes efficiently."
        lesson["theory"] = f"### Mental Model of {lang} Memory\nWhen variables are declared, the runtime stores them in two primary memory regions:\n1. **Stack Memory**: Used for rapid, static allocation of local functions and scalar types.\n2. **Heap Memory**: Used for dynamic allocation of object structures. In JavaScript/Python, garbage collection automatically cleans this heap, while in C++, manual memory release is required."
        lesson["explanation"] = f"### Core Typing and Scopes\n\n1. **Static vs Dynamic Typing**:\n   - **{lang}** uses typing architectures to prevent syntax bugs. TypeScript/C++/Java enforce checks at build-time, whereas Python/JavaScript evaluate typing at runtime.\n\n2. **Execution Contexts**:\n   - Each function call creates an execution frame containing its local parameters and pointers. Decoupled coding ensures that functions do not produce unexpected side effects outside their frame."
        
    elif "numpy" in title_lower:
        lesson["introduction"] = "Welcome to **NumPy Array Manipulations**. Think of a NumPy array as a grid of spreadsheet cells. In raw Python, iterating through these cells requires slow loops, but NumPy performs these calculations on the entire grid at once using compiled C code."
        lesson["theory"] = "### Vectorization and Locality\nNumPy arrays (ndarrays) achieve high performance through two principles:\n1. **Contiguous Memory**: NumPy stores arrays in consecutive memory spaces, allowing CPUs to fetch data efficiently using cache memory.\n2. **Vectorization**: Mathematical operations are applied to all elements concurrently, bypassing Python runtime loop checks."
        lesson["explanation"] = "### Broadcasting Mechanics\n\n1. **Dimension Alignment**:\n   - When operating on arrays of different shapes, NumPy automatically stretches the smaller array to match the size of the larger array.\n\n2. **Index Filtering**:\n   - Filter data using boolean masks (e.g. `data[data > 0]`) to select elements instantly without manual loops."
        
    elif "pandas" in title_lower:
        lesson["introduction"] = "Welcome to **Pandas DataFrames**. Analogy: Think of a Pandas DataFrame as an interactive SQL table or Excel sheet loaded directly into RAM for ultra-fast queries."
        lesson["theory"] = "### Series and Index Alignments\nA DataFrame consists of multiple Series sharing a common Index. When performing mathematical operations across multiple Series, Pandas automatically aligns elements by their index keys, preventing mismatched data rows."
        lesson["explanation"] = "### Memory and Parsing Optimizations\n\n1. **Categorical Data Types**:\n   - Convert repetitive string columns (like 'Country' or 'Gender') to the `category` data type to reduce memory usage by up to 90%.\n\n2. **Chunking Loaders**:\n   - When reading massive CSV datasets, load them in batches using the `chunksize` parameter to prevent out-of-memory crashes."

    elif "machine learning" in title_lower or "supervised" in title_lower:
        lesson["introduction"] = f"Welcome to **{module_title}**. Analogy: Imagine teaching a child to recognize an apple. You show them various examples of apples (features like color, size, shape) and label them 'apple' (target). This is supervised learning: learning from labeled examples."
        lesson["theory"] = "### The Training Loop Mental Model\nSupervised learning follows a three-step cycle:\n1. **Hypothesis Evaluation**: The model makes a prediction using input features.\n2. **Loss Minimization**: A loss function calculates the prediction error.\n3. **Parameter Updates**: The optimization algorithm adjusts model parameters to reduce future errors."
        lesson["explanation"] = "### Classification vs Regression\n\n1. **Continuous Values (Regression)**:\n   - Predicts numerical target variables (e.g., estimating house prices based on square footage).\n\n2. **Discrete Classes (Classification)**:\n   - Predicts categorical labels (e.g., classifying an email as Spam or Not Spam).\n\n3. **Evaluation Metrics**:\n   - Use **Precision** and **Recall** instead of basic Accuracy when working with imbalanced datasets."

    return lesson

def generate_rich_fallback_module_data(module_title: str, topic: str, difficulty: str, description: str, learning_objectives: list) -> dict:
    lesson = generate_rich_fallback_lesson(module_title, topic)
    if description:
        lesson["introduction"] = f"In this module on **{module_title}**, we focus on the following core areas: {description}"
    if learning_objectives:
        lesson["theory"] = f"### Learning Outcomes\nWe will examine execution structures and design layers to achieve these specific objectives:\n" + "\n".join([f"- **{obj}**" for obj in learning_objectives])

    resources = match_resources_for_topic(module_title)

    quiz = [
        {
            "question": f"Which of the following is a primary objective of {module_title}?",
            "options": [
                f"Establishing core conceptual patterns for {module_title}",
                "Decoupling storage adapters",
                "Increasing socket latency",
                "Disabling validation constraints"
            ],
            "answer": f"Establishing core conceptual patterns for {module_title}",
            "explanation": f"Understanding the fundamental patterns of {module_title} is crucial before building complex layers."
        },
        {
            "question": "What is a recommended best practice when designing modules?",
            "options": [
                "Hardcoding credentials directly in source files",
                "Keeping configurations stateless and using environment variables",
                "Suppressing all error types without logging",
                "Using large synchronized blockers in asynchronous loops"
            ],
            "answer": "Keeping configurations stateless and using environment variables",
            "explanation": "Stateless configurations allow microservices to scale dynamically across distributed setups."
        },
        {
            "question": f"In a production system using {topic}, why is the decoupled implementation of {module_title} preferred?",
            "options": [
                "It makes testing and dependency mocking simple and clean",
                "It guarantees zero execution delay",
                "It automatically generates container configuration scripts",
                "It removes the need for checking inputs"
            ],
            "answer": "It makes testing and dependency mocking simple and clean",
            "explanation": "Decoupled logic separates concerns, allowing unit tests to run with deterministic mocks."
        },
        {
            "question": f"Which common pitfall should be avoided when implementing {module_title}?",
            "options": [
                "Closing database connections immediately",
                "Forgetting to release resource sockets and database pools",
                "Writing unit tests for edge cases",
                "Configuring secure TLS endpoints"
            ],
            "answer": "Forgetting to release resource sockets and database pools",
            "explanation": "Leaking connection sockets causes resource exhaustion, resulting in connection timeouts under peak traffic."
        },
        {
            "question": f"To achieve the learning outcome of '{learning_objectives[0] if learning_objectives else 'verifying configuration safety'}', which setup is essential?",
            "options": [
                "Manual editing of build scripts in production",
                "Creating mock integration test blocks with parameter assertions",
                "Ignoring validation checks",
                "Scaling CPU frequencies"
            ],
            "answer": "Creating mock integration test blocks with parameter assertions",
            "explanation": "Asserting parameters during mock tests is the standard approach to verifying configuration correctness."
        }
    ]

    projects = [
        {
            "title": f"Mini Lab: {module_title} Driver",
            "type": "Mini",
            "difficulty": "Beginner",
            "description": f"Write a simple Python or JavaScript driver to demonstrate the core operations of {module_title}.",
            "objectives": [
                f"Define initialization options for {module_title}",
                "Implement basic execution logging"
            ],
            "technologies": [topic],
            "expected_output": f"Driver script initializes and executes task successfully.",
            "outcomes": f"Understands variables and initializations of {module_title}.",
            "checklist": ["Verify configuration dictionary keys", "Implement exception handlers"]
        },
        {
            "title": f"Portfolio Sprint: {module_title} Service",
            "type": "Portfolio",
            "difficulty": "Intermediate",
            "description": f"Build a modular, reusable class package that handles data CRUD operations for {module_title} with persistent storage.",
            "objectives": [
                "Define repository models",
                "Implement SQLite session handlers"
            ],
            "technologies": [topic, "SQLite"],
            "expected_output": "Saves, retrieves, and updates records in a clean transaction.",
            "outcomes": f"Designs clean persistent layers for {module_title}.",
            "checklist": ["Connect local database session", "Map database columns to models"]
        },
        {
            "title": f"Capstone Build: {module_title} Gateway",
            "type": "Capstone",
            "difficulty": "Advanced",
            "description": f"Create and deploy a production-grade FastAPI or Express API server that exposes the operations of {module_title} with authorization filters.",
            "objectives": [
                "Register HTTP routing patterns",
                "Integrate JWT security middleware"
            ],
            "technologies": [topic, "FastAPI", "Uvicorn"],
            "expected_output": "Restricting unauthorized requests, verifying and decoding incoming JWT validation header fields.",
            "outcomes": f"Orchestrates scalable, secure APIs for {module_title}.",
            "checklist": ["Configure CORS origins", "Deploy health check path"]
        }
    ]

    interview = [
        {
            "question": f"What are the key architectural tradeoffs when designing a decoupled component for {module_title}?",
            "type": "Technical",
            "difficulty": "Intermediate",
            "expected_answer": f"Decoupling {module_title} increases flexibility and testability by separating concerns, but adds minor complexity in coordinate handlers. The gain in testability makes it worth the tradeoff in production codebases.",
            "hint": "Think about dependency injection and mocking."
        },
        {
            "question": f"Write a code snippet to safely initialize and close a connection context for {module_title}.",
            "type": "Coding",
            "difficulty": "Intermediate",
            "expected_answer": "Use a context manager in Python (`with` statement) or a `try...finally` block in JavaScript to guarantee connections are closed even during exceptions.",
            "hint": "Use resource managers or try-finally."
        },
        {
            "question": f"How would you troubleshoot a memory leak or connection depletion issue in a production system running {module_title}?",
            "type": "Scenario",
            "difficulty": "Advanced",
            "expected_answer": "Inspect active socket pools and thread dumps, confirm all clients correctly call close or return links to the connection manager, and add automated timeout intervals to prevent orphan threads.",
            "hint": "Check connection pool exhaustion."
        }
    ]

    return {
        "lesson": lesson,
        "resources": resources,
        "quiz": quiz,
        "projects": projects,
        "interview": interview
    }

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

@router.post("/learning-path")
async def generate_learning_path(
    request: LearningPathRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    topic = request.topic
    logger.info(f"Generating learning path for user {current_user.email} and topic: {topic}")
    
    cached_path = db.query(LearningPath).filter(
        LearningPath.user_id == current_user.id,
        LearningPath.topic.ilike(topic)
    ).first()
    
    if cached_path:
        logger.info(f"Returning cached learning path for {topic}")
        return json.loads(cached_path.path_data)
        
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
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
                {{ 
                  "title": "Module 1 Title", 
                  "difficulty": "Beginner", 
                  "duration": "2h 30m",
                  "description": "Provide a brief description of what this module covers and its scope.",
                  "learning_objectives": ["Objective 1", "Objective 2", "Objective 3"],
                  "progress": 0,
                  "lesson": null,
                  "resources": null,
                  "quiz": null,
                  "projects": null,
                  "interview": null
                }},
                {{ 
                  "title": "Module 2 Title", 
                  "difficulty": "Intermediate", 
                  "duration": "4h 15m",
                  "description": "Provide a brief description of what this module covers and its scope.",
                  "learning_objectives": ["Objective 1", "Objective 2", "Objective 3"],
                  "progress": 0,
                  "lesson": null,
                  "resources": null,
                  "quiz": null,
                  "projects": null,
                  "interview": null
                }},
                {{ 
                  "title": "Module 3 Title", 
                  "difficulty": "Advanced", 
                  "duration": "5h 10m",
                  "description": "Provide a brief description of what this module covers and its scope.",
                  "learning_objectives": ["Objective 1", "Objective 2", "Objective 3"],
                  "progress": 0,
                  "lesson": null,
                  "resources": null,
                  "quiz": null,
                  "projects": null,
                  "interview": null
                }},
                {{ 
                  "title": "Module 4 Title", 
                  "difficulty": "Advanced", 
                  "duration": "3h 45m",
                  "description": "Provide a brief description of what this module covers and its scope.",
                  "learning_objectives": ["Objective 1", "Objective 2", "Objective 3"],
                  "progress": 0,
                  "lesson": null,
                  "resources": null,
                  "quiz": null,
                  "projects": null,
                  "interview": null
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
            result["status"] = "success"
            result["topic"] = topic
            
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

    fallback_modules = generate_dynamic_fallback_modules(topic)
    
    result = {
        "status": "success",
        "topic": topic,
        "modules": fallback_modules
    }
    
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
    
    if module.get("lesson") is not None and module.get("quiz") is not None:
        logger.info(f"Module {module_index} content already generated. Returning cache.")
        return path_data
        
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
            Generate the learning content, quiz questions, projects, and interview preparation questions specifically for the following module.
            Do NOT explain other modules of the course. Generate content ONLY related to this module's title, description, and objectives.

            Course Name: {path_data['topic']}
            Current Module Name: {module['title']}
            Module Description: {module.get('description', '')}
            Learning Objectives: {", ".join(module.get('learning_objectives', []))}
            Difficulty Level: {module['difficulty']}

            Return ONLY a valid JSON object matching the following structure (do not return any markdown formatting, explanation, or backticks, just the raw JSON text):
            {{
              "lesson": {{
                "introduction": "Write an engaging, clear introduction introducing the concepts of this module. Explain the concept using a relatable real-world analogy so a beginner can grasp it instantly.",
                "theory": "Explain the theoretical foundations, underlying models, or mathematics. Use a step-by-step breakdown to build a solid mental model of the concept.",
                "explanation": "Provide a comprehensive, step-by-step detailed explanation of the core variables, configurations, and operations. Use Markdown subheadings (###), bold terms, and bullet lists to make the explanation highly readable, scannable, and extremely clear.",
                "examples": "Provide concrete real-world use cases and walk through the logic step-by-step.",
                "code_snippet": "Provide a clean, production-ready code snippet implementing these concepts...",
                "tips": "Provide highly useful tips and developer mental shortcuts...",
                "best_practices": "Provide industry best practices for clean code and performance...",
                "common_mistakes": "Detail typical mistakes, bugs, and how to avoid them...",
                "practice_exercise": "Outline a hands-on exercise with requirements for the learner to write...",
                "quick_revision": "Summary bullet points for fast memory retrieval...",
                "summary": "Provide a concise summary concluding this lesson..."
              }},
              "quiz": [
                {{
                  "question": "Question 1 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option B",
                  "explanation": "Clear, detailed explanation of why the correct answer is correct."
                }},
                {{
                  "question": "Question 2 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option A",
                  "explanation": "Clear, detailed explanation of why the correct answer is correct."
                }},
                {{
                  "question": "Question 3 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option C",
                  "explanation": "Clear, detailed explanation of why the correct answer is correct."
                }},
                {{
                  "question": "Question 4 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option D",
                  "explanation": "Clear, detailed explanation of why the correct answer is correct."
                }},
                {{
                  "question": "Question 5 text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option B",
                  "explanation": "Clear, detailed explanation of why the correct answer is correct."
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
                  "expected_output": "Takes inputs and completes computations.",
                  "outcomes": "Demonstrates core control flow.",
                  "checklist": ["Create function", "Verify negative bounds"]
                }},
                {{
                  "title": "Portfolio Core Project",
                  "type": "Portfolio",
                  "difficulty": "Intermediate",
                  "description": "Construct a localized database schema service.",
                  "objectives": ["Model schemas", "Query data"],
                  "technologies": ["Python", "SQLite"],
                  "expected_output": "Creates tables and saves data records.",
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
                  "expected_output": "Returns token on auth login checks.",
                  "outcomes": "Demonstrates production readiness.",
                  "checklist": ["Register routers", "Configure proxy rewrite"]
                }}
              ],
              "interview": [
                {{
                  "question": "Technical question 1?",
                  "type": "Technical",
                  "difficulty": "Beginner",
                  "expected_answer": "...",
                  "hint": "..."
                }},
                {{
                  "question": "Coding question 2?",
                  "type": "Coding",
                  "difficulty": "Intermediate",
                  "expected_answer": "...",
                  "hint": "..."
                }},
                {{
                  "question": "Scenario question 3?",
                  "type": "Scenario",
                  "difficulty": "Advanced",
                  "expected_answer": "...",
                  "hint": "..."
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
            module["resources"] = match_resources_for_topic(module["title"])
            module["quiz"] = result.get("quiz")
            module["projects"] = result.get("projects")
            module["interview"] = result.get("interview")
            
            path_record.path_data = json.dumps(path_data)
            db.commit()
            return path_data
        except Exception as e:
            logger.error(f"Error calling Groq API: {str(e)}. Falling back to mock content.")

    mock_result = generate_rich_fallback_module_data(
        module['title'],
        path_data['topic'],
        module['difficulty'],
        module.get('description', ''),
        module.get('learning_objectives', [])
    )
    
    module["lesson"] = mock_result["lesson"]
    module["resources"] = mock_result["resources"]
    module["quiz"] = mock_result["quiz"]
    module["projects"] = mock_result["projects"]
    module["interview"] = mock_result["interview"]
    
    path_record.path_data = json.dumps(path_data)
    db.commit()
    return path_data
