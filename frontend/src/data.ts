import { BlogPost, Video } from './types';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Your Birth Chart: A Beginner\'s Guide',
    category: 'astrology',
    excerpt: 'Discover the fundamental elements of your astrological birth chart and what they reveal about your life path.',
    image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5',
    date: '2024-03-15'
  },
  {
    id: '2',
    title: 'Daily Mindfulness Practices for Spiritual Growth',
    category: 'mindfulness',
    excerpt: 'Simple yet powerful mindfulness techniques to incorporate into your daily spiritual practice.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    date: '2024-03-14'
  },
  {
    id: '3',
    title: 'Sacred Morning Rituals for Inner Peace',
    category: 'rituals',
    excerpt: 'Transform your mornings with these ancient spiritual practices adapted for modern life.',
    image: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200',
    date: '2024-03-13'
  }
];

export const videos: Video[] = [
  {
    id: '1',
    title: 'Guided Meditation for Connecting with Your Higher Self',
    category: 'meditation',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    duration: '15:30'
  },
  {
    id: '2',
    title: 'New Moon Ritual for Manifestation',
    category: 'rituals',
    thumbnail: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5',
    duration: '20:45'
  },
  {
    id: '3',
    title: 'Understanding Planetary Transits',
    category: 'astrology',
    thumbnail: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200',
    duration: '18:20'
  }
];