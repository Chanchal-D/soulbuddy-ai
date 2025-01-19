from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from enum import Enum
from datetime import datetime

class ZodiacSign(str, Enum):
    ARIES = "aries"
    TAURUS = "taurus"
    GEMINI = "gemini"
    CANCER = "cancer"
    LEO = "leo"
    VIRGO = "virgo"
    LIBRA = "libra"
    SCORPIO = "scorpio"
    SAGITTARIUS = "sagittarius"
    CAPRICORN = "capricorn"
    AQUARIUS = "aquarius"
    PISCES = "pisces"

class TimeFrame(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"

class Planet(str, Enum):
    SUN = "sun"
    MOON = "moon"
    MARS = "mars"
    MERCURY = "mercury"
    JUPITER = "jupiter"
    VENUS = "venus"
    SATURN = "saturn"
    RAHU = "rahu"
    KETU = "ketu"

class HouseTheme(BaseModel):
    area: str
    description: str
    planets: List[Planet]
    aspects: List[str]

class TransitInfo(BaseModel):
    planet: Planet
    house: int
    zodiac_sign: ZodiacSign
    degree: float
    is_retrograde: bool

class BirthDetails(BaseModel):
    year: int = Field(..., description="Birth year", example=1990)
    month: int = Field(..., description="Birth month (1-12)", example=1, ge=1, le=12)
    day: int = Field(..., description="Birth day (1-31)", example=1, ge=1, le=31)
    hour: int = Field(..., description="Birth hour (0-23)", example=12, ge=0, le=23)
    minute: int = Field(..., description="Birth minute (0-59)", example=30, ge=0, le=59)
    city: str = Field(..., description="Birth place city", example="Mumbai")
    country: str = Field(..., description="Birth place country", example="India")
    gender: str = Field(..., description="Gender", example="male")
    
    @property
    def birth_date(self) -> datetime:
        return datetime(self.year, self.month, self.day, self.hour, self.minute)

class HoroscopeRequest(BaseModel):
    time_frame: TimeFrame
    birth_details: Optional[BirthDetails] = None

    class Config:
        json_schema_extra = {
            "example": {
                "time_frame": "daily",
                "birth_details": {
                    "year": 1990,
                    "month": 1,
                    "day": 1,
                    "hour": 12,
                    "minute": 30,
                    "city": "Mumbai",
                    "country": "India",
                    "gender": "male"
                }
            }
        }

class NatalChart(BaseModel):
    ascendant: float
    ascendant_sign: ZodiacSign
    planet_positions: Dict[Planet, float]
    house_positions: Dict[Planet, int]

class HoroscopePrediction(BaseModel):
    general: str
    career: str
    love: str
    health: str
    finances: str
    lucky_number: int
    lucky_color: str
    transits: List[TransitInfo]
    natal_chart: Optional[NatalChart] = None  # Include natal chart if birth details provided
    timestamp: datetime 