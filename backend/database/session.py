from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.config.settings import settings

# Configure SQLite database engine
engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False} # Needed for SQLite in FastAPI
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
