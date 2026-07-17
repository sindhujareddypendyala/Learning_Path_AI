from fastapi import Request
from fastapi.responses import JSONResponse
from backend.config.logging import logger

async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches all unhandled exceptions globally to prevent server crashes 
    and returns a standardized JSON response.
    """
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error. Please try again later."},
    )
