from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable
from typing import Tuple
import time

class LocationService:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="kundali_generator")
        
    def get_coordinates(self, city: str, country: str = None) -> Tuple[float, float]:
        """Get latitude and longitude for a given city"""
        try:
            # Combine city and country for better accuracy
            location_query = city
            if country:
                location_query = f"{city}, {country}"
            
            # Add retry mechanism
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    location = self.geolocator.geocode(location_query)
                    if location:
                        return location.latitude, location.longitude
                    time.sleep(1)  # Be nice to the API
                except (GeocoderTimedOut, GeocoderUnavailable):
                    if attempt == max_retries - 1:
                        raise
                    time.sleep(2)  # Wait before retrying
            
            raise ValueError(f"Could not find coordinates for {location_query}")
            
        except Exception as e:
            raise ValueError(f"Error getting coordinates: {str(e)}") 