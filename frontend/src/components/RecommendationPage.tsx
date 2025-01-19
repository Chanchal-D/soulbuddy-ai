import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gem, Book, Heart, Star, Moon, Sun } from 'lucide-react';
import { useUserData } from '../context/UserDataContext';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'crystals' | 'books' | 'practices' | 'rituals';
  icon?: JSX.Element;
  rating?: number;
  affinity?: number;
}

interface UserBirthDetails {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  city: string;
  country: string;
  gender: string;
}

// Default recommendations as fallback
const defaultRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Amethyst Crystal',
    description: 'A powerful stone for spiritual growth and inner peace. Perfect for meditation and stress relief.',
    category: 'crystals',
    icon: <Gem className="h-6 w-6" />,
    rating: 4.8,
    affinity: 85
  },
  {
    id: '2',
    title: 'The Power of Now',
    description: 'Essential reading for spiritual awakening and mindfulness practice by Eckhart Tolle.',
    category: 'books',
    icon: <Book className="h-6 w-6" />,
    rating: 4.9,
    affinity: 90
  },
  {
    id: '3',
    title: 'Morning Meditation',
    description: 'Start your day with 10 minutes of mindful breathing to center yourself and set positive intentions.',
    category: 'practices',
    icon: <Sun className="h-6 w-6" />,
    rating: 4.7,
    affinity: 88
  },
  {
    id: '4',
    title: 'Full Moon Ritual',
    description: 'A powerful cleansing and manifestation ritual to perform during the full moon phase.',
    category: 'rituals',
    icon: <Moon className="h-6 w-6" />,
    rating: 4.6,
    affinity: 82
  },
  {
    id: '5',
    title: 'Rose Quartz',
    description: 'The stone of universal love, promoting healing and emotional well-being.',
    category: 'crystals',
    icon: <Gem className="h-6 w-6" />,
    rating: 4.7,
    affinity: 87
  },
  {
    id: '6',
    title: 'Loving-Kindness Practice',
    description: 'A heart-centered meditation practice to cultivate compassion for yourself and others.',
    category: 'practices',
    icon: <Heart className="h-6 w-6" />,
    rating: 4.8,
    affinity: 89
  }
];

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'crystals':
      return <Gem className="h-6 w-6" />;
    case 'books':
      return <Book className="h-6 w-6" />;
    case 'practices':
      return <Sun className="h-6 w-6" />;
    case 'rituals':
      return <Moon className="h-6 w-6" />;
    default:
      return <Star className="h-6 w-6" />;
  }
};

const RecommendationPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recommendations, setRecommendations] = useState<Recommendation[]>(defaultRecommendations);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useUserData();

  useEffect(() => {
    if (userData) {
      fetchPersonalizedRecommendations();
    } else {
      setError("Please complete your birth details first to get personalized recommendations.");
      setRecommendations(defaultRecommendations);
      setLoading(false);
    }
  }, [userData]);

  const fetchPersonalizedRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Wrap birth details in birth_details property
      const recommendationsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recommendations/personalized`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ birth_details: userData }),
      });

      const data = await recommendationsResponse.json();

      if (!recommendationsResponse.ok) {
        throw new Error(data.detail || 'Failed to fetch recommendations');
      }
      
      if (data.status !== 'success' || !data.recommendations) {
        throw new Error('Invalid response format from recommendation service');
      }

      // Add icons to recommendations based on category
      const recommendationsWithIcons = data.recommendations.map((rec: Recommendation) => ({
        ...rec,
        icon: getIconForCategory(rec.category)
      }));

      setRecommendations(recommendationsWithIcons);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      if (error instanceof Error) {
        setError(`${error.message}. Showing default recommendations instead.`);
      } else {
        setError('Unable to load personalized recommendations. Showing default recommendations instead.');
      }
      setRecommendations(defaultRecommendations);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'crystals', 'books', 'practices', 'rituals'];
  const filteredRecommendations = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(rec => rec.category === selectedCategory);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-playfair">
          Your Spiritual Journey
        </h1>
        <p className="text-xl text-gray-300 font-poppins">
          Personalized recommendations aligned with your cosmic energy.
        </p>
        {error && (
          <p className="mt-4 text-yellow-400 bg-yellow-400/10 rounded-lg p-3">
            {error}
          </p>
        )}
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-center mb-12 space-x-4 flex-wrap gap-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-colors relative overflow-hidden"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-600/20 rounded-lg text-purple-400">
                    {rec.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white font-playfair">
                      {rec.title}
                    </h3>
                    {rec.rating && (
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-300">{rec.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 font-poppins mb-4">
                  {rec.description}
                </p>
                {rec.affinity && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Cosmic Affinity</span>
                      <span className="text-sm text-purple-400">{rec.affinity}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${rec.affinity}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPage;