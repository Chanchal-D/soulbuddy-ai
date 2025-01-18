from fastapi import APIRouter
from .endpoints import kundali, horoscope

router = APIRouter()

# Include the kundali router
router.include_router(
    kundali.router,
    prefix="/kundali",
    tags=["Kundali"]
)

# Include the horoscope router
router.include_router(
    horoscope.router,
    prefix="/horoscope",
    tags=["Horoscope"]
) 