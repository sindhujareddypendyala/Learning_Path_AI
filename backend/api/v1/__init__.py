from fastapi import APIRouter

from backend.api.routes.auth import router as auth_router
from backend.api.routes.chat import router as chat_router
from backend.api.routes.learning_path import router as learning_path_router
from backend.api.routes.content import router as content_router
from backend.api.routes.assessment import router as assessment_router
from backend.api.routes.project import router as project_router
from backend.api.routes.interview import router as interview_router
from backend.api.routes.analytics import router as analytics_router
from backend.api.routes.history import router as history_router
from backend.api.routes.upload import router as upload_router
from backend.api.routes.agents import router as agents_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(chat_router)
api_router.include_router(learning_path_router)
api_router.include_router(content_router)
api_router.include_router(assessment_router)
api_router.include_router(project_router)
api_router.include_router(interview_router)
api_router.include_router(analytics_router)
api_router.include_router(history_router)
api_router.include_router(upload_router)
api_router.include_router(agents_router)
