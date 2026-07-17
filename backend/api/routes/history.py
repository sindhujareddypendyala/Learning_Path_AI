from fastapi import APIRouter

router = APIRouter(tags=["History"])

@router.get("/history")
async def history_endpoint():
    return {"message": "History endpoint placeholder"}
