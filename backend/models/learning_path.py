from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.models.base import Base

class LearningPath(Base):
    """
    SQLAlchemy ORM model representing the learning paths table in the database.
    Each user can have multiple cached learning paths based on the topic.
    """
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic = Column(String, index=True, nullable=False)
    path_data = Column(Text, nullable=False) # JSON-string representation of modules, projects, quizzes, and interviews
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="learning_paths")
