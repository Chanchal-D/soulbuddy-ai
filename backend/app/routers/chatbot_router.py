from fastapi import APIRouter, Depends, HTTPException
from ..services.chatbot_service import ChatbotService
from ..models.chat_models import ChatRequest, ChatResponse
import uuid

router = APIRouter(tags=["chat"])
chatbot_service = ChatbotService()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    try:
        # Generate a unique user ID for this session
        user_id = str(uuid.uuid4())
        
        response = await chatbot_service.chat(
            user_id=user_id,
            message=request.message,
            birth_details=request.birth_details
        )
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/clear-history")
async def clear_chat_history(user_id: str):
    try:
        chatbot_service.clear_history(user_id)
        return {"message": "Chat history cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 