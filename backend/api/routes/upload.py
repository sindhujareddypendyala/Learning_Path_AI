from fastapi import APIRouter

router = APIRouter(tags=["Upload"])

@router.post("/upload/pdf")
async def upload_pdf():
    return {"message": "Upload PDF endpoint"}

@router.post("/upload/url")
async def upload_url():
    return {"message": "Upload URL endpoint"}
