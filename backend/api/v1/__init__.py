from fastapi import APIRouter

from backend.api.routes.auth import router as auth_router
from backend.api.routes.learning_path import router as learning_path_router
from backend.api.routes.upload import router as upload_router
from backend.api.routes.users import router as users_router
from backend.api.routes.courses import router as courses_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(learning_path_router)
api_router.include_router(upload_router)
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(courses_router)
