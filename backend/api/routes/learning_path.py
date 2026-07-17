from fastapi import APIRouter

router = APIRouter(tags=["Learning Path"])

@router.post("/learning-path")
async def learning_path_endpoint():
    return {"message": "Learning Path endpoint placeholder"}
