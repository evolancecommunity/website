import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [email, setEmail] = useState("");
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, you'd send this to your backend
      console.log("Waitlist signup:", email);
      setIsWaitlistSubmitted(true);
      setEmail("");
      setTimeout(() => setIsWaitlistSubmitted(false), 3000);
    }
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const scrollToWaitlist = () => {
    document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Evolance
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-white/80 hover:text-white transition-colors duration-300">Features</a>
                <a href="#journey" className="text-white/80 hover:text-white transition-colors duration-300">Journey</a>
                <a href="#testimonials" className="text-white/80 hover:text-white transition-colors duration-300">Stories</a>
                <button 
                  onClick={scrollToWaitlist}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1610209455607-89e8b3e0e393')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-pink-900/50 z-10" />
        
        <div className="relative z-20 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                Evolve Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Consciousness
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Embark on a transformative journey of self-discovery and spiritual awakening. 
              Unlock your infinite potential and connect with your highest self.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={scrollToWaitlist}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
              >
                <span className="relative z-10">Begin Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button className="text-white/80 hover:text-white px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-purple-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-3/4 right-20 w-6 h-6 bg-pink-400 rounded-full animate-bounce opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-indigo-400 rounded-full animate-ping opacity-50" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Unlock Your Spiritual Potential
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover the tools and guidance needed to elevate your consciousness and transform your life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl">
              <div className="mb-6">
                <img 
                  src="https://images.pexels.com/photos/6931694/pexels-photo-6931694.jpeg" 
                  alt="Spiritual Meditation"
                  className="w-full h-48 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Guided Meditation</h3>
              <p className="text-white/70 leading-relaxed">
                Experience profound inner peace through personalized meditation practices tailored to your spiritual journey.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1664042913846-abb18eba6226" 
                  alt="Consciousness Expansion"
                  className="w-full h-48 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Consciousness Expansion</h3>
              <p className="text-white/70 leading-relaxed">
                Expand your awareness and tap into higher states of consciousness through proven techniques and practices.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl">
              <div className="mb-6">
                <img 
                  src="https://images.pexels.com/photos/18161126/pexels-photo-18161126.jpeg" 
                  alt="Sacred Geometry"
                  className="w-full h-48 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Sacred Wisdom</h3>
              <p className="text-white/70 leading-relaxed">
                Access ancient wisdom and sacred teachings that illuminate the path to spiritual enlightenment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/7663144/pexels-photo-7663144.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-pink-900/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Your Consciousness Journey
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Navigate through levels of awareness and unlock your true potential
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Awakening", description: "Begin your spiritual journey with guided awareness practices" },
              { step: "02", title: "Exploration", description: "Dive deeper into consciousness with advanced techniques" },
              { step: "03", title: "Integration", description: "Integrate insights into your daily life and relationships" },
              { step: "04", title: "Transcendence", description: "Achieve higher states of consciousness and inner peace" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Transformation Stories
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Real experiences from those who have embraced their spiritual evolution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Meditation Teacher",
                content: "Evolance opened doorways to consciousness I never knew existed. My daily practice has become a source of infinite wisdom and peace.",
                avatar: "https://images.unsplash.com/photo-1652979849084-da60bb6a3846"
              },
              {
                name: "Marcus Rivera",
                role: "Spiritual Seeker",
                content: "The journey through Evolance has been nothing short of miraculous. I've discovered my true purpose and connected with my higher self.",
                avatar: "https://images.unsplash.com/photo-1652979849084-da60bb6a3846"
              },
              {
                name: "Luna Patel",
                role: "Energy Healer",
                content: "This platform bridges ancient wisdom with modern understanding. My spiritual growth has accelerated beyond my wildest dreams.",
                avatar: "https://images.unsplash.com/photo-1652979849084-da60bb6a3846"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-purple-400/50"
                  />
                  <div>
                    <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-purple-300">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-white/70">Everything you need to know about your spiritual journey</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What is Evolance and how does it work?",
                answer: "Evolance is a comprehensive platform for spiritual growth and consciousness expansion. We combine ancient wisdom traditions with modern technology to guide you through personalized spiritual practices, meditation techniques, and consciousness development exercises."
              },
              {
                question: "Do I need prior meditation or spiritual experience?",
                answer: "Not at all! Evolance is designed for everyone, from complete beginners to advanced practitioners. Our adaptive system meets you wherever you are on your journey and provides appropriate guidance for your level."
              },
              {
                question: "How is Evolance different from other spiritual apps?",
                answer: "Evolance offers a unique blend of personalized AI guidance, ancient wisdom teachings, and community support. We focus on deep transformation rather than surface-level wellness, providing tools for genuine consciousness evolution."
              },
              {
                question: "When will Evolance be available?",
                answer: "We're currently in development and accepting early access members to our waitlist. Waitlist members will receive exclusive early access, special pricing, and the opportunity to shape the platform's development."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
                <button
                  className="w-full px-8 py-6 text-left hover:bg-white/5 transition-colors duration-200 flex justify-between items-center"
                  onClick={() => toggleAccordion(index)}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <span className={`text-purple-400 transform transition-transform duration-200 ${activeAccordion === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {activeAccordion === index && (
                  <div className="px-8 pb-6 text-white/70 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1636548974452-7217d5eab8dc')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-pink-900/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-bold mb-6 text-white">
            Ready to
            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent"> Evolve</span>?
          </h2>
          <p className="text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands of consciousness explorers on the waitlist and be among the first to experience 
            the future of spiritual growth.
          </p>

          <div className="max-w-md mx-auto">
            {isWaitlistSubmitted ? (
              <div className="bg-green-500/20 backdrop-blur-lg border border-green-400/50 rounded-2xl p-8 animate-pulse">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-semibold text-white mb-2">Welcome to the Journey!</h3>
                <p className="text-green-300">You're now on our waitlist. Check your email for next steps.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="mb-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  Join the Waitlist
                </button>
                <p className="text-white/60 text-sm mt-4">
                  Early access • Exclusive pricing • Shape the future
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-lg border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Evolance
              </div>
              <p className="text-white/70 mb-6 max-w-md">
                Empowering consciousness evolution through ancient wisdom and modern technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-300">
                  <span className="text-white">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-300">
                  <span className="text-white">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-300">
                  <span className="text-white">in</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Evolance. All rights reserved. Evolving consciousness, one soul at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;