import React, { useState } from 'react';
import { Stars, Moon, Sun, Italic as Crystal, Sparkles, MessageCircle, ChevronDown, Send, Menu, X, Heart, Users, Book, Compass, Mail, ArrowRight, Youtube, Newspaper } from 'lucide-react';
import { Page } from './types';
import { blogPosts, videos } from './data';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  const navigation: { name: Page; icon: React.ReactNode }[] = [
    { name: 'home', icon: <Stars className="h-5 w-5" /> },
    { name: 'kundali', icon: <Moon className="h-5 w-5" /> },
    { name: 'recommendations', icon: <Crystal className="h-5 w-5" /> },
    { name: 'blog', icon: <Newspaper className="h-5 w-5" /> },
    { name: 'videos', icon: <Youtube className="h-5 w-5" /> },
    { name: 'chat', icon: <MessageCircle className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900">
      {/* Accessible Navigation */}
      <nav className="fixed w-full z-50 bg-black/20 backdrop-blur-lg" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center" aria-label="SoulBuddy Home">
              <Stars className="h-8 w-8 text-yellow-300" aria-hidden="true" />
              <span className="ml-2 text-2xl font-playfair font-semibold text-white">SoulBuddy</span>
            </a>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {navigation.map(({ name, icon }) => (
                  <button
                    key={name}
                    onClick={() => setCurrentPage(name)}
                    className={`flex items-center space-x-2 text-gray-300 hover:text-white transition-colors capitalize focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg px-3 py-2 ${
                      currentPage === name ? 'text-white bg-purple-600/20' : ''
                    }`}
                    aria-current={currentPage === name ? 'page' : undefined}
                  >
                    {React.cloneElement(icon as React.ReactElement, { 'aria-hidden': true })}
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-2"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Accessible Mobile Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden bg-black/30 backdrop-blur-lg"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="mobile-menu-button"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map(({ name, icon }) => (
                <button
                  key={name}
                  onClick={() => {
                    setCurrentPage(name);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full text-left px-3 py-2 text-gray-300 hover:text-white capitalize rounded-lg ${
                    currentPage === name ? 'bg-purple-600/20 text-white' : ''
                  }`}
                  role="menuitem"
                  aria-current={currentPage === name ? 'page' : undefined}
                >
                  {React.cloneElement(icon as React.ReactElement, { 'aria-hidden': true })}
                  <span className="ml-2">{name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16" role="main">
        {currentPage === 'home' && (
          <div>
            {/* Hero Section */}
            <section 
              className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
              aria-label="Hero section"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover bg-center opacity-20"
                  aria-hidden="true"
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
                  aria-label="Begin your journey"
                >
                  Begin Your Journey <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </section>

            {/* Blog Preview */}
            <section className="py-20 bg-black/20 backdrop-blur-lg" aria-labelledby="blog-heading">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 id="blog-heading" className="text-3xl font-bold text-white text-center mb-12 font-playfair">
                  Latest Insights
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.map((post) => (
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
                        className="text-purple-300 hover:text-purple-200 transition-colors"
                        aria-label={`Read more about ${post.title}`}
                      >
                        Read more →
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Video Preview */}
            <section className="py-20" aria-labelledby="video-heading">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 id="video-heading" className="text-3xl font-bold text-white text-center mb-12 font-playfair">
                  Featured Videos
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {videos.map((video) => (
                    <div key={video.id} className="card">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Youtube className="h-12 w-12 text-white" aria-hidden="true" />
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
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-black/20 backdrop-blur-lg" aria-labelledby="newsletter-heading">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 id="newsletter-heading" className="text-3xl font-bold text-white mb-6 font-playfair">
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
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                      id="email"
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
                    <Mail className="h-5 w-5 mr-2" aria-hidden="true" />
                    Subscribe
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}

        {/* Additional page content would go here */}
      </main>

      {/* Accessible Footer */}
      <footer className="bg-black/20 backdrop-blur-lg py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Stars className="h-8 w-8 text-yellow-300" aria-hidden="true" />
                <span className="ml-2 text-2xl font-playfair font-semibold text-white">SoulBuddy</span>
              </div>
              <p className="text-gray-300">
                Your AI-powered spiritual companion for cosmic guidance and inner peace.
              </p>
            </div>
            <nav aria-label="Footer navigation">
              <h3 className="text-white font-semibold mb-4 font-playfair">Quick Links</h3>
              <ul className="space-y-2">
                {['About Us', 'Features', 'Testimonials', 'Contact'].map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3 className="text-white font-semibold mb-4 font-playfair">Connect</h3>
              <ul className="space-y-2">
                {['Twitter', 'Instagram', 'Facebook', 'LinkedIn'].map((social) => (
                  <li key={social}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                      aria-label={`Follow us on ${social}`}
                    >
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