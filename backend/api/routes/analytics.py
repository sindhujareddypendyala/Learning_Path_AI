from fastapi import APIRouter

router = APIRouter(tags=["Analytics"])

@router.get("/analytics")
async def analytics_endpoint():
    return {"message": "Analytics endpoint placeholder"}
