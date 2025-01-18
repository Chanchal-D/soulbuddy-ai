export type Page = 'home' | 'kundali' | 'recommendations' | 'blog' | 'videos' | 'chat';

export interface BlogPost {
  id: string;
  title: string;
  category: 'astrology' | 'mindfulness' | 'rituals';
  excerpt: string;
  image: string;
  date: string;
}

export interface Video {
  id: string;
  title: string;
  category: 'meditation' | 'rituals' | 'astrology';
  thumbnail: string;
  duration: string;
}