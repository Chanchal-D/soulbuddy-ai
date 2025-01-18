from fastapi import APIRouter, HTTPException
from app.models.schemas import BirthDetailsRequest, BirthDetails, KundaliResponse
from app.services.kundali_generator import KundaliGenerator
from app.services.location_service import LocationService
import datetime
import io
import base64
import sys
from io import StringIO

router = APIRouter()

@router.post("/generate", response_model=KundaliResponse)
async def generate_kundali_api(birth_details: BirthDetailsRequest):
    try:
        # Validate inputs
        if not (1900 <= birth_details.year <= datetime.date.today().year):
            raise HTTPException(status_code=400, detail="Invalid year")
        if not (1 <= birth_details.month <= 12):
            raise HTTPException(status_code=400, detail="Invalid month")
        if not (1 <= birth_details.day <= 31):
            raise HTTPException(status_code=400, detail="Invalid day")
        if not (0 <= birth_details.hour <= 23):
            raise HTTPException(status_code=400, detail="Invalid hour")
        if not (0 <= birth_details.minute <= 59):
            raise HTTPException(status_code=400, detail="Invalid minute")
        if birth_details.gender.upper() not in ['M', 'F']:
            raise HTTPException(status_code=400, detail="Invalid gender")

        # Get coordinates
        location_service = LocationService()
        print(f"\nFetching coordinates for {birth_details.city}, {birth_details.country}...")
        latitude, longitude = location_service.get_coordinates(birth_details.city, birth_details.country)
        print(f"Location found: {latitude:.4f}°N, {longitude:.4f}°E")

        # Create birth details object
        birth_details_obj = BirthDetails(
            date=datetime.date(birth_details.year, birth_details.month, birth_details.day),
            time=datetime.time(birth_details.hour, birth_details.minute),
            city=birth_details.city,
            latitude=latitude,
            longitude=longitude,
            gender=birth_details.gender,
            country=birth_details.country
        )

        # Capture print output
        old_stdout = sys.stdout
        sys.stdout = mystdout = StringIO()

        # Generate Kundali
        print("\nGenerating Kundali...")
        generator = KundaliGenerator()
        kundali_data = generator.generate_kundali(birth_details_obj)

        # Get the captured output
        sys.stdout = old_stdout
        analysis_text = mystdout.getvalue()

        # Save chart to bytes buffer
        chart_buffer = io.BytesIO()
        generator.current_figure.savefig(chart_buffer, format='png', dpi=300, bbox_inches='tight')
        chart_buffer.seek(0)
        chart_base64 = base64.b64encode(chart_buffer.getvalue()).decode()

        return KundaliResponse(
            kundali_data=kundali_data,
            chart_base64=chart_base64,
            analysis_text=analysis_text
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 