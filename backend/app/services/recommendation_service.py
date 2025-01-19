from typing import List, Dict, Optional
import os
import json
from groq import Groq
from dotenv import load_dotenv
from .horoscope_service import HoroscopeService
from ..models.horoscope_schemas import BirthDetails, TransitInfo
import uuid
import logging

logger = logging.getLogger(__name__)
load_dotenv()

class RecommendationService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            logger.error("GROQ_API_KEY not found in environment variables")
            raise ValueError("GROQ_API_KEY not found")
        self.client = Groq(api_key=api_key)
        self.horoscope_service = HoroscopeService()

    def _generate_prompt(self, birth_details: BirthDetails, transits: List[TransitInfo]) -> str:
        """Generate a prompt for the LLM to create personalized recommendations"""
        try:
            transit_info = "\n".join([
                f"{t.planet.value} in {t.zodiac_sign.value} ({t.house}th house)"
                for t in transits
            ])

            prompt = f"""As a spiritual advisor with expertise in astrology, generate personalized recommendations 
            for someone with the following birth and transit details:

            Birth Details:
            Date: {birth_details.day}/{birth_details.month}/{birth_details.year}
            Time: {birth_details.hour}:{birth_details.minute}
            Location: {birth_details.city}, {birth_details.country}

            Current Planetary Transits:
            {transit_info}

            Based on these astrological factors, generate 6 highly personalized recommendations in the following categories:
            - 2 Crystal recommendations
            - 1 Book recommendation
            - 2 Spiritual Practice recommendations
            - 1 Ritual recommendation

            For each recommendation, provide:
            1. A title
            2. A brief but compelling description (1-2 sentences)
            3. An affinity score (0-100) based on how well it aligns with their current astrological placements
            4. A general rating (1-5, one decimal place) based on overall effectiveness

            Return the recommendations in a JSON array format where each recommendation has these exact fields:
            - id (string, use a simple number like "1", "2", etc.)
            - title (string)
            - description (string)
            - category (string, one of: "crystals", "books", "practices", "rituals")
            - affinity (number between 0-100)
            - rating (number between 1-5)

            Ensure the response is valid JSON and includes exactly 6 recommendations."""

            return prompt
        except Exception as e:
            logger.error(f"Error generating prompt: {str(e)}")
            raise

    async def get_personalized_recommendations(self, birth_details: BirthDetails) -> List[Dict]:
        try:
            logger.info(f"Generating recommendations for birth details: {birth_details}")
            
            # Get current transits
            transits = self.horoscope_service.calculate_current_transits()
            logger.info(f"Calculated transits: {transits}")

            # Generate recommendations using Groq
            prompt = self._generate_prompt(birth_details, transits)
            logger.info("Generated prompt for LLM")

            completion = self.client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert spiritual advisor and astrologer. Always respond with valid JSON arrays."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1000,
                top_p=1
            )

            # Parse and process recommendations
            response_content = completion.choices[0].message.content
            logger.info(f"Raw LLM response: {response_content}")

            try:
                # Try to parse the JSON response
                recommendations = json.loads(response_content)
                if not isinstance(recommendations, list):
                    logger.error(f"Invalid response format. Expected list but got: {type(recommendations)}")
                    raise ValueError("Response is not a JSON array")
                
                # Validate each recommendation
                for rec in recommendations:
                    required_fields = ['title', 'description', 'category', 'affinity', 'rating']
                    missing_fields = [field for field in required_fields if field not in rec]
                    if missing_fields:
                        logger.error(f"Missing required fields in recommendation: {missing_fields}")
                        raise ValueError(f"Recommendation missing required fields: {missing_fields}")
                    
                    # Ensure each recommendation has a unique ID
                    if 'id' not in rec or not rec['id']:
                        rec['id'] = str(uuid.uuid4())

                logger.info(f"Successfully processed {len(recommendations)} recommendations")
                return recommendations

            except json.JSONDecodeError as e:
                logger.error(f"Error parsing JSON response: {e}")
                logger.error(f"Raw response: {response_content}")
                raise ValueError(f"Invalid JSON response from LLM: {str(e)}")

        except Exception as e:
            logger.error(f"Error in get_personalized_recommendations: {str(e)}")
            raise

    def _get_default_recommendations(self) -> List[Dict]:
        """Return default recommendations if personalized ones can't be generated"""
        return [
            {
                "id": "1",
                "title": "Amethyst Crystal",
                "description": "A powerful stone for spiritual growth and inner peace. Perfect for meditation and stress relief.",
                "category": "crystals",
                "rating": 4.8,
                "affinity": 85
            },
            {
                "id": "2",
                "title": "The Power of Now",
                "description": "Essential reading for spiritual awakening and mindfulness practice by Eckhart Tolle.",
                "category": "books",
                "rating": 4.9,
                "affinity": 90
            },
            {
                "id": "3",
                "title": "Morning Meditation",
                "description": "Start your day with 10 minutes of mindful breathing to center yourself and set positive intentions.",
                "category": "practices",
                "rating": 4.7,
                "affinity": 88
            },
            {
                "id": "4",
                "title": "Full Moon Ritual",
                "description": "A powerful cleansing and manifestation ritual to perform during the full moon phase.",
                "category": "rituals",
                "rating": 4.6,
                "affinity": 82
            },
            {
                "id": "5",
                "title": "Rose Quartz",
                "description": "The stone of universal love, promoting healing and emotional well-being.",
                "category": "crystals",
                "rating": 4.7,
                "affinity": 87
            },
            {
                "id": "6",
                "title": "Loving-Kindness Practice",
                "description": "A heart-centered meditation practice to cultivate compassion for yourself and others.",
                "category": "practices",
                "rating": 4.8,
                "affinity": 89
            }
        ] 