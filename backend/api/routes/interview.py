from fastapi import APIRouter

router = APIRouter(tags=["Interview"])

@router.post("/interview")
async def interview_endpoint():
    return {"message": "Interview endpoint placeholder"}
