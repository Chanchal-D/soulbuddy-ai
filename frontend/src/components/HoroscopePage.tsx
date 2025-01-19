import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HoroscopeProps {
  generateHoroscope: (data: any) => Promise<any>;
  getDailyHoroscope: (sign: string) => Promise<any>;
  getCurrentTransits: () => Promise<any>;
}

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const HoroscopePage: React.FC<HoroscopeProps> = ({
  generateHoroscope,
  getDailyHoroscope,
  getCurrentTransits
}) => {
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [dailyHoroscope, setDailyHoroscope] = useState<string>('');
  const [transits, setTransits] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransits();
  }, []);

  useEffect(() => {
    if (selectedSign) {
      fetchDailyHoroscope(selectedSign);
    }
  }, [selectedSign]);

  const fetchDailyHoroscope = async (sign: string) => {
    try {
      setLoading(true);
      const data = await getDailyHoroscope(sign.toLowerCase());
      setDailyHoroscope(data.horoscope);
    } catch (error) {
      console.error('Error fetching daily horoscope:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransits = async () => {
    try {
      const data = await getCurrentTransits();
      setTransits(data);
    } catch (error) {
      console.error('Error fetching transits:', error);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-playfair">
          Daily Celestial Guidance
        </h1>
        <p className="text-xl text-gray-300 font-poppins">
          Discover what the stars have in store for you today
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Zodiac Sign Selection */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
          {zodiacSigns.map((sign) => (
            <motion.button
              key={sign}
              onClick={() => setSelectedSign(sign)}
              className={`p-4 rounded-xl backdrop-blur-lg transition-all duration-300 ${
                selectedSign === sign 
                  ? 'bg-purple-600/30 shadow-lg shadow-purple-500/20' 
                  : 'bg-black/20 hover:bg-purple-600/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-white font-semibold">{sign}</p>
            </motion.button>
          ))}
        </div>

        {/* Daily Horoscope Display */}
        {selectedSign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-playfair">
              {selectedSign}'s Daily Horoscope
            </h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <p className="text-gray-300 text-lg">{dailyHoroscope}</p>
            )}
          </motion.div>
        )}

        {/* Current Transits */}
        {transits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-playfair">
              Current Planetary Transits
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(transits).map(([planet, position]: [string, any]) => (
                <div 
                  key={planet}
                  className="p-4 bg-purple-600/10 rounded-xl hover:bg-purple-600/20 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{planet}</h3>
                  <p className="text-gray-300">{position}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HoroscopePage; 