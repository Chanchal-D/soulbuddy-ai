import React, { useState, useEffect } from 'react';
import { videos } from '../data';
import { Video } from '../types';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, index }) => (
  <motion.article 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.03 }}
    className="card cursor-pointer"
    onClick={onClick}
  >
    <div className="relative overflow-hidden rounded-lg">
      <img
        src={video.thumbnail}
        alt=""
        className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.3 }}
        >
          <Play className="h-12 w-12 text-white" aria-hidden="true" />
        </motion.div>
      </div>
      <span className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
        {video.duration}
      </span>
    </div>
    <span className="text-purple-300 text-sm uppercase tracking-wider mt-4 block">
      {video.category}
    </span>
    <h3 className="text-xl font-bold text-white mt-2 mb-3 font-playfair">
      {video.title}
    </h3>
    <p className="text-gray-300">{video.description}</p>
  </motion.article>
);

const VideoPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts or when switching videos
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedVideo]);

  const categories = ['all', 'meditation', 'rituals', 'astrology'];
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {selectedVideo ? (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="text-purple-300 hover:text-purple-200 mb-8 flex items-center transition-colors duration-300"
            >
              ← Back to Videos
            </button>
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-w-16 aspect-h-9 mb-8 rounded-lg overflow-hidden">
                <iframe
                  src={selectedVideo.url.replace('watch?v=', 'embed/')}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="text-purple-300 text-sm uppercase tracking-wider">
                  {selectedVideo.category}
                </span>
                <h1 className="text-3xl font-bold text-white mt-2 mb-4 font-playfair">
                  {selectedVideo.title}
                </h1>
                <p className="text-gray-300">
                  {selectedVideo.description}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto text-center mb-12">
              <motion.h1 
                className="text-4xl sm:text-5xl font-bold text-white mb-6 font-playfair"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Spiritual Video Library
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 font-poppins"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Watch guided meditations, ritual demonstrations, and astrological insights.
              </motion.p>
            </div>

            <div className="max-w-7xl mx-auto">
              {/* Category Filter */}
              <motion.div 
                className="flex justify-center mb-12 space-x-4"
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

              {/* Video Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {filteredVideos.map((video, index) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPage; 