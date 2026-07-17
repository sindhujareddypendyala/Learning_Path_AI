import json
from typing import Iterable

from sqlalchemy.orm import Session, joinedload

from backend.models.course import (
    Course,
    CourseModule,
    CourseProject,
    InterviewQuestion,
    LearningAnalytics,
    Lesson,
    Progress,
    Question,
    Quiz,
    Resource,
)
from backend.models.user import User, UserProfile
from backend.schemas.course_schema import CourseGenerateRequest


def _json_list(values: Iterable[str]) -> str:
    return json.dumps(list(values))


def _load_list(value: str | None) -> list[str]:
    if not value:
        return []
    try:
        loaded = json.loads(value)
        return loaded if isinstance(loaded, list) else [str(loaded)]
    except json.JSONDecodeError:
        return [value]


def _title_from_goal(goal: str) -> str:
    cleaned = goal.strip().rstrip(".")
    lowered = cleaned.lower()
    for prefix in ("i want to become a ", "i want to learn ", "learn ", "become a "):
        if lowered.startswith(prefix):
            cleaned = cleaned[len(prefix):]
            break
    return f"{cleaned[:1].upper()}{cleaned[1:]} Learning Path"


def build_structured_course(goal: str, profile: UserProfile | None, request: CourseGenerateRequest) -> dict:
    """Deterministic multi-agent output that follows the same JSON contract expected from Groq."""
    topic = _title_from_goal(goal).replace(" Learning Path", "")
    level = (profile.current_skill_level if profile and profile.current_skill_level else "Beginner")
    target_role = request.target_role or (profile.target_role if profile and profile.target_role else topic)
    duration = request.weekly_schedule or (profile.weekly_goal if profile and profile.weekly_goal else "4 weeks")

    module_titles = [
        f"{topic} Foundations",
        f"Core Tools for {topic}",
        f"Applied {topic} Workflows",
        f"Advanced {topic} Systems",
        f"{topic} Portfolio Projects",
        f"{topic} Interview Preparation",
    ]
    difficulties = ["Beginner", "Beginner", "Intermediate", "Intermediate", "Advanced", "Advanced"]

    modules = []
    for index, title in enumerate(module_titles, start=1):
        objectives = [
            f"Understand the key concepts behind {title}",
            f"Practice the tools and workflows used by a {target_role}",
            f"Produce evidence of skill through exercises or mini deliverables",
        ]
        modules.append(
            {
                "position": index,
                "title": title,
                "difficulty": difficulties[index - 1],
                "duration": f"{index + 1}h {index * 10}m",
                "learning_objectives": objectives,
                "lesson": {
                    "introduction": f"This lesson introduces {title} for a learner currently at {level} level.",
                    "theory": f"{title} combines conceptual understanding, implementation patterns, and decision-making needed for {target_role}. Focus on why the tools matter, when to use them, and how to evaluate tradeoffs.",
                    "examples": f"Example: convert the goal '{goal}' into a scoped deliverable, then break it into inputs, transformations, outputs, and evaluation criteria.",
                    "code_snippet": "def learning_checkpoint(goal: str) -> dict:\n    return {\"goal\": goal, \"status\": \"practice-ready\"}\n",
                    "tips": "Use active recall after each lesson and write one small artifact before moving on.",
                    "best_practices": "Keep notes, code, and project decisions in one repository so progress is reviewable.",
                    "common_mistakes": "Avoid passive consumption. Do not move to advanced material before you can explain the foundation.",
                    "summary": f"You now have the mental model and practice direction for {title}.",
                    "next_lesson": module_titles[index] if index < len(module_titles) else "Capstone review",
                },
                "resources": [
                    {"title": "Official Documentation", "url": "https://docs.python.org/3/", "resource_type": "Documentation"},
                    {"title": "Roadmap.sh", "url": "https://roadmap.sh", "resource_type": "Roadmap"},
                    {"title": "FreeCodeCamp", "url": "https://www.freecodecamp.org/news/", "resource_type": "Article"},
                    {"title": "GitHub Practice Repositories", "url": "https://github.com/topics", "resource_type": "Repository"},
                    {"title": "Practice Websites", "url": "https://www.hackerrank.com/", "resource_type": "Practice"},
                ],
                "quiz": {
                    "title": f"{title} Knowledge Check",
                    "questions": [
                        {
                            "question": f"What is the primary purpose of {title}?",
                            "options": ["To memorize terms", "To build usable skill", "To skip practice", "To avoid feedback"],
                            "correct_answer": "To build usable skill",
                            "explanation": "The platform focuses on applied learning and evidence of skill.",
                            "difficulty": difficulties[index - 1],
                        },
                        {
                            "question": "Which practice pattern best supports long-term learning?",
                            "options": ["Passive watching", "Active recall", "Random scrolling", "Skipping summaries"],
                            "correct_answer": "Active recall",
                            "explanation": "Active recall makes the learner retrieve and strengthen knowledge.",
                            "difficulty": "Beginner",
                        },
                        {
                            "question": "Why should learning objectives be explicit?",
                            "options": ["They guide assessment", "They make UI slower", "They hide progress", "They remove practice"],
                            "correct_answer": "They guide assessment",
                            "explanation": "Clear objectives make quizzes, projects, and feedback measurable.",
                            "difficulty": "Intermediate",
                        },
                        {
                            "question": "What should a module produce?",
                            "options": ["Only notes", "A skill artifact", "Nothing measurable", "A copied tutorial"],
                            "correct_answer": "A skill artifact",
                            "explanation": "Projects and exercises provide proof that the concept was learned.",
                            "difficulty": "Intermediate",
                        },
                        {
                            "question": "How should weak topics be handled?",
                            "options": ["Ignore them", "Review and repractice", "Delete the course", "Skip quizzes"],
                            "correct_answer": "Review and repractice",
                            "explanation": "Analytics recommendations should feed back into practice.",
                            "difficulty": "Advanced",
                        },
                    ],
                },
            }
        )

    projects = [
        {
            "title": f"{topic} Mini Project",
            "project_type": "Mini",
            "description": f"Build a focused starter artifact that demonstrates {topic} fundamentals.",
            "objectives": ["Define the problem", "Implement the core workflow", "Document decisions"],
            "skills": ["Problem scoping", "Implementation", "Reflection"],
            "technologies": ["Python", "Git", "Markdown"],
            "expected_output": "A runnable mini project with README and examples.",
            "difficulty": "Beginner",
            "submission_checklist": ["Repository created", "Core workflow works", "README explains usage"],
        },
        {
            "title": f"{topic} Intermediate Project",
            "project_type": "Intermediate",
            "description": f"Create a portfolio-ready workflow for a realistic {target_role} task.",
            "objectives": ["Model data", "Build features", "Add evaluation"],
            "skills": ["Architecture", "Testing", "Evaluation"],
            "technologies": ["FastAPI", "SQLite", "React"],
            "expected_output": "A working application slice with persisted data and clean UI.",
            "difficulty": "Intermediate",
            "submission_checklist": ["API documented", "Tests pass", "UI handles empty states"],
        },
        {
            "title": f"{topic} Capstone Project",
            "project_type": "Capstone",
            "description": f"Ship an end-to-end product-grade {topic} capstone.",
            "objectives": ["Design system", "Backend integration", "Deployment readiness"],
            "skills": ["Full-stack delivery", "Product thinking", "Deployment"],
            "technologies": ["React", "FastAPI", "Docker"],
            "expected_output": "A demo-ready product with authentication, data isolation, and analytics.",
            "difficulty": "Advanced",
            "submission_checklist": ["Docker runs", "Auth works", "User data isolated", "Demo script ready"],
        },
    ]

    interview_questions = [
        {
            "question_type": "Technical",
            "question": f"Explain the architecture of a production {topic} learning platform.",
            "hint": "Discuss frontend, backend, database, auth, and AI agents.",
            "expected_answer": "A strong answer separates UI, API, persistence, auth, orchestration, and agent output validation.",
            "difficulty": "Intermediate",
        },
        {
            "question_type": "Coding",
            "question": "Write a function that validates a generated module has objectives, lesson content, and quiz questions.",
            "hint": "Check required keys and list lengths.",
            "expected_answer": "Validate schema fields before persisting or rendering agent output.",
            "difficulty": "Intermediate",
        },
        {
            "question_type": "HR",
            "question": f"Why are you pursuing {target_role}?",
            "hint": "Connect motivation to evidence of work.",
            "expected_answer": "Explain goals, projects completed, and the learning process used to build competence.",
            "difficulty": "Beginner",
        },
        {
            "question_type": "Scenario",
            "question": "A user says recommendations feel generic. What would you change?",
            "hint": "Use profile, progress, quiz scores, and weak topics.",
            "expected_answer": "Improve personalization signals and update recommendations from actual activity.",
            "difficulty": "Advanced",
        },
    ]

    return {
        "title": _title_from_goal(goal),
        "goal": goal,
        "target_role": target_role,
        "difficulty": request.depth or "Balanced",
        "duration": duration,
        "modules": modules,
        "projects": projects,
        "interview_questions": interview_questions,
        "analytics": {
            "completion_percent": 0,
            "quiz_average": 0,
            "projects_completed": 0,
            "study_hours": 0,
            "weak_topics": ["No Data Yet"],
            "strong_topics": ["No Data Yet"],
            "learning_streak": 0,
            "recommendations": ["Start the first lesson to unlock personalized recommendations."],
        },
    }


def create_course(db: Session, user: User, request: CourseGenerateRequest) -> Course:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    payload = build_structured_course(request.goal, profile, request)

    course = Course(
        user_id=user.id,
        title=payload["title"],
        goal=payload["goal"],
        target_role=payload["target_role"],
        difficulty=payload["difficulty"],
    )
    db.add(course)
    db.flush()

    for module_data in payload["modules"]:
        module = CourseModule(
            course_id=course.id,
            position=module_data["position"],
            title=module_data["title"],
            difficulty=module_data["difficulty"],
            duration=module_data["duration"],
            learning_objectives=_json_list(module_data["learning_objectives"]),
        )
        db.add(module)
        db.flush()

        db.add(Lesson(module_id=module.id, **module_data["lesson"]))
        for resource in module_data["resources"]:
            db.add(Resource(module_id=module.id, **resource))

        quiz = Quiz(module_id=module.id, title=module_data["quiz"]["title"])
        db.add(quiz)
        db.flush()
        for question in module_data["quiz"]["questions"]:
            db.add(
                Question(
                    quiz_id=quiz.id,
                    question=question["question"],
                    options_json=_json_list(question["options"]),
                    correct_answer=question["correct_answer"],
                    explanation=question["explanation"],
                    difficulty=question["difficulty"],
                )
            )

        db.add(Progress(user_id=user.id, module_id=module.id))

    for project in payload["projects"]:
        db.add(
            CourseProject(
                course_id=course.id,
                title=project["title"],
                project_type=project["project_type"],
                description=project["description"],
                objectives=_json_list(project["objectives"]),
                skills=_json_list(project["skills"]),
                technologies=_json_list(project["technologies"]),
                expected_output=project["expected_output"],
                difficulty=project["difficulty"],
                submission_checklist=_json_list(project["submission_checklist"]),
            )
        )

    for interview in payload["interview_questions"]:
        db.add(InterviewQuestion(course_id=course.id, **interview))

    analytics = payload["analytics"]
    db.add(
        LearningAnalytics(
            course_id=course.id,
            completion_percent=analytics["completion_percent"],
            quiz_average=analytics["quiz_average"],
            projects_completed=analytics["projects_completed"],
            study_hours=analytics["study_hours"],
            weak_topics=_json_list(analytics["weak_topics"]),
            strong_topics=_json_list(analytics["strong_topics"]),
            learning_streak=analytics["learning_streak"],
            recommendations=_json_list(analytics["recommendations"]),
        )
    )

    db.commit()
    return get_course(db, user, course.id)


def get_course_query(db: Session):
    return db.query(Course).options(
        joinedload(Course.modules).joinedload(CourseModule.lesson),
        joinedload(Course.modules).joinedload(CourseModule.resources),
        joinedload(Course.modules).joinedload(CourseModule.quiz).joinedload(Quiz.questions),
        joinedload(Course.projects),
        joinedload(Course.interview_questions),
        joinedload(Course.analytics),
    )


def get_course(db: Session, user: User, course_id: int) -> Course | None:
    return get_course_query(db).filter(Course.id == course_id, Course.user_id == user.id).first()


def get_latest_course(db: Session, user: User) -> Course | None:
    return get_course_query(db).filter(Course.user_id == user.id).order_by(Course.created_at.desc()).first()


def serialize_course(course: Course) -> dict:
    modules = sorted(course.modules, key=lambda item: item.position)
    return {
        "id": course.id,
        "title": course.title,
        "goal": course.goal,
        "target_role": course.target_role,
        "difficulty": course.difficulty,
        "status": course.status,
        "completion_percent": course.completion_percent,
        "created_at": course.created_at,
        "modules": [
            {
                "id": module.id,
                "position": module.position,
                "title": module.title,
                "difficulty": module.difficulty,
                "duration": module.duration,
                "learning_objectives": _load_list(module.learning_objectives),
                "progress_percent": module.progress_percent,
                "lesson": module.lesson,
                "resources": module.resources,
                "quiz": {
                    "title": module.quiz.title,
                    "questions": [
                        {
                            "question": question.question,
                            "options": _load_list(question.options_json),
                            "correct_answer": question.correct_answer,
                            "explanation": question.explanation,
                            "difficulty": question.difficulty,
                        }
                        for question in module.quiz.questions
                    ],
                },
            }
            for module in modules
        ],
        "projects": [
            {
                "title": project.title,
                "project_type": project.project_type,
                "description": project.description,
                "objectives": _load_list(project.objectives),
                "skills": _load_list(project.skills),
                "technologies": _load_list(project.technologies),
                "expected_output": project.expected_output,
                "difficulty": project.difficulty,
                "submission_checklist": _load_list(project.submission_checklist),
            }
            for project in course.projects
        ],
        "interview_questions": course.interview_questions,
        "analytics": {
            "completion_percent": course.analytics.completion_percent,
            "quiz_average": course.analytics.quiz_average,
            "projects_completed": course.analytics.projects_completed,
            "study_hours": course.analytics.study_hours,
            "weak_topics": _load_list(course.analytics.weak_topics),
            "strong_topics": _load_list(course.analytics.strong_topics),
            "learning_streak": course.analytics.learning_streak,
            "recommendations": _load_list(course.analytics.recommendations),
        },
    }
