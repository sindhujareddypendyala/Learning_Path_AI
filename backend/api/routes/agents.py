from fastapi import APIRouter

router = APIRouter(tags=["Agents"])

@router.get("/agents")
async def agents_endpoint():
    return {"message": "Agents endpoint placeholder"}
