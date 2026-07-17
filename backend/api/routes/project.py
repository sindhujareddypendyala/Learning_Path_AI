from fastapi import APIRouter

router = APIRouter(tags=["Project"])

@router.post("/project")
async def project_endpoint():
    return {"message": "Project endpoint placeholder"}
