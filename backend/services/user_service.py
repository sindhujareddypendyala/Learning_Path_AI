from sqlalchemy.orm import Session
from backend.models.user import User
from backend.schemas.user_schema import UserCreate
from backend.config.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    """Fetches a user from the database by email."""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    """Hashes the password and saves a new user to the database."""
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
