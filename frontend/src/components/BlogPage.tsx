import React, { useState, useEffect } from 'react';
import { blogPosts } from '../data';
import { BlogPost } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick, index }) => (
  <motion.article 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.03 }}
    className="card cursor-pointer"
    onClick={onClick}
  >
    <img
      src={post.image}
      alt=""
      className="w-full h-48 object-cover rounded-lg mb-4 transform transition-transform duration-300"
    />
    <span className="text-purple-300 text-sm uppercase tracking-wider">
      {post.category}
    </span>
    <h3 className="text-xl font-bold text-white mt-2 mb-3 font-playfair">
      {post.title}
    </h3>
    <p className="text-gray-300 mb-4">{post.excerpt}</p>
    <span className="text-purple-300 text-sm">
      {new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </span>
  </motion.article>
);

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts or when switching posts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPost]);

  const categories = ['all', 'astrology', 'mindfulness', 'rituals'];
  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {selectedPost ? (
          <motion.div
            key="post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="text-purple-300 hover:text-purple-200 mb-8 flex items-center transition-colors duration-300"
            >
              ← Back to Blogs
            </button>
            <motion.article 
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={selectedPost.image}
                alt=""
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
              <span className="text-purple-300 text-sm uppercase tracking-wider">
                {selectedPost.category}
              </span>
              <h1 className="text-3xl font-bold text-white mt-2 mb-4 font-playfair">
                {selectedPost.title}
              </h1>
              <span className="text-purple-300 text-sm block mb-8">
                {new Date(selectedPost.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <div className="prose prose-invert max-w-none">
                {selectedPost.content.split('\n').map((paragraph, index) => (
                  <motion.p 
                    key={index} 
                    className="text-gray-300 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.article>
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
                Spiritual Insights & Wisdom
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 font-poppins"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Explore our collection of articles on astrology, mindfulness, and sacred rituals.
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

              {/* Blog Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    onClick={() => setSelectedPost(post)}
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

export default BlogPage; 