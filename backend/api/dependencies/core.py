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

from jose import jwt, JWTError
from fastapi import HTTPException, status
from backend.models.user import User

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    """
    Dependency that decodes the incoming JWT token, validates it, and fetches the
    corresponding user from the database. Raises 401 if validation or retrieval fails.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
