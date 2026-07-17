import logging
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.session import SessionLocal
from backend.services.user_service import create_user
from backend.schemas.user_schema import UserCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed():
    """Seeds the database with an initial admin user."""
    db = SessionLocal()
    try:
        logger.info("Seeding initial admin user...")
        admin = UserCreate(email="admin@learnpath.ai", password="admin_password")
        create_user(db, admin)
        logger.info("Seeding complete.")
    except Exception as e:
        logger.error(f"Error seeding data: {e}. It may already exist.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
