from fastapi import APIRouter, HTTPException
from app.models.subscription_schemas import SubscriptionRequest, SubscriptionResponse
from app.services.subscription_service import SubscriptionService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
subscription_service = SubscriptionService()

@router.post("/subscribe", response_model=SubscriptionResponse)
async def subscribe(request: SubscriptionRequest):
    """
    Subscribe to the newsletter and receive a welcome email.
    """
    try:
        error = await subscription_service.send_welcome_email(request.email)
        if error:
            raise HTTPException(status_code=500, detail=error)
            
        return SubscriptionResponse(message="Successfully subscribed! Please check your email.")
        
    except Exception as e:
        logger.error(f"Subscription error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 