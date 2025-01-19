import swisseph as swe
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple
from app.models.horoscope_schemas import (
    TimeFrame, Planet, TransitInfo,
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
                    
                    house = self.get_house_number(longitude)
                    degree = longitude
                    
                    transit = TransitInfo(
                        planet=planet,
                        degree=degree,
                        house=house,
                        is_retrograde=is_retrograde
                    )
                    transits.append(transit)
                    
                    logger.debug(f"Transit calculated - {planet.value}: {degree:.2f}°{' (R)' if is_retrograde else ''}")
                except swe.Error as e:
                    logger.error(f"Error calculating transit for {planet}: {e}")
                    continue
            
            # Calculate Ketu transit
            rahu_transit = next((t for t in transits if t.planet == Planet.RAHU), None)
            if rahu_transit:
                # Calculate Ketu's position (opposite to Rahu)
                ketu_degree = (rahu_transit.degree + 180) % 360
                ketu_house = self.get_house_number(ketu_degree)
                
                transits.append(TransitInfo(
                    planet=Planet.KETU,
                    degree=ketu_degree,
                    house=ketu_house,
                    is_retrograde=rahu_transit.is_retrograde
                ))
                logger.debug(f"Ketu transit calculated: {ketu_degree:.2f}°")
            
            return transits
            
        except Exception as e:
            logger.error(f"Error in calculate_current_transits: {str(e)}", exc_info=True)
            raise

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
        degree: float,
        time_frame: TimeFrame,
        birth_details: Optional[BirthDetails] = None,
        transits: Optional[List[TransitInfo]] = None
    ) -> HoroscopePrediction:
        """Generate horoscope prediction based on degree position"""
        try:
            logger.info(f"Generating prediction for degree: {degree}, timeframe: {time_frame}")
            logger.info(f"Birth details received: {birth_details}")
            
            if transits is None:
                transits = self.calculate_current_transits()
            
            # Calculate natal positions if birth details are provided
            natal_positions = None
            ascendant = None
            if birth_details:
                natal_positions = self.calculate_natal_positions(birth_details.birth_date)
                ascendant = self.calculate_ascendant(
                    birth_details.birth_date,
                    birth_details.city,
                    birth_details.country
                )
            
            # Generate prediction based on degree and transits
            prediction = HoroscopePrediction(
                degree=degree,
                time_frame=time_frame,
                transits=transits,
                natal_chart=NatalChart(
                    positions=natal_positions,
                    ascendant=ascendant
                ) if natal_positions and ascendant else None
            )
            
            return prediction
            
        except Exception as e:
            logger.error(f"Error generating prediction: {str(e)}", exc_info=True)
            raise 