from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.api.router import router
from app.core.logging_config import setup_logging
from app.routers import chatbot_router, recommendation_router, user_router

# Setup logging
setup_logging()

app = FastAPI(
    title="Vedic Astrology API",
    description="API for Kundali Generation and Horoscope Predictions",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(router, prefix="/api")
app.include_router(chatbot_router.router)
app.include_router(recommendation_router.router, prefix="/api")
app.include_router(user_router.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 