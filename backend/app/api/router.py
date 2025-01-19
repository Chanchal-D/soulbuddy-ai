from fastapi import APIRouter
from .endpoints import kundali, horoscope
from ..routers.chatbot_router import router as chat_router

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

# Include the chat router
router.include_router(
    chat_router,
    tags=["Chat"]
) 