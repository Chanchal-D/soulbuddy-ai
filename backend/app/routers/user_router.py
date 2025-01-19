from fastapi import APIRouter, HTTPException
from ..models.horoscope_schemas import BirthDetails

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

@router.get("/birth-details")
async def get_user_birth_details():
    """
    Temporary endpoint that returns mock birth details.
    In production, this would fetch from user's profile in database.
    """
    try:
        # Mock birth details for testing
        return {
            "day": 15,
            "month": 8,
            "year": 1995,
            "hour": 14,
            "minute": 30,
            "city": "New York",
            "country": "USA",
            "gender": "female"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching birth details: {str(e)}"
        ) 