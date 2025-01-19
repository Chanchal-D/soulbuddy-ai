from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.recommendation_service import RecommendationService
from ..models.horoscope_schemas import BirthDetails
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"]
)

class BirthDetailsRequest(BaseModel):
    year: int
    month: int
    day: int
    hour: int
    minute: int
    city: str
    country: str
    gender: str

class RecommendationRequest(BaseModel):
    birth_details: BirthDetailsRequest | None = None

@router.post("/personalized")
async def get_personalized_recommendations(request: RecommendationRequest):
    try:
        if not request.birth_details:
            logger.error("Birth details missing in request")
            raise HTTPException(status_code=400, detail="Birth details are required")
            
        logger.info(f"Received request with birth details: {request.birth_details}")
            
        try:
            # Convert request birth details to BirthDetails model
            birth_details = BirthDetails(
                year=request.birth_details.year,
                month=request.birth_details.month,
                day=request.birth_details.day,
                hour=request.birth_details.hour,
                minute=request.birth_details.minute,
                city=request.birth_details.city,
                country=request.birth_details.country,
                gender=request.birth_details.gender
            )
        except Exception as e:
            logger.error(f"Error converting birth details: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid birth details format: {str(e)}")
        
        try:
            # Get recommendations using the service
            recommendations = await RecommendationService().get_personalized_recommendations(birth_details)
            
            return {
                "status": "success",
                "recommendations": recommendations
            }
        except ValueError as e:
            logger.error(f"Value error in recommendation service: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in recommendation endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") 