import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ZodiacSignData {
  date: string;
  element: string;
  rulingPlanet: string;
  symbol: string;
  traits: string[];
  description: string;
}

type ZodiacSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 
  'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

type ZodiacSigns = {
  [key in ZodiacSign]: ZodiacSignData;
};

const zodiacData: ZodiacSigns = {
  Aries: {
    date: 'March 21 - April 19',
    element: 'Fire',
    rulingPlanet: 'Mars',
    symbol: '♈',
    traits: ['Confident', 'Courageous', 'Enthusiastic', 'Impulsive', 'Natural leader'],
    description: 'Aries is the first sign of the zodiac, representing new beginnings, leadership, and initiative. They are dynamic individuals known for their pioneering spirit and fearless approach to life.'
  },
  Taurus: {
    date: 'April 20 - May 20',
    element: 'Earth',
    rulingPlanet: 'Venus',
    symbol: '♉',
    traits: ['Patient', 'Reliable', 'Determined', 'Practical', 'Sensual'],
    description: 'Taurus is the steady, stable sign of the zodiac. They are known for their practicality, reliability, and appreciation for beauty and comfort in all forms.'
  },
  Gemini: {
    date: 'May 21 - June 20',
    element: 'Air',
    rulingPlanet: 'Mercury',
    symbol: '♊',
    traits: ['Versatile', 'Curious', 'Communicative', 'Witty', 'Adaptable'],
    description: 'Gemini is the twin sign of the zodiac, representing duality and communication. They are intellectual, quick-witted, and excellent communicators.'
  },
  Cancer: {
    date: 'June 21 - July 22',
    element: 'Water',
    rulingPlanet: 'Moon',
    symbol: '♋',
    traits: ['Nurturing', 'Protective', 'Intuitive', 'Emotional', 'Home-loving'],
    description: 'Cancer is the nurturing mother of the zodiac. They are deeply emotional, intuitive, and connected to home and family life.'
  },
  Leo: {
    date: 'July 23 - August 22',
    element: 'Fire',
    rulingPlanet: 'Sun',
    symbol: '♌',
    traits: ['Generous', 'Creative', 'Enthusiastic', 'Dramatic', 'Proud'],
    description: 'Leo is the royal sign of the zodiac. They are natural leaders with a flair for drama and creativity, known for their warmth and generosity.'
  },
  Virgo: {
    date: 'August 23 - September 22',
    element: 'Earth',
    rulingPlanet: 'Mercury',
    symbol: '♍',
    traits: ['Analytical', 'Practical', 'Diligent', 'Modest', 'Helpful'],
    description: 'Virgo is the perfectionist of the zodiac. They are detail-oriented, practical, and always striving for improvement in themselves and others.'
  },
  Libra: {
    date: 'September 23 - October 22',
    element: 'Air',
    rulingPlanet: 'Venus',
    symbol: '♎',
    traits: ['Diplomatic', 'Harmonious', 'Fair', 'Social', 'Artistic'],
    description: 'Libra is the balanced judge of the zodiac. They seek harmony and fairness in all things, with a natural appreciation for beauty and relationships.'
  },
  Scorpio: {
    date: 'October 23 - November 21',
    element: 'Water',
    rulingPlanet: 'Pluto',
    symbol: '♏',
    traits: ['Intense', 'Passionate', 'Strategic', 'Perceptive', 'Transformative'],
    description: 'Scorpio is the intense investigator of the zodiac. They are deeply passionate and transformative, with an ability to see beneath the surface.'
  },
  Sagittarius: {
    date: 'November 22 - December 21',
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    symbol: '♐',
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Direct', 'Honest'],
    description: 'Sagittarius is the explorer of the zodiac. They are philosophical seekers of truth and adventure, always looking to expand their horizons.'
  },
  Capricorn: {
    date: 'December 22 - January 19',
    element: 'Earth',
    rulingPlanet: 'Saturn',
    symbol: '♑',
    traits: ['Ambitious', 'Disciplined', 'Patient', 'Practical', 'Responsible'],
    description: 'Capricorn is the achiever of the zodiac. They are ambitious and disciplined, with a strong sense of responsibility and determination.'
  },
  Aquarius: {
    date: 'January 20 - February 18',
    element: 'Air',
    rulingPlanet: 'Uranus',
    symbol: '♒',
    traits: ['Innovative', 'Progressive', 'Original', 'Humanitarian', 'Independent'],
    description: 'Aquarius is the visionary of the zodiac. They are forward-thinking innovators who value independence and humanitarian causes.'
  },
  Pisces: {
    date: 'February 19 - March 20',
    element: 'Water',
    rulingPlanet: 'Neptune',
    symbol: '♓',
    traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Musical'],
    description: 'Pisces is the mystic of the zodiac. They are deeply intuitive and compassionate, with a strong connection to the spiritual and artistic realms.'
  }
};

const HoroscopePage: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-900/20 to-black/40">
      <motion.div 
        className="max-w-4xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-playfair">
          Zodiac Signs & Their Meanings
        </h1>
        <p className="text-xl text-gray-300 font-poppins">
          Explore the unique characteristics and symbolism of each zodiac sign
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Zodiac Sign Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {(Object.entries(zodiacData) as [ZodiacSign, ZodiacSignData][]).map(([sign, data]) => (
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
              <div className="text-3xl mb-2">{data.symbol}</div>
              <p className="text-white font-semibold">{sign}</p>
              <p className="text-gray-400 text-sm">{data.date}</p>
            </motion.button>
          ))}
        </div>

        {/* Selected Sign Details */}
        {selectedSign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl p-8"
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block">{zodiacData[selectedSign].symbol}</span>
                <h2 className="text-3xl font-bold text-white mb-2 font-playfair">{selectedSign}</h2>
                <p className="text-purple-300">{zodiacData[selectedSign].date}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-purple-600/10 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">Element</h3>
                  <p className="text-gray-300">{zodiacData[selectedSign].element}</p>
                </div>
                <div className="text-center p-4 bg-purple-600/10 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">Ruling Planet</h3>
                  <p className="text-gray-300">{zodiacData[selectedSign].rulingPlanet}</p>
                </div>
                <div className="text-center p-4 bg-purple-600/10 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">Symbol</h3>
                  <p className="text-gray-300">{zodiacData[selectedSign].symbol}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Key Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {zodiacData[selectedSign].traits.map((trait: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-purple-600/20 rounded-full text-purple-200"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {zodiacData[selectedSign].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HoroscopePage; 