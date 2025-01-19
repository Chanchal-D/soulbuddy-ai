import swisseph as swe
import matplotlib.pyplot as plt
import numpy as np
from typing import Dict, List, Tuple
import math
from datetime import datetime, timezone
from app.models.schemas import BirthDetails
import groq
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class KundaliGenerator:
    def __init__(self):
        # Initialize Swiss Ephemeris and Groq client
        swe.set_ephe_path()
        self.current_figure = None
        self.groq_client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        # Define planets and their symbols
        self.planets = {
            'Sun': '☉',
            'Moon': '☽',
            'Mars': '♂',
            'Mercury': '☿',
            'Jupiter': '♃',
            'Venus': '♀',
            'Saturn': '♄',
            'Rahu': '☊',
            'Ketu': '☋'
        }
        
        # Define zodiac signs and their symbols
        self.zodiac_signs = [
            'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋',
            'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏',
            'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
        ]

    def calculate_planet_positions(self, birth_details: BirthDetails) -> Dict[str, float]:
        """Calculate positions of planets at time of birth"""
        # Convert local time to UTC
        local_datetime = datetime.combine(birth_details.date, birth_details.time)
        utc_datetime = local_datetime.replace(tzinfo=timezone.utc)
        julian_day = swe.julday(
            birth_details.date.year,
            birth_details.date.month,
            birth_details.date.day,
            birth_details.time.hour + birth_details.time.minute/60.0
        )
        
        # Calculate positions for each planet
        planet_positions = {}
        
        # Map of planets to their Swiss Ephemeris constants
        planet_map = {
            'Sun': swe.SUN,
            'Moon': swe.MOON,
            'Mars': swe.MARS,
            'Mercury': swe.MERCURY,
            'Jupiter': swe.JUPITER,
            'Venus': swe.VENUS,
            'Saturn': swe.SATURN,
            'Rahu': swe.MEAN_NODE  # North Node
        }
        
        for planet, swe_constant in planet_map.items():
            position = swe.calc_ut(julian_day, swe_constant)[0]
            planet_positions[planet] = position[0]
        
        # Calculate Ketu (South Node) as opposite to Rahu
        planet_positions['Ketu'] = (planet_positions['Rahu'] + 180) % 360
        
        return planet_positions

    def calculate_ascendant(self, birth_details: BirthDetails) -> Tuple[float, List[float]]:
        """Calculate the ascendant (Lagna) and house cusps at time of birth"""
        julian_day = swe.julday(
            birth_details.date.year,
            birth_details.date.month,
            birth_details.date.day,
            birth_details.time.hour + birth_details.time.minute/60.0
        )
        
        # Calculate houses using Placidus system
        houses = swe.houses(
            julian_day,
            birth_details.latitude,
            birth_details.longitude,
            b'P'  # Placidus house system
        )
        
        # Extract the ascendant and house cusps
        ascendant = houses[1][0]  # First house cusp (ascendant)
        house_cusps = list(houses[0])  # All house cusps
        
        return ascendant, house_cusps

    def draw_kundali_chart(self, planet_positions: Dict[str, float], ascendant: float):
        """Draw a beautiful Kundali chart using matplotlib"""
        # Create figure with white background
        self.current_figure, ax = plt.subplots(figsize=(12, 12), subplot_kw={'projection': 'polar'}, facecolor='white')
        
        # Set up the plot
        ax.set_theta_direction(-1)  # Clockwise
        ax.set_theta_zero_location('N')  # 0 degrees at top
        
        # Draw circles
        radii = [0.3, 0.6, 1.0]
        for r in radii:
            circle = plt.Circle((0, 0), r, transform=ax.transData._b, fill=False, color='black')
            ax.add_artist(circle)
        
        # Draw house lines
        angles = np.linspace(0, 2*np.pi, 13)[:-1]  # 12 equal divisions
        for angle in angles:
            ax.plot([angle, angle], [0.3, 1], color='black', linewidth=1)
        
        # Add zodiac signs
        for i, sign in enumerate(self.zodiac_signs):
            angle = np.pi/2 - (i * np.pi/6)  # Start from top and go clockwise
            ax.text(angle, 1.1, sign, ha='center', va='center')
        
        # Add planets to their positions
        for planet, pos in planet_positions.items():
            angle = np.pi/2 - np.radians(pos)  # Convert to radians and adjust for plot orientation
            symbol = self.planets[planet]
            ax.text(angle, 0.45, f"{symbol} {planet}", ha='center', va='center')
        
        # Add ascendant marker
        asc_angle = np.pi/2 - np.radians(ascendant)
        ax.plot([asc_angle, asc_angle], [0.3, 1], color='red', linewidth=2)
        ax.text(asc_angle, 1.15, "ASC", color='red', ha='center', va='center')
        
        # Remove default grid and labels
        ax.grid(False)
        ax.set_xticks([])
        ax.set_yticks([])
        
        # Add watermark or credits
        self.current_figure.text(0.99, 0.01, "Generated by SoulBuddy",
                    ha='right', va='bottom', alpha=0.5, fontsize=8)
        
        # Adjust layout
        plt.tight_layout()
        return self.current_figure

    def generate_house_insights(self, house_cusps: List[float], ascendant: float) -> Dict[str, str]:
        """Generate insights about house placements and ascendant using Groq LLM"""
        # Prepare the house and ascendant information
        house_info = {
            f"House {i+1}": f"{house_cusps[i]:.2f}°"
            for i in range(12)
        }
        ascendant_info = f"{ascendant:.2f}°"
        
        # Create prompt for the LLM
        prompt = f"""As a Vedic astrology expert, analyze the following house cusps and ascendant positions:

Ascendant: {ascendant_info}

House Positions:
{chr(10).join([f'{k}: {v}' for k, v in house_info.items()])}

Based on these positions, provide 5 key insights about:
1. The person's life path and personality (based on Ascendant)
2. Career and public standing (10th house)
3. Relationships and partnerships (7th house)
4. Wealth and possessions (2nd house)
5. Home and emotional well-being (4th house)

Format each insight on a new line starting with the number (1., 2., etc.) followed by your insight. """

        # Generate insights using Groq
        try:
            completion = self.groq_client.chat.completions.create(
                messages=[{
                    "role": "user",
                    "content": prompt
                }],
                model="mixtral-8x7b-32768",
                temperature=0.7,
                max_tokens=1000
            )
            
            # Extract and process insights
            content = completion.choices[0].message.content
            
            # Split insights into a dictionary
            import re
            insights_dict = {}
            
            # Split content into lines and process each line
            lines = content.split('\n')
            current_number = None
            current_text = []
            
            for line in lines:
                # Check if line starts with a number
                number_match = re.match(r'(\d+)\.', line)
                if number_match:
                    # If we have previous content, save it
                    if current_number is not None:
                        insights_dict[str(current_number)] = ' '.join(current_text).strip()
                        current_text = []
                    
                    # Start new number
                    current_number = int(number_match.group(1))
                    # Add text after the number
                    current_text.append(re.sub(r'^\d+\.', '', line).strip())
                elif line.strip() and current_number is not None:
                    # Continue previous insight
                    current_text.append(line.strip())
            
            # Add the last insight
            if current_number is not None and current_text:
                insights_dict[str(current_number)] = ' '.join(current_text).strip()
            
            return insights_dict
            
        except Exception as e:
            print(f"Error generating insights: {str(e)}")
            return {"error": "Unable to generate insights. Please check your Groq API key and try again."}

    def generate_kundali(self, birth_details: BirthDetails) -> Dict:
        """Generate complete Kundali data"""
        # Calculate planetary positions
        print("Calculating planetary positions...")
        planet_positions = self.calculate_planet_positions(birth_details)
        
        # Calculate ascendant and houses
        print("Calculating ascendant and houses...")
        ascendant, house_cusps = self.calculate_ascendant(birth_details)
        
        # Generate insights using Groq
        print("Generating astrological insights...")
        insights = self.generate_house_insights(house_cusps, ascendant)
        
        # Draw the chart
        print("Drawing Kundali chart...")
        self.draw_kundali_chart(planet_positions, ascendant)
        
        # Prepare response data
        kundali_data = {
            "birth_details": {
                "date": birth_details.date.isoformat(),
                "time": birth_details.time.isoformat(),
                "location": {
                    "city": birth_details.city,
                    "country": birth_details.country,
                    "latitude": birth_details.latitude,
                    "longitude": birth_details.longitude
                }
            },
            "ascendant": ascendant,
            "house_cusps": house_cusps,
            "planet_positions": planet_positions,
            "insights": insights
        }
        
        print("\nKundali generation complete!")
        return kundali_data 