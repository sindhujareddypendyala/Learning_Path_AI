from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.base import Base

class User(Base):
    """
    SQLAlchemy ORM model representing the users table in the database.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    learning_paths = relationship("LearningPath", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    """
    SQLAlchemy ORM model representing user profiles containing details.
    """
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    full_name = Column(String, nullable=True)
    learning_goal = Column(String, nullable=True)
    target_role = Column(String, nullable=True)
    current_skill_level = Column(String, nullable=True)
    education = Column(String, nullable=True)
    languages_known = Column(String, nullable=True)
    technologies = Column(String, nullable=True)
    learning_style = Column(String, nullable=True)
    daily_study_hours = Column(String, nullable=True)
    weekly_goal = Column(String, nullable=True)
    target_completion_date = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    career_objective = Column(String, nullable=True)
    preferred_difficulty = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="profile")
