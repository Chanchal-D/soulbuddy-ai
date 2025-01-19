from typing import List, Dict, Optional
import os
from groq import Groq
from dotenv import load_dotenv
from ..models.chat_models import BirthDetails

load_dotenv()

class ChatbotService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.chat_history: Dict[str, List[Dict[str, str]]] = {}
        
    def _get_system_prompt(self, birth_details: Optional[BirthDetails] = None) -> str:
        base_prompt = """You are SoulBuddy, a compassionate and insightful AI companion focused on spiritual and personal growth. 
        You provide thoughtful guidance while maintaining a balance between being supportive and encouraging self-reflection. 
        Your responses should be warm, empathetic, and grounded in wisdom, while avoiding any harmful or inappropriate advice. Give Short and concise answers."""
        
        if birth_details:
            birth_info = f"""
            The user was born on {birth_details.day}/{birth_details.month}/{birth_details.year} 
            at {birth_details.hour}:{birth_details.minute} in {birth_details.city}, {birth_details.country}. 
            Their gender is {birth_details.gender}. Use this astrological information to provide more personalized guidance 
            when relevant, but don't force astrological references if they don't naturally fit the conversation."""
            return base_prompt + birth_info
        
        return base_prompt
    
    async def chat(self, user_id: str, message: str, birth_details: Optional[BirthDetails] = None) -> str:
        # Initialize chat history for new users
        if user_id not in self.chat_history:
            self.chat_history[user_id] = []
            
        # Add user message to history
        self.chat_history[user_id].append({"role": "user", "content": message})
        
        # Prepare messages for the API call
        messages = [{"role": "system", "content": self._get_system_prompt(birth_details)}]
        messages.extend(self.chat_history[user_id][-10:])  # Keep last 10 messages for context
        
        try:
            # Make API call to Groq
            response = self.client.chat.completions.create(
                model="mixtral-8x7b-32768",  # Using Mixtral model for better performance
                messages=messages,
                temperature=0.7,
                max_tokens=600,
                top_p=1,
                stream=False
            )
            
            # Extract the response
            assistant_message = response.choices[0].message.content
            
            # Add assistant response to history
            self.chat_history[user_id].append({"role": "assistant", "content": assistant_message})
            
            return assistant_message
            
        except Exception as e:
            print(f"Error in chatbot service: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again later."
    
    def clear_history(self, user_id: str) -> None:
        """Clear chat history for a specific user"""
        if user_id in self.chat_history:
            self.chat_history[user_id] = [] 