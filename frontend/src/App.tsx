import React, { useState } from 'react';
import { 
  Star, 
  Moon, 
  Sun, 
  MessageCircle, 
  Menu, 
  X, 
  Mail, 
  ArrowRight, 
  Youtube, 
  Newspaper,
  Sparkles,
  Brain,
  Clock,
  Shield,
  Gem
} from 'lucide-react';
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
    { name: 'home' as Page, icon: <Star className="h-5 w-5" /> },
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
              <Star className="h-8 w-8 text-yellow-300" />
              <span className="ml-2 text-2xl font-playfair font-semibold text-white">SoulBuddy</span>
            </a>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {navigation.map(({ name, icon }) => (
                  <button
                    key={name}
                    onClick={() => setCurrentPage(name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-purple-600/30 hover:shadow-lg hover:shadow-purple-500/20 ${
                      currentPage === name ? 'text-white bg-purple-600/20 shadow-lg shadow-purple-500/20' : 'text-gray-300'
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
                  className="btn btn-primary transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/30"
                >
                  Begin Your Journey <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
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
                    <article key={post.id} className="card group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2">
                      <img
                        src={post.image}
                        alt=""
                        className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-300 group-hover:scale-105"
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
                    <div key={video.id} className="card group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2">
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/30">
                          <Youtube className="h-12 w-12 text-white transform transition-all duration-300 group-hover:scale-110" />
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

            
            {/* Features Section */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white text-center mb-12 font-playfair">
                  Why Choose SoulBuddy
                </h2>
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="text-center p-6 bg-black/20 backdrop-blur-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 hover:bg-black/30">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/50">
                      <Brain className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-playfair">AI-Powered Insights</h3>
                    <p className="text-gray-300">Advanced algorithms providing personalized spiritual guidance</p>
                  </div>
                  <div className="text-center p-6 bg-black/20 backdrop-blur-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 hover:bg-black/30">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/50">
                      <Sparkles className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-playfair">Accurate Predictions</h3>
                    <p className="text-gray-300">Precise astrological calculations and interpretations</p>
                  </div>
                  <div className="text-center p-6 bg-black/20 backdrop-blur-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 hover:bg-black/30">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/50">
                      <Clock className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-playfair">24/7 Availability</h3>
                    <p className="text-gray-300">Access spiritual guidance anytime, anywhere</p>
                  </div>
                  <div className="text-center p-6 bg-black/20 backdrop-blur-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 hover:bg-black/30">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/50">
                      <Shield className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-playfair">Private & Secure</h3>
                    <p className="text-gray-300">Your personal information is always protected</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Specifications Section */}
            <section className="py-20 bg-black/20 backdrop-blur-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white text-center mb-12 font-playfair">
                  Product Specifications
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4 font-playfair">Core Features</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-purple-600/10 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-x-1">
                        <Star className="h-6 w-6 text-purple-400 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-gray-300">Advanced Kundali Chart Generation with detailed analysis</span>
                      </li>
                      <li className="flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-purple-600/10 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-x-1">
                        <MessageCircle className="h-6 w-6 text-purple-400 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-gray-300">AI-powered spiritual chat support available 24/7</span>
                      </li>
                      <li className="flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-purple-600/10 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-x-1">
                        <Gem className="h-6 w-6 text-purple-400 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-gray-300">Personalized recommendations for spiritual growth</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4 font-playfair">Technical Details</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-purple-600/10 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-x-1">
                        <Brain className="h-6 w-6 text-purple-400 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-gray-300">State-of-the-art AI models for accurate predictions</span>
                      </li>
                      <li className="flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-purple-600/10 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-x-1">
                        <Shield className="h-6 w-6 text-purple-400 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-gray-300">End-to-end encryption for data protection</span>
                      </li>
                      <li className="flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-purple-600/10 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-x-1">
                        <Sparkles className="h-6 w-6 text-purple-400 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-gray-300">Regular updates with new features and improvements</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
        {/* Newsletter Section */}
        <section className="py-24 relative">
              <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#1a1333] rounded-3xl p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-transparent"></div>
                  <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-4 font-playfair">
                      Stay Connected with the Cosmos
                    </h2>
                    <p className="text-gray-300 text-lg mb-8">
                      Subscribe to receive celestial insights and spiritual guidance directly in your inbox
                    </p>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        // Handle newsletter subscription
                      }}
                      className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-grow px-6 py-4 bg-[#2a1f45] rounded-xl text-white placeholder-gray-400 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                        required
                      />
                      <button
                        type="submit"
                        className="px-8 py-4 bg-[#8b5cf6] rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#7c3aed] transition-all duration-300"
                      >
                        <Mail className="h-5 w-5" />
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>


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
      <footer className="bg-black/30 backdrop-blur-lg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center mb-6 group transition-all duration-300 ease-in-out hover:transform hover:scale-105">
                <Star className="h-10 w-10 text-yellow-300 group-hover:text-yellow-200 transition-colors" />
                <span className="ml-3 text-3xl font-playfair font-semibold text-white">SoulBuddy</span>
              </div>
              <p className="text-gray-300 text-lg mb-6">
                Your AI-powered spiritual companion for cosmic guidance and inner peace.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'Instagram', 'Facebook', 'LinkedIn'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-300 hover:bg-purple-600/40 hover:text-white transition-all duration-300 ease-in-out hover:scale-110"
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-xl mb-6 font-playfair">Quick Links</h3>
              <ul className="space-y-4">
                {['About Us', 'Features', 'Testimonials', 'Contact'].map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out hover:translate-x-2 inline-block hover:text-purple-300"
                    >
                      → {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-xl mb-6 font-playfair">Resources</h3>
              <ul className="space-y-4">
                {['Blog', 'Videos', 'Guides', 'Support'].map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out hover:translate-x-2 inline-block hover:text-purple-300"
                    >
                      → {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-purple-900/50 text-center">
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