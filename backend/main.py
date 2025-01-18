from fastapi import FastAPI
from app.api.router import router
from app.core.logging_config import setup_logging

# Setup logging
setup_logging()

app = FastAPI(
    title="Vedic Astrology API",
    description="API for Kundali Generation and Horoscope Predictions",
    version="1.0.0"
)

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 