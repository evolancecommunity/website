import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize EmailJS
    emailjs.init("nZNy_SQwTWUNt2Tva");

    // Update waitlist count
    updateWaitlistCount();
  }, []);

  const updateWaitlistCount = () => {
    const waitlistData = JSON.parse(localStorage.getItem('evolanceWaitlist') || '[]');
    setWaitlistCount(waitlistData.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setSubmitError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Store in local database (localStorage for now)
      const waitlistData = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };

      // Get existing waitlist data
      const existingData = JSON.parse(localStorage.getItem('evolanceWaitlist') || '[]');
      
      // Check if email already exists
      const emailExists = existingData.some(entry => entry.email === formData.email);
      if (emailExists) {
        setSubmitError("This email is already on our waitlist!");
        setIsSubmitting(false);
        return;
      }

      // Add new entry
      existingData.push(waitlistData);
      localStorage.setItem('evolanceWaitlist', JSON.stringify(existingData));

      // EmailJS service configuration
      const templateParams = {
        to_name: 'Evolance Founder',
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        subject: `Requesting Waitlist ${formData.firstName} ${formData.lastName} ${formData.email}`,
        message: `New waitlist signup:
        
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Date: ${waitlistData.date}
Time: ${waitlistData.time}
Timestamp: ${waitlistData.timestamp}

This person has expressed interest in joining the Evolance waitlist and would like early access to the platform.

Total waitlist members: ${existingData.length}`
      };

      // Send email using EmailJS
      await emailjs.send(
        'service_bfxrzma',
        'template_zdw244t',
        templateParams
      );

      console.log("Waitlist signup successful:", waitlistData);
      console.log("Total waitlist members:", existingData.length);
      
      // Update waitlist count
      updateWaitlistCount();
      
      setIsWaitlistSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "" });
      setTimeout(() => setIsWaitlistSubmitted(false), 5000);
    } catch (error) {
      console.error('Error processing waitlist signup:', error);
      setSubmitError("There was an error submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const scrollToWaitlist = () => {
    document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' });
  };

  const toggleAdminPanel = () => {
    setShowAdminPanel(!showAdminPanel);
  };

  const getWaitlistData = () => {
    return JSON.parse(localStorage.getItem('evolanceWaitlist') || '[]');
  };

  const clearWaitlist = () => {
    if (window.confirm('Are you sure you want to clear all waitlist data?')) {
      localStorage.removeItem('evolanceWaitlist');
      updateWaitlistCount();
    }
  };

  return (
    <div className="App">
      {/* Admin Panel Toggle */}
      <button 
        className="fixed bottom-4 right-4 z-40 w-8 h-8 bg-purple-600/20 rounded-full opacity-20 hover:opacity-100 transition-opacity duration-300"
        onClick={toggleAdminPanel}
        title="Admin Panel"
      >
        <span className="text-white text-xs">⚙️</span>
      </button>

      {/* Admin Panel */}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-auto border border-purple-500/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Waitlist Admin Panel</h2>
              <button
                onClick={toggleAdminPanel}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-white/80">Total Waitlist Members: <span className="text-purple-400 font-bold text-xl">{waitlistCount}</span></p>
                <button
                  onClick={clearWaitlist}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  Clear All Data
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {getWaitlistData().map((entry, index) => (
                <div key={entry.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="grid md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-purple-300 font-semibold">#{index + 1}</span>
                      <p className="text-white">{entry.firstName} {entry.lastName}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Email:</p>
                      <p className="text-white">{entry.email}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Date:</p>
                      <p className="text-white">{entry.date}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Time:</p>
                      <p className="text-white">{entry.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {waitlistCount === 0 && (
                <div className="text-center py-8 text-white/60">
                  No waitlist entries yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-30 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Evolance
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium">Features</a>
                <a href="#journey" className="text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium">Journey</a>
                <a href="#testimonials" className="text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium">Stories</a>
                <button 
                  onClick={scrollToWaitlist}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-sm font-medium"
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
            {/* Waitlist Counter */}
            {waitlistCount > 0 && (
              <div className="mb-6">
                <div className="inline-flex items-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-full px-4 py-2 border border-purple-400/30">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium">
                    {waitlistCount} people have joined the waitlist
                  </span>
                </div>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Transform Your
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Consciousness Journey
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover personalized spiritual practices, meditation techniques, and consciousness development 
              tools designed to unlock your highest potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={scrollToWaitlist}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg text-base font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Early Access
              </button>
              
              <button className="text-white/80 hover:text-white px-8 py-3 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm text-base font-medium">
                Learn More
              </button>
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-sm">🧘</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Guided Meditation</h3>
                <p className="text-white/70 text-sm">Personalized practices for inner peace</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-sm">🌌</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Consciousness Expansion</h3>
                <p className="text-white/70 text-sm">Advanced awareness techniques</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Ancient Wisdom</h3>
                <p className="text-white/70 text-sm">Time-tested spiritual teachings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Unlock Your Spiritual Potential
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Discover the tools and guidance needed to elevate your consciousness and transform your life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4">
                <img 
                  src="https://images.pexels.com/photos/6931694/pexels-photo-6931694.jpeg" 
                  alt="Spiritual Meditation"
                  className="w-full h-40 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Guided Meditation</h3>
              <p className="text-white/70 leading-relaxed">
                Experience profound inner peace through personalized meditation practices tailored to your spiritual journey.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1664042913846-abb18eba6226" 
                  alt="Consciousness Expansion"
                  className="w-full h-40 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Consciousness Expansion</h3>
              <p className="text-white/70 leading-relaxed">
                Expand your awareness and tap into higher states of consciousness through proven techniques and practices.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4">
                <img 
                  src="https://images.pexels.com/photos/18161126/pexels-photo-18161126.jpeg" 
                  alt="Sacred Geometry"
                  className="w-full h-40 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Sacred Wisdom</h3>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Your Consciousness Journey
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
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
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold text-white group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Transformation Stories
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
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
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-purple-400/50"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-purple-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed italic text-sm">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-lg text-white/70">Everything you need to know about your spiritual journey</p>
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
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors duration-200 flex justify-between items-center"
                  onClick={() => toggleAccordion(index)}
                >
                  <h3 className="text-base font-semibold text-white pr-4">{faq.question}</h3>
                  <span className={`text-purple-400 transform transition-transform duration-200 ${activeAccordion === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {activeAccordion === index && (
                  <div className="px-6 pb-4 text-white/70 leading-relaxed text-sm">
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
        
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-white/80 mb-12">
            Join our waitlist to be among the first to experience Evolance and receive exclusive early access.
          </p>

          <div className="max-w-md mx-auto">
            {isWaitlistSubmitted ? (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/50 rounded-xl p-6">
                <div className="text-3xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-white mb-2">Welcome to the Journey!</h3>
                <p className="text-green-300 mb-2">You're now on our waitlist.</p>
                <p className="text-white/60 text-sm">You're member #{waitlistCount} • Check your email for updates</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                {submitError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 text-sm">
                    {submitError}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                  />
                </div>
                
                <div className="mb-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Joining...
                    </div>
                  ) : (
                    "Join the Waitlist"
                  )}
                </button>
                
                <p className="text-white/60 text-xs mt-3">
                  Early access • Exclusive updates • No spam, ever
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
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Evolance
              </div>
              <p className="text-white/70 mb-6 max-w-md text-sm">
                Empowering consciousness evolution through the perfect blend of ancient wisdom and modern technology.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2024 Evolance. All rights reserved. Evolving consciousness, one soul at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;