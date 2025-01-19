export type Page = 'home' | 'kundali' | 'horoscope' | 'chat' | 'recommendations' | 'blog' | 'videos';

export interface BlogPost {
  id: string;
  title: string;
  category: 'astrology' | 'mindfulness' | 'rituals';
  excerpt: string;
  image: string;
  date: string;
  content: string;
}

export interface Video {
  id: string;
  title: string;
  category: 'meditation' | 'rituals' | 'astrology';
  thumbnail: string;
  duration: string;
  url: string;
  description: string;
}