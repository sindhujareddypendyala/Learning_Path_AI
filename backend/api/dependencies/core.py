from typing import Generator
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

# These modules will be implemented in the database/ and config/ folders
from backend.database.session import SessionLocal
from backend.config import settings

# Defines the standard OAuth2 URL where clients will send credentials to obtain a JWT token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session per request.
    Yields the active SQLAlchemy session and ensures it is safely closed 
    after the HTTP request cycle finishes, preventing connection leaks.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
