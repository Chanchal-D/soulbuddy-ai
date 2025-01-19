from pydantic import BaseModel
from typing import Optional

class BirthDetails(BaseModel):
    year: int
    month: int
    day: int
    hour: int
    minute: int
    city: str
    country: str
    gender: str

class ChatRequest(BaseModel):
    message: str
    birth_details: Optional[BirthDetails] = None

class ChatResponse(BaseModel):
    response: str 