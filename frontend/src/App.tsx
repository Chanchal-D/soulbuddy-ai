import React, { useState } from 'react';
import { Stars, Moon, Sun, Gem, Sparkles, MessageCircle, ChevronDown, Send, Menu, X, Heart, Users, Book, Compass, Mail, ArrowRight, Youtube, Newspaper } from 'lucide-react';
import { Page } from './types';
import { blogPosts, videos } from './data';
import KundaliForm from './components/KundaliForm';
import BlogPage from './components/BlogPage';
import VideoPage from './components/VideoPage';
import ChatPage from './components/ChatPage';
import RecommendationPage from './components/RecommendationPage';



function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [kundaliResult, setKundaliResult] = useState<{
    chart_base64: string;
    analysis_text: string;
  } | null>(null);

  const navigation = [
    { name: 'home' as Page, icon: <Stars className="h-5 w-5" /> },
    { name: 'kundali' as Page, icon: <Moon className="h-5 w-5" /> },
    { name: 'chat' as Page, icon: <MessageCircle className="h-5 w-5" /> },
    { name: 'recommendations' as Page, icon: <Gem className="h-5 w-5" /> },
    { name: 'blog' as Page, icon: <Newspaper className="h-5 w-5" /> },
    { name: 'videos' as Page, icon: <Youtube className="h-5 w-5" /> }
  ];

  const handleKundaliSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/kundali/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate kundali');
      }

      const data = await response.json();
      setKundaliResult(data);
    } catch (error) {
      console.error('Error generating kundali:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center">
              <Stars className="h-8 w-8 text-yellow-300" />
              <span className="ml-2 text-2xl font-playfair font-semibold text-white">SoulBuddy</span>
            </a>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {navigation.map(({ name, icon }) => (
                  <button
                    key={name}
                    onClick={() => setCurrentPage(name)}
                    className={`flex items-center space-x-2 text-gray-300 hover:text-white transition-colors capitalize ${
                      currentPage === name ? 'text-white bg-purple-600/20' : ''
                    }`}
                  >
                    {icon}
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/30 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map(({ name, icon }) => (
                <button
                  key={name}
                  onClick={() => {
                    setCurrentPage(name);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full text-left px-3 py-2 text-gray-300 hover:text-white capitalize ${
                    currentPage === name ? 'bg-purple-600/20 text-white' : ''
                  }`}
                >
                  {icon}
                  <span className="ml-2">{name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {currentPage === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover bg-center opacity-20"
                ></div>
              </div>
              <div className="relative max-w-3xl text-center">
                <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 font-playfair">
                  Discover Your Cosmic Path
                </h1>
                <p className="text-xl text-gray-300 mb-8 font-poppins">
                  Let our AI-powered spiritual guide illuminate your journey through the stars
                </p>
                <button 
                  onClick={() => setCurrentPage('kundali')}
                  className="btn btn-primary"
                >
                  Begin Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </section>

            {/* Blog Preview */}
            <section className="py-20 bg-black/20 backdrop-blur-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white text-center mb-12 font-playfair">
                  Latest Insights
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.slice(0, 3).map((post) => (
                    <article key={post.id} className="card">
                      <img
                        src={post.image}
                        alt=""
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <span className="text-purple-300 text-sm uppercase tracking-wider">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2 mb-3 font-playfair">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 mb-4">{post.excerpt}</p>
                      <button 
                        onClick={() => setCurrentPage('blog')}
                        className="text-purple-300 hover:text-purple-200 transition-colors"
                      >
                        Read more →
                      </button>
                    </article>
                  ))}
                </div>
                <div className="text-center mt-12">
                  <button
                    onClick={() => setCurrentPage('blog')}
                    className="btn btn-primary"
                  >
                    View All Articles
                  </button>
                </div>
              </div>
            </section>

            {/* Video Preview */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white text-center mb-12 font-playfair">
                  Featured Videos
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {videos.slice(0, 3).map((video) => (
                    <div key={video.id} className="card">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Youtube className="h-12 w-12 text-white" />
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                          {video.duration}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-4 mb-2 font-playfair">
                        {video.title}
                      </h3>
                      <span className="text-purple-300 text-sm uppercase tracking-wider">
                        {video.category}
                      </span>
                      <button 
                        onClick={() => setCurrentPage('videos')}
                        className="text-purple-300 hover:text-purple-200 transition-colors block mt-4"
                      >
                        Watch Now →
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-12">
                  <button
                    onClick={() => setCurrentPage('videos')}
                    className="btn btn-primary"
                  >
                    View All Videos
                  </button>
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-black/20 backdrop-blur-lg">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-6 font-playfair">
                  Stay Connected with the Cosmos
                </h2>
                <p className="text-gray-300 mb-8">
                  Subscribe to receive celestial insights and spiritual guidance
                </p>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Handle newsletter subscription
                  }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <div className="flex-grow max-w-md">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="input"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary whitespace-nowrap"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Subscribe
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'kundali' && (
          <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-playfair">
                Discover Your Cosmic Blueprint
              </h1>
              <p className="text-xl text-gray-300 font-poppins">
                Enter your birth details to reveal your unique astrological chart and receive personalized insights.
              </p>
            </div>

            {!kundaliResult ? (
              <KundaliForm onSubmit={handleKundaliSubmit} isLoading={isLoading} />
            ) : (
              <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
                  <img 
                    src={`data:image/png;base64,${kundaliResult.chart_base64}`}
                    alt="Your Kundali Chart"
                    className="w-full max-w-2xl mx-auto rounded-lg"
                  />
                </div>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-white mb-4 font-playfair">
                    Your Astrological Analysis
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-300 font-poppins">
                      {kundaliResult.analysis_text}
                    </pre>
                  </div>
                </div>

                <button
                  onClick={() => setKundaliResult(null)}
                  className="btn btn-primary"
                >
                  Generate Another Chart
                </button>
              </div>
            )}
          </div>
        )}

        {currentPage === 'chat' && <ChatPage />}
        {currentPage === 'recommendations' && <RecommendationPage />}
        {currentPage === 'blog' && <BlogPage />}
        {currentPage === 'videos' && <VideoPage />}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Stars className="h-8 w-8 text-yellow-300" />
                <span className="ml-2 text-2xl font-playfair font-semibold text-white">SoulBuddy</span>
              </div>
              <p className="text-gray-300">
                Your AI-powered spiritual companion for cosmic guidance and inner peace.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 font-playfair">Quick Links</h3>
              <ul className="space-y-2">
                {['About Us', 'Features', 'Testimonials', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 font-playfair">Connect</h3>
              <ul className="space-y-2">
                {['Twitter', 'Instagram', 'Facebook', 'LinkedIn'].map((social) => (
                  <li key={social}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      {social}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} SoulBuddy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;