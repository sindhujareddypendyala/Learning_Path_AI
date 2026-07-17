from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class CourseGenerateRequest(BaseModel):
    goal: str
    target_role: Optional[str] = None
    weekly_schedule: Optional[str] = None
    depth: Optional[str] = "Balanced"


class ResourceOut(BaseModel):
    title: str
    url: str
    resource_type: str
    model_config = ConfigDict(from_attributes=True)


class QuestionOut(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str
    difficulty: str


class QuizOut(BaseModel):
    title: str
    questions: List[QuestionOut]


class LessonOut(BaseModel):
    introduction: str
    theory: str
    examples: str
    code_snippet: Optional[str] = None
    tips: str
    best_practices: str
    common_mistakes: str
    summary: str
    next_lesson: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class ModuleOut(BaseModel):
    id: int
    position: int
    title: str
    difficulty: str
    duration: str
    learning_objectives: List[str]
    progress_percent: float
    lesson: LessonOut
    resources: List[ResourceOut]
    quiz: QuizOut
    model_config = ConfigDict(from_attributes=True)


class ProjectOut(BaseModel):
    title: str
    project_type: str
    description: str
    objectives: List[str]
    skills: List[str]
    technologies: List[str]
    expected_output: str
    difficulty: str
    submission_checklist: List[str]


class InterviewQuestionOut(BaseModel):
    question_type: str
    question: str
    hint: str
    expected_answer: str
    difficulty: str
    model_config = ConfigDict(from_attributes=True)


class AnalyticsOut(BaseModel):
    completion_percent: float
    quiz_average: float
    projects_completed: int
    study_hours: float
    weak_topics: List[str]
    strong_topics: List[str]
    learning_streak: int
    recommendations: List[str]


class CourseOut(BaseModel):
    id: int
    title: str
    goal: str
    target_role: Optional[str]
    difficulty: str
    status: str
    completion_percent: float
    created_at: datetime
    modules: List[ModuleOut]
    projects: List[ProjectOut]
    interview_questions: List[InterviewQuestionOut]
    analytics: AnalyticsOut
    model_config = ConfigDict(from_attributes=True)
