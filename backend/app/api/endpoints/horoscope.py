from fastapi import APIRouter, HTTPException
from app.models.horoscope_schemas import (
    HoroscopeRequest,
    HoroscopePrediction,
    TimeFrame
)
from app.services.horoscope_service import HoroscopeService
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/predict", response_model=HoroscopePrediction)
async def generate_horoscope(request: HoroscopeRequest):
    """
    Generate a horoscope prediction based on time frame.
    If birth_details is provided, includes natal aspects.
    """
    try:
        logger.debug("Received request: %s", request.dict())
        
        horoscope_service = HoroscopeService()
        
        # Calculate transits
        transits = horoscope_service.calculate_current_transits()
        logger.debug("Calculated transits: %s", [t.dict() for t in transits])
        
        # Generate prediction using birth details if provided
        prediction = horoscope_service.generate_prediction(
            time_frame=request.time_frame,
            birth_details=request.birth_details,
            transits=transits
        )
        logger.debug("Generated prediction: %s", prediction.dict())
        
        return prediction
        
    except Exception as e:
        logger.error("Error in generate_horoscope: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transits/current")
async def get_current_transits():
    """
    Get current planetary transits with their degrees and house positions.
    """
    try:
        horoscope_service = HoroscopeService()
        transits = horoscope_service.calculate_current_transits()
        return {"transits": transits}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 