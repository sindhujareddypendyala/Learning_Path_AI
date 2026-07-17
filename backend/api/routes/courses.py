from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.api.dependencies.core import get_current_user, get_db
from backend.models.user import User
from backend.schemas.course_schema import CourseGenerateRequest, CourseOut
from backend.services import course_service

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.post("/generate", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def generate_course(
    request: CourseGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    course = course_service.create_course(db, current_user, request)
    return course_service.serialize_course(course)


@router.get("/current", response_model=CourseOut)
def get_current_course(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    course = course_service.get_latest_course(db, current_user)
    if not course:
        raise HTTPException(status_code=404, detail="No course generated yet")
    return course_service.serialize_course(course)


@router.get("/{course_id}", response_model=CourseOut)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    course = course_service.get_course(db, current_user, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course_service.serialize_course(course)
