import sys
import os

# Ensure the root directory is in sys.path so 'backend.X' absolute imports always work
# regardless of whether the user runs from the root or the backend/ folder.
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure basic logging for the application entry point
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI.
    Handles startup and shutdown events cleanly, such as database connections
    and AI agent initializations.
    """
    logger.info("Starting LearnPath-AI Backend server...")
    # Future startup logic (e.g., Vector DB warmup, Agent registry) will execute here
    yield
    logger.info("Shutting down LearnPath-AI Backend server...")
    # Future shutdown logic (e.g., closing DB connection pools) will execute here


def create_app() -> FastAPI:
    """
    Application factory pattern to create and configure the FastAPI instance.
    """
    application = FastAPI(
        title="LearnPath-AI API",
        description="Core Backend for Multi-Agent Personalized Learning Platform",
        version="1.0.0",
        lifespan=lifespan,
    )

    # Configure CORS (Cross-Origin Resource Sharing) for frontend communication
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Should be restricted via config in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from backend.api.v1 import api_router
    from backend.utils.exceptions import global_exception_handler
    from backend.models.base import Base
    from backend.database.session import engine
    from backend.config.settings import settings

    # Create all database tables (For production, Alembic should be used instead)
    Base.metadata.create_all(bind=engine)

    # Add global exception handler
    application.add_exception_handler(Exception, global_exception_handler)


    @application.get("/", tags=["System"])
    async def root():
        return {"message": "LearnPath-AI API is running"}

    @application.get("/health", tags=["System"])
    async def health_check():
        """
        Health check endpoint for orchestration, CI/CD, and load balancing.
        """
        return {"status": "ok", "message": "LearnPath-AI Backend is running."}

    # Include API Routers
    application.include_router(api_router, prefix=settings.API_V1_STR)

    return application


# Create the global application instance
app = create_app()


if __name__ == "__main__":
    import uvicorn

    # Execute the server locally in development mode
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
