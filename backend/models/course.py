from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from backend.models.base import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    goal = Column(Text, nullable=False)
    target_role = Column(String, nullable=True)
    difficulty = Column(String, default="Beginner")
    status = Column(String, default="active")
    completion_percent = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    modules = relationship("CourseModule", back_populates="course", cascade="all, delete-orphan")
    projects = relationship("CourseProject", back_populates="course", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="course", cascade="all, delete-orphan")
    analytics = relationship("LearningAnalytics", back_populates="course", uselist=False, cascade="all, delete-orphan")


class CourseModule(Base):
    __tablename__ = "course_modules"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    position = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    learning_objectives = Column(Text, nullable=False)
    progress_percent = Column(Float, default=0)

    course = relationship("Course", back_populates="modules")
    lesson = relationship("Lesson", back_populates="module", uselist=False, cascade="all, delete-orphan")
    resources = relationship("Resource", back_populates="module", cascade="all, delete-orphan")
    quiz = relationship("Quiz", back_populates="module", uselist=False, cascade="all, delete-orphan")
    progress = relationship("Progress", back_populates="module", uselist=False, cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("course_modules.id", ondelete="CASCADE"), nullable=False, unique=True)
    introduction = Column(Text, nullable=False)
    theory = Column(Text, nullable=False)
    examples = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    tips = Column(Text, nullable=False)
    best_practices = Column(Text, nullable=False)
    common_mistakes = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    next_lesson = Column(String, nullable=True)

    module = relationship("CourseModule", back_populates="lesson")


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("course_modules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)

    module = relationship("CourseModule", back_populates="resources")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("course_modules.id", ondelete="CASCADE"), nullable=False, unique=True)
    title = Column(String, nullable=False)

    module = relationship("CourseModule", back_populates="quiz")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    options_json = Column(Text, nullable=False)
    correct_answer = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)

    quiz = relationship("Quiz", back_populates="questions")


class CourseProject(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    project_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    objectives = Column(Text, nullable=False)
    skills = Column(Text, nullable=False)
    technologies = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)
    submission_checklist = Column(Text, nullable=False)

    course = relationship("Course", back_populates="projects")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    question_type = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    hint = Column(Text, nullable=False)
    expected_answer = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)

    course = relationship("Course", back_populates="interview_questions")


class LearningAnalytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, unique=True)
    completion_percent = Column(Float, default=0)
    quiz_average = Column(Float, default=0)
    projects_completed = Column(Integer, default=0)
    study_hours = Column(Float, default=0)
    weak_topics = Column(Text, default="No Data Yet")
    strong_topics = Column(Text, default="No Data Yet")
    learning_streak = Column(Integer, default=0)
    recommendations = Column(Text, nullable=False)

    course = relationship("Course", back_populates="analytics")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module_id = Column(Integer, ForeignKey("course_modules.id", ondelete="CASCADE"), nullable=False, unique=True)
    status = Column(String, default="not_started")
    completion_percent = Column(Float, default=0)
    quiz_score = Column(Float, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    module = relationship("CourseModule", back_populates="progress")
