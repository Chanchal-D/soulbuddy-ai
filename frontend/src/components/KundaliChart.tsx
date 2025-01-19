import React from 'react';

interface PlanetPosition {
  Sun: number;
  Moon: number;
  Mars: number;
  Mercury: number;
  Jupiter: number;
  Venus: number;
  Saturn: number;
  Rahu: number;
  Ketu: number;
}

interface KundaliData {
  birth_details: {
    date: string;
    time: string;
    location: {
      city: string;
      country: string;
      latitude: number;
      longitude: number;
    };
  };
  ascendant: number;
  planet_positions: PlanetPosition;
  house_cusps: number[];
  insights: string[];
}

interface KundaliChartProps {
  data: KundaliData;
}

const KundaliChart: React.FC<KundaliChartProps> = ({ data }) => {
  const size = 400;
  const center = size / 2;
  const radius = size * 0.4;

  // Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // Calculate position on circle
  const getPosition = (degrees: number, radius: number) => {
    const radians = toRadians(degrees - 90); // Subtract 90 to start from top
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians)
    };
  };

  // Get house number (1-12) based on degree
  const getHouse = (degree: number) => {
    return Math.floor(degree / 30) + 1;
  };

  // Planet symbols and names
  const planetSymbols: { [key: string]: { symbol: string; name: string; color: string } } = {
    Sun: { symbol: '☉', name: 'Sun', color: 'text-yellow-500' },
    Moon: { symbol: '☽', name: 'Moon', color: 'text-blue-300' },
    Mars: { symbol: '♂', name: 'Mars', color: 'text-red-500' },
    Mercury: { symbol: '☿', name: 'Mercury', color: 'text-green-400' },
    Jupiter: { symbol: '♃', name: 'Jupiter', color: 'text-orange-400' },
    Venus: { symbol: '♀', name: 'Venus', color: 'text-pink-400' },
    Saturn: { symbol: '♄', name: 'Saturn', color: 'text-indigo-400' },
    Rahu: { symbol: '☊', name: 'Rahu', color: 'text-purple-400' },
    Ketu: { symbol: '☋', name: 'Ketu', color: 'text-teal-400' }
  };

  // Calculate planet positions in houses
  const planetHouses = Object.entries(data.planet_positions).reduce((acc, [planet, degree]) => {
    const house = getHouse(degree);
    if (!acc[house]) acc[house] = [];
    acc[house].push({ planet, degree });
    return acc;
  }, {} as { [key: number]: { planet: string; degree: number }[] });

  // Get ascendant house
  const ascendantHouse = getHouse(data.ascendant);

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-white font-playfair">
          Ascendant: {planetSymbols['Sun'].symbol} House {ascendantHouse} ({data.ascendant.toFixed(2)}°)
        </h3>
      </div>

      <div className="max-w-[400px] mx-auto">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="fill-purple-900/20 stroke-purple-500/50 stroke-2"
          />

          {/* Outer square */}
          <rect
            x={center - radius}
            y={center - radius}
            width={radius * 2}
            height={radius * 2}
            className="fill-none stroke-purple-500/50 stroke-2"
          />

          {/* Inner square (rotated 45 degrees) */}
          <rect
            x={center - radius * 0.7}
            y={center - radius * 0.7}
            width={radius * 1.4}
            height={radius * 1.4}
            transform={`rotate(45 ${center} ${center})`}
            className="fill-none stroke-purple-500/50 stroke-2"
          />

          {/* House divisions and cusps */}
          {data.house_cusps.map((cusp, i) => {
            const start = getPosition(cusp, radius);
            const end = getPosition(cusp + 180, radius);
            const labelPos = getPosition(cusp - 15, radius * 1.1);
            return (
              <g key={i}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  className="stroke-purple-500/30 stroke-1"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-purple-300 text-[10px]"
                >
                  {cusp.toFixed(1)}°
                </text>
              </g>
            );
          })}

          {/* House numbers and planets */}
          {Array.from({ length: 12 }).map((_, i) => {
            const startCusp = data.house_cusps[i];
            const endCusp = data.house_cusps[(i + 1) % 12];
            const midAngle = (startCusp + endCusp) / 2;
            const pos = getPosition(midAngle, radius * 0.75);
            const houseNumber = i + 1;
            const planets = planetHouses[houseNumber] || [];

            return (
              <g key={i}>
                {/* House number */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-sm font-bold"
                >
                  {houseNumber}
                </text>

                {/* Planets in house */}
                {planets.map(({ planet, degree }, index) => {
                  const yOffset = (index + 1) * 30;
                  const xOffset = 30;
                  return (
                    <g key={planet}>
                      <text
                        x={pos.x}
                        y={pos.y + yOffset}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`${planetSymbols[planet].color} text-lg`}
                      >
                        {planetSymbols[planet].symbol}
                      </text>
                      <text
                        x={pos.x + xOffset}
                        y={pos.y + yOffset}
                        textAnchor="start"
                        dominantBaseline="middle"
                        className="fill-gray-300 text-xs"
                      >
                        {degree.toFixed(1)}°
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Ascendant marker */}
          {(() => {
            const ascPos = getPosition(data.ascendant, radius);
            return (
              <>
                <path
                  d={`M ${ascPos.x} ${ascPos.y} l -10 -20 l 20 0 z`}
                  className="fill-yellow-500"
                />
                <text
                  x={ascPos.x}
                  y={ascPos.y - 25}
                  textAnchor="middle"
                  className="fill-yellow-500 text-sm font-bold"
                >
                  ASC
                </text>
              </>
            );
          })()}
        </svg>
      </div>

      {/* House Cusps and Planets */}
      <div className="mt-8 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* House Cusps */}
        <div className="bg-purple-900/20 p-4 rounded-xl">
          <h4 className="text-white font-extrabold text-lg mb-2 font-playfair">House Cusps</h4>
          <div className="grid grid-cols-2 gap-2">
            {data.house_cusps.map((cusp, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-300 font-semibold">House {index + 1}</span>
                <span className="text-gray-400">{cusp.toFixed(1)}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Planet Positions */}
        <div className="bg-purple-900/20 p-4 rounded-xl">
          <h4 className="text-white font-extrabold text-lg mb-2 font-playfair">Planet Positions</h4>
          {Object.entries(planetSymbols).map(([planet, { symbol, name, color }]) => (
            <div key={planet} className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className={`text-xl ${color}`}>{symbol}</span>
                <span className="text-gray-300 text-sm font-semibold">{name}</span>
              </div>
              <span className="text-gray-400 text-xs">
                {data.planet_positions[planet as keyof PlanetPosition].toFixed(1)}°
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Birth details */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-extrabold text-white mb-2 font-playfair">Birth Details</h3>
        <p className="text-gray-300">
          {new Date(data.birth_details.date).toLocaleDateString()} at {data.birth_details.time}
        </p>
        <p className="text-gray-300">
          {data.birth_details.location.city}, {data.birth_details.location.country}
        </p>
        <p className="text-gray-300">
          Lat: {data.birth_details.location.latitude.toFixed(2)}°, 
          Long: {data.birth_details.location.longitude.toFixed(2)}°
        </p>
      </div>

      {/* Insights Section */}
      {data.insights && data.insights.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-extrabold text-white mb-8 font-playfair text-center">
            Astrological Insights
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: Math.floor(data.insights.length / 2) }).map((_, index) => {
              const headingIndex = index * 2;
              const textIndex = headingIndex + 1;
              return (
                <div 
                  key={headingIndex}
                  className="bg-purple-900/20 backdrop-blur-lg rounded-xl p-8 min-h-[400px] flex flex-col transform transition-all duration-300 hover:scale-[1.02] hover:bg-purple-900/30 border border-purple-500/20"
                >
                  <h4 className="text-2xl font-extrabold text-white mb-6 font-playfair">
                    {data.insights[headingIndex]}
                  </h4>
                  <p className="text-gray-300 leading-relaxed flex-grow text-lg">
                    {data.insights[textIndex]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KundaliChart; 