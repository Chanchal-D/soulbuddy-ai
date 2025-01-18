# Astrology Application

## Overview
A comprehensive astrology application that provides horoscope predictions, kundali (birth chart) generation, and astrological calculations using precise astronomical data.

## Table of Contents
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Services](#services)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Calculations & Methodology](#calculations--methodology)

## Features
- Daily, weekly, and monthly horoscope predictions
- Personalized birth chart (Kundali) generation
- Transit calculations and interpretations
- Planetary positions and aspects
- Location-based calculations
- Visual chart representations

## Technical Architecture

### Tech Stack
- Backend: Python 3.8+
- Astronomical Calculations: Swiss Ephemeris (swisseph)
- Geocoding: GeoPy
- Visualization: Matplotlib
- Database: PostgreSQL
- API Framework: FastAPI

### Project Structure 
```

## Services

### 1. Horoscope Service
The core service for generating astrological predictions and calculations.

#### Key Components:
- **Transit Calculator**
  - Calculates current planetary positions
  - Uses Swiss Ephemeris for precise astronomical data
  - Handles timezone conversions
  ```python
  def calculate_transits(date: datetime) -> Dict[Planet, Position]:
      julian_day = swe.julday(date.year, date.month, date.day, date.hour)
      positions = {}
      for planet in Planet:
          lon, lat, speed = swe.calc_ut(julian_day, planet.value)
          positions[planet] = Position(longitude=lon, latitude=lat, speed=speed)
      return positions
  ```

- **Aspect Calculator**
  - Computes planetary aspects and their interpretations
  - Supports major aspects (conjunction, trine, square, etc.)
  - Includes orb calculations
  ```python
  def calculate_aspects(positions: Dict[Planet, Position]) -> List[Aspect]:
      aspects = []
      for p1, p2 in combinations(Planet, 2):
          angle = calculate_angle(positions[p1], positions[p2])
          if is_valid_aspect(angle):
              aspects.append(Aspect(p1, p2, angle))
      return aspects
  ```

### 2. Kundali Service
Generates detailed birth charts and interpretations.

#### Features:
- **Birth Chart Generation**
  - Calculates ascendant and house cusps
  - Determines planetary positions at birth time
  - Handles ayanamsa calculations for sidereal zodiac

- **Chart Visualization**
  - Creates traditional North Indian style charts
  - Supports South Indian style charts
  - Generates modern circular charts
  ```python
  def draw_chart(positions: Dict[Planet, Position], houses: List[float]) -> Figure:
      fig = plt.figure(figsize=(10, 10))
      # Draw houses
      for house in houses:
          draw_house_line(house)
      # Place planets
      for planet, pos in positions.items():
          place_planet_symbol(planet, pos.longitude)
      return fig
  ```

### 3. Location Service
Handles geographical calculations for accurate astrological data.

#### Functionality:
- Geocoding of cities and locations
- Timezone determination
- Coordinates validation 
```

## Calculations & Methodology

### Astrological Calculations
1. **Planetary Positions**
   - Uses Swiss Ephemeris for high-precision calculations
   - Converts local time to Universal Time
   - Applies ayanamsa correction for sidereal calculations

2. **House Systems**
   - Supports multiple house systems:
     - Placidus
     - Koch
     - Equal House
     - Whole Sign
   - Calculates intermediate house cusps

3. **Aspects**
   - Major aspects with orbs:
     - Conjunction (0° ±10°)
     - Sextile (60° ±6°)
     - Square (90° ±8°)
     - Trine (120° ±10°)
     - Opposition (180° ±10°)

### Prediction Generation
1. **Transit Analysis**
   - Evaluates current planetary positions
   - Compares with natal chart positions
   - Considers aspect formations

2. **Interpretation Rules**
   - Planet strength calculations
   - House lordship effects
   - Aspect impact assessment
   - Retrograde considerations

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/astrology-app.git

# Install dependencies
pip install -r requirements.txt

# Install Swiss Ephemeris
pip install pyswisseph

# Set up environment variables
cp .env.example .env
``` 