from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    # Enables Pydantic to read data from SQLAlchemy ORM models
    model_config = ConfigDict(from_attributes=True)

from typing import Optional
from datetime import datetime

class UserProfileBase(BaseModel):
    full_name: Optional[str] = None
    learning_goal: Optional[str] = None
    target_role: Optional[str] = None
    current_skill_level: Optional[str] = None
    education: Optional[str] = None
    languages_known: Optional[str] = None
    technologies: Optional[str] = None
    learning_style: Optional[str] = None
    daily_study_hours: Optional[str] = None
    weekly_goal: Optional[str] = None
    target_completion_date: Optional[str] = None
    experience_level: Optional[str] = None
    career_objective: Optional[str] = None
    preferred_difficulty: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class LearningPathBase(BaseModel):
    topic: str
    path_data: str

class LearningPathCreate(LearningPathBase):
    pass

class LearningPathResponse(LearningPathBase):
    id: int
    user_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
