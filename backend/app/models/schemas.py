from pydantic import BaseModel
from datetime import date, time
from dataclasses import dataclass
from typing import Optional

class BirthDetailsRequest(BaseModel):
    year: int
    month: int
    day: int
    hour: int
    minute: int
    city: str
    country: str
    gender: str

class KundaliResponse(BaseModel):
    kundali_data: dict
    chart_base64: str
    analysis_text: str

@dataclass
class BirthDetails:
    date: date
    time: time
    city: str
    latitude: float
    longitude: float
    gender: str
    country: str = None 