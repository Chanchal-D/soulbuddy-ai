from pydantic import BaseModel, EmailStr

class SubscriptionRequest(BaseModel):
    email: EmailStr

class SubscriptionResponse(BaseModel):
    message: str 