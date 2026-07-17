import logging
import sys
import os

# Add root directory to Python path so backend modules can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models.base import Base
from backend.database.session import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Forces the creation of all SQLAlchemy tables based on the current models."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully in database/sqlite.db")

if __name__ == "__main__":
    init_db()
