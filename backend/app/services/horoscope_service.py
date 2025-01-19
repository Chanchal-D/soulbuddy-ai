import swisseph as swe
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple
from app.models.horoscope_schemas import (
    ZodiacSign, TimeFrame, Planet, TransitInfo,
    HoroscopePrediction, NatalChart, BirthDetails
)
import random
import logging
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable

logger = logging.getLogger(__name__)

class HoroscopeService:
    def __init__(self):
        # Initialize Swiss Ephemeris and geocoder
        swe.set_ephe_path()
        self.geolocator = Nominatim(user_agent="horoscope_app")
        
        # Planet to Swiss Ephemeris constant mapping
        self.planet_map = {
            Planet.SUN: swe.SUN,
            Planet.MOON: swe.MOON,
            Planet.MARS: swe.MARS,
            Planet.MERCURY: swe.MERCURY,
            Planet.JUPITER: swe.JUPITER,
            Planet.VENUS: swe.VENUS,
            Planet.SATURN: swe.SATURN,
            Planet.RAHU: swe.MEAN_NODE,  # North Node
        }

    def calculate_current_transits(self) -> List[TransitInfo]:
        """Calculate current planetary positions"""
        try:
            # Reset to tropical mode for transit calculations
            swe.set_sid_mode(swe.SIDM_FAGAN_BRADLEY)
            
            current_time = datetime.now(timezone.utc)
            julian_day = swe.julday(
                current_time.year,
                current_time.month,
                current_time.day,
                current_time.hour + current_time.minute/60.0
            )
            logger.debug(f"Calculating transits for JD: {julian_day}")
            
            transits = []
            for planet, swe_planet in self.planet_map.items():
                try:
                    flags = swe.FLG_SIDEREAL | swe.FLG_SPEED
                    position = swe.calc_ut(julian_day, swe_planet, flags)
                    longitude = position[0][0]
                    is_retrograde = position[0][3] < 0
                    
                    zodiac_sign = self.get_zodiac_sign(longitude)
                    house = self.get_house_number(longitude)
                    degree = longitude % 30
                    
                    transit = TransitInfo(
                        planet=planet,
                        zodiac_sign=zodiac_sign,
                        house=house,
                        degree=degree,
                        is_retrograde=is_retrograde
                    )
                    transits.append(transit)
                    
                    logger.debug(f"Transit calculated - {planet.value}: {zodiac_sign.value} {degree:.2f}°{' (R)' if is_retrograde else ''}")
                except swe.Error as e:
                    logger.error(f"Error calculating transit for {planet}: {e}")
                    continue
            
            # Calculate Ketu transit
            rahu_transit = next((t for t in transits if t.planet == Planet.RAHU), None)
            if rahu_transit:
                # Calculate Ketu's position (opposite to Rahu)
                ketu_longitude = (self.get_zodiac_degrees(rahu_transit.zodiac_sign) + rahu_transit.degree + 180) % 360
                ketu_sign = self.get_zodiac_sign(ketu_longitude)
                ketu_house = self.get_house_number(ketu_longitude)
                ketu_degree = ketu_longitude % 30
                
                transits.append(TransitInfo(
                    planet=Planet.KETU,
                    zodiac_sign=ketu_sign,
                    house=ketu_house,
                    degree=ketu_degree,
                    is_retrograde=rahu_transit.is_retrograde
                ))
                logger.debug(f"Ketu transit calculated: {ketu_sign.value} {ketu_degree:.2f}°")
            
            return transits
            
        except Exception as e:
            logger.error(f"Error in calculate_current_transits: {str(e)}", exc_info=True)
            raise

    def get_zodiac_sign(self, longitude: float) -> ZodiacSign:
        """Get zodiac sign from longitude"""
        sign_index = int((longitude / 30) % 12)
        return list(ZodiacSign)[sign_index]

    def get_house_number(self, longitude: float) -> int:
        """Get house number from longitude"""
        house_number = (int(longitude / 30) % 12) + 1
        return house_number

    def get_house_meaning(self, house_number: int) -> str:
        """Get the meaning of a house"""
        house_meanings = {
            1: "personality and self-expression",
            2: "finances and material possessions",
            3: "communication and short travels",
            4: "home and family",
            5: "creativity and romance",
            6: "work and health",
            7: "relationships and partnerships",
            8: "transformation and shared resources",
            9: "higher education and philosophy",
            10: "career and public image",
            11: "friendships and group activities",
            12: "spirituality and hidden matters"
        }
        return house_meanings.get(house_number, "unknown area")

    def calculate_aspects(self, natal_pos: float, transit_pos: float) -> Optional[str]:
        """Calculate aspects between positions"""
        try:
            angle = abs(transit_pos - natal_pos) % 360
            if angle > 180:
                angle = 360 - angle
                
            aspects = {
                0: ("conjunction", 10),
                60: ("sextile", 6),
                90: ("square", 8),
                120: ("trine", 10),
                180: ("opposition", 10)
            }
            
            for target_angle, (aspect_name, orb) in aspects.items():
                if abs(angle - target_angle) <= orb:
                    return aspect_name
                    
            return None
            
        except Exception as e:
            logger.error(f"Error calculating aspects: {str(e)}")
            return None

    def calculate_natal_positions(self, birth_date: datetime) -> Dict[Planet, float]:
        """Calculate planetary positions at birth"""
        try:
            logger.debug(f"Calculating natal positions for birth date: {birth_date}")
            
            # Convert birth_date to Julian Day
            julian_day = swe.julday(
                birth_date.year,
                birth_date.month,
                birth_date.day,
                birth_date.hour + birth_date.minute/60.0
            )
            logger.debug(f"Birth date Julian Day: {julian_day}")
            
            # Set sidereal mode for natal calculations
            swe.set_sid_mode(swe.SIDM_LAHIRI)
            
            positions = {}
            for planet, swe_planet in self.planet_map.items():
                try:
                    # Calculate position for birth time
                    flags = swe.FLG_SIDEREAL | swe.FLG_SPEED
                    position = swe.calc_ut(julian_day, swe_planet, flags)
                    positions[planet] = position[0][0]  # Get longitude
                    is_retrograde = position[0][3] < 0
                    logger.debug(f"Natal {planet.value}: {positions[planet]:.2f}° {'(R)' if is_retrograde else ''}")
                except swe.Error as e:
                    logger.error(f"Error calculating natal position for {planet}: {e}")
                    continue
            
            # Calculate Ketu (opposite to Rahu)
            if Planet.RAHU in positions:
                positions[Planet.KETU] = (positions[Planet.RAHU] + 180) % 360
                logger.debug(f"Natal Ketu: {positions[Planet.KETU]:.2f}°")
            
            return positions
            
        except Exception as e:
            logger.error(f"Error in calculate_natal_positions: {str(e)}", exc_info=True)
            raise

    def get_coordinates(self, city: str, country: str) -> Tuple[float, float]:
        """Get latitude and longitude from city and country"""
        try:
            location = self.geolocator.geocode(f"{city}, {country}")
            if location:
                return location.latitude, location.longitude
            else:
                logger.warning(f"Could not find coordinates for {city}, {country}")
                return 0.0, 0.0
        except (GeocoderTimedOut, GeocoderUnavailable) as e:
            logger.error(f"Geocoding error: {str(e)}")
            return 0.0, 0.0

    def calculate_ascendant(self, birth_date: datetime, city: str, country: str) -> float:
        """Calculate the ascendant degree for a given birth time and location"""
        try:
            julian_day = swe.julday(
                birth_date.year,
                birth_date.month,
                birth_date.day,
                birth_date.hour + birth_date.minute/60.0
            )
            
            # Get coordinates for the birth location
            latitude, longitude = self.get_coordinates(city, country)
            logger.debug(f"Coordinates for {city}, {country}: {latitude}, {longitude}")
            
            # Using Lahiri ayanamsa for sidereal calculations
            swe.set_sid_mode(swe.SIDM_LAHIRI)
            
            # Calculate houses using actual coordinates
            houses = swe.houses_ex(
                julian_day,
                latitude,
                longitude,
                b'P'  # Placidus house system
            )
            
            ascendant = houses[0][0]
            logger.debug(f"Calculated ascendant: {ascendant:.2f}°")
            return ascendant
            
        except Exception as e:
            logger.error(f"Error calculating ascendant: {str(e)}", exc_info=True)
            return 0.0

    def generate_prediction(
        self,
        time_frame: TimeFrame,
        birth_details: Optional[BirthDetails] = None,
        transits: Optional[List[TransitInfo]] = None
    ) -> HoroscopePrediction:
        """Generate horoscope prediction with natal chart if birth details are provided"""
        try:
            # logger.info(f"Generating prediction for zodiac: {zodiac_sign}, timeframe: {time_frame}")
            logger.info(f"Birth details received: {birth_details}")
            
            if transits is None:
                transits = self.calculate_current_transits()

            predictions = {
                "general": [],
                "career": [],
                "love": [],
                "health": [],
                "finances": []
            }
            
            # Calculate natal positions if birth details are provided
            natal_positions = None
            natal_chart = None
            if birth_details:
                logger.info("Processing birth details...")
                birth_date = datetime(
                    year=birth_details.year,
                    month=birth_details.month,
                    day=birth_details.day,
                    hour=birth_details.hour,
                    minute=birth_details.minute,
                    tzinfo=timezone.utc  # Ensure UTC timezone
                )
                logger.info(f"Created birth_date: {birth_date}")
                
                # Calculate natal positions
                natal_positions = self.calculate_natal_positions(birth_date)
                logger.info(f"Calculated natal positions: {natal_positions}")
                
                # Calculate ascendant
                ascendant_degree = self.calculate_ascendant(
                    birth_date,
                    birth_details.city,
                    birth_details.country
                )
                logger.info(f"Calculated ascendant: {ascendant_degree}")
                
                natal_chart = NatalChart(
                    ascendant=ascendant_degree,
                    ascendant_sign=self.get_zodiac_sign(ascendant_degree),
                    planet_positions=natal_positions,
                    house_positions={
                        planet: self.get_house_number(pos) 
                        for planet, pos in natal_positions.items()
                    }
                )
                logger.info(f"Created natal chart: {natal_chart}")
            else:
                logger.info("No birth details provided")

            # Process each transit
            for transit in transits:
                base_prediction = f"Transiting {transit.planet.value} in {transit.zodiac_sign.value} ({transit.house}th house)"
                
                # Check for conjunctions with other transiting planets
                conjunctions = []
                for other_transit in transits:
                    if transit.planet != other_transit.planet:
                        if (transit.zodiac_sign == other_transit.zodiac_sign and 
                            abs(transit.degree - other_transit.degree) <= 8):
                            conjunctions.append(other_transit.planet.value)
                
                if conjunctions:
                    base_prediction += f" conjunct {', '.join(conjunctions)}"
                
                # Add natal aspects if available
                if natal_positions and transit.planet in natal_positions:
                    natal_pos = natal_positions[transit.planet]
                    aspect = self.calculate_aspects(natal_pos, transit.degree)
                    if aspect:
                        base_prediction += f" is {aspect} your natal {transit.planet.value}"
                
                # Add interpretation based on house placement
                house_meaning = self.get_house_meaning(transit.house)
                base_prediction += f", affecting {house_meaning}"
                
                # Add retrograde status if applicable
                if transit.is_retrograde:
                    base_prediction += " (retrograde)"
                
                # Categorize prediction
                if transit.house in [2, 8]:
                    predictions["finances"].append(base_prediction)
                elif transit.house in [6, 12]:
                    predictions["health"].append(base_prediction)
                elif transit.house in [5, 7]:
                    predictions["love"].append(base_prediction)
                elif transit.house in [1, 10]:
                    predictions["career"].append(base_prediction)
                predictions["general"].append(base_prediction)
            
            # Combine predictions
            final_predictions = {
                category: ". ".join(pred_list) if pred_list else f"No significant {category} transits at this time"
                for category, pred_list in predictions.items()
            }
            
            return HoroscopePrediction(
                general=final_predictions["general"],
                career=final_predictions["career"],
                love=final_predictions["love"],
                health=final_predictions["health"],
                finances=final_predictions["finances"],
                lucky_number=random.randint(1, 9),
                lucky_color=random.choice(["Blue", "Red", "Green", "Yellow"]),
                transits=transits,
                natal_chart=natal_chart,
                timestamp=datetime.now(timezone.utc)
            )
            
        except Exception as e:
            logger.error(f"Error in generate_prediction: {str(e)}", exc_info=True)
            raise 
    def get_zodiac_degrees(self, sign: ZodiacSign) -> float:
        """Convert zodiac sign to degrees"""
        zodiac_signs = list(ZodiacSign)
        return zodiac_signs.index(sign) * 30 
