import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import "./App.css";
import { useRef } from "react";

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
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize EmailJS
    emailjs.init("nZNy_SQwTWUNt2Tva");

    // Update waitlist count
    updateWaitlistCount();
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 40) {
            setShowNavbar(false); // scrolling down
          } else {
            setShowNavbar(true); // scrolling up
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const updateWaitlistCount = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/waitlist`);
    const data = await res.json();
    setWaitlistCount(data.length);
  } catch (err) {
    console.error("Failed to fetch waitlist count:", err);
  }
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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/waitlist`);
      const existingData = await res.json();

      // Check if email already exists
      const emailExists = existingData.some(entry => entry.email === formData.email);

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
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/waitlist`, {
       method: "POST",
       headers: { "Content-Type": "application/json",},
       body: JSON.stringify({
       name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email })
      });

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

  const getWaitlistData = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/waitlist`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch waitlist data:", err);
    return [];
  }
};

  const clearWaitlist = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/waitlist/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        updateWaitlistCount();
        console.log('Waitlist cleared successfully');
      } else {
        console.error('Failed to clear waitlist:', res.status);
      }
    } catch (err) {
      console.error('Error clearing waitlist:', err);
    }
  };


  // SVG Components
  const InfinitySymbol = () => (
    <svg viewBox="0 0 160 80" className="w-32 h-16 mx-auto mb-6">
      <defs>
        <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="25%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#C084FC" />
          <stop offset="75%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        
        <linearGradient id="infinityGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#F472B6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
        </linearGradient>
        
        <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <linearGradient id="flowingLight" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          <animateTransform 
            attributeName="gradientTransform" 
            type="translate" 
            values="-200 0;200 0;-200 0" 
            dur="4s" 
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      
      {/* Outer glow effect */}
      <path 
        d="M30,40 C30,20 50,20 65,35 C80,50 95,50 110,35 C125,20 145,20 130,40 C130,60 110,60 95,45 C80,30 65,30 50,45 C35,60 15,60 30,40 Z" 
        fill="none" 
        stroke="url(#infinityGlow)" 
        strokeWidth="12" 
        strokeLinecap="round"
        opacity="0.3"
        filter="url(#glowEffect)"
      >
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
      </path>
      
      {/* Main infinity symbol */}
      <path 
        d="M30,40 C30,25 45,25 60,35 C75,45 90,45 105,35 C120,25 135,25 130,40 C130,55 115,55 100,45 C85,35 70,35 55,45 C40,55 25,55 30,40 Z" 
        fill="none" 
        stroke="url(#infinityGradient)" 
        strokeWidth="6" 
        strokeLinecap="round"
        filter="url(#glowEffect)"
      >
        <animate attributeName="stroke-width" values="6;8;6" dur="4s" repeatCount="indefinite" />
        <animateTransform 
          attributeName="transform" 
          type="scale" 
          values="1;1.05;1" 
          dur="6s" 
          repeatCount="indefinite"
          transformOrigin="80 40"
        />
      </path>
      
      {/* Inner light path */}
      <path 
        d="M30,40 C30,25 45,25 60,35 C75,45 90,45 105,35 C120,25 135,25 130,40 C130,55 115,55 100,45 C85,35 70,35 55,45 C40,55 25,55 30,40 Z" 
        fill="none" 
        stroke="url(#infinityGradient)" 
        strokeWidth="3" 
        strokeLinecap="round"
        opacity="0.9"
      />
      
      {/* Flowing light effect */}
      <path 
        d="M30,40 C30,25 45,25 60,35 C75,45 90,45 105,35 C120,25 135,25 130,40 C130,55 115,55 100,45 C85,35 70,35 55,45 C40,55 25,55 30,40 Z" 
        fill="none" 
        stroke="url(#flowingLight)" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Center intersection glow */}
      <circle cx="80" cy="40" r="4" fill="url(#infinityGradient)" opacity="0.6">
        <animate attributeName="r" values="3;6;3" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      
      {/* Energy particles */}
      <circle cx="50" cy="30" r="1.5" fill="#A78BFA" opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0,0;3,-2;0,0" 
          dur="4s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle cx="110" cy="50" r="1" fill="#F472B6" opacity="0.7">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.8s" repeatCount="indefinite" />
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0,0;-2,3;0,0" 
          dur="3.5s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle cx="65" cy="50" r="1.2" fill="#C084FC" opacity="0.6">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.3s" repeatCount="indefinite" />
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0,0;4,1;0,0" 
          dur="4.2s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle cx="95" cy="30" r="0.8" fill="#38BDF8" opacity="0.9">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0,0;-3,-1;0,0" 
          dur="3.8s" 
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );

  const CosmicBackground = () => (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="cosmicGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="30%" stopColor="#6366F1" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#EC4899" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.8" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#cosmicGradient)" />
      <circle cx="200" cy="150" r="2" fill="#A78BFA" opacity="0.8" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="800" cy="100" r="1.5" fill="#F472B6" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="1000" cy="300" r="1" fill="#38BDF8" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="300" cy="500" r="2.5" fill="#C084FC" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.7;0.1" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="600" cy="200" r="1.8" fill="#F59E0B" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.9;0.2" dur="4.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );

  const MeditationSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <defs>
        <linearGradient id="meditationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <radialGradient id="aura" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      
      {/* Meditation aura */}
      <ellipse cx="200" cy="120" rx="150" ry="80" fill="url(#aura)">
        <animate attributeName="rx" values="150;170;150" dur="4s" repeatCount="indefinite" />
        <animate attributeName="ry" values="80;90;80" dur="4s" repeatCount="indefinite" />
      </ellipse>
      
      {/* Sitting figure */}
      <path d="M200 200 Q180 180 160 190 Q140 200 140 220 Q140 240 160 245 L180 245 L180 260 Q180 270 190 270 L210 270 Q220 270 220 260 L220 245 L240 245 Q260 240 260 220 Q260 200 240 190 Q220 180 200 200Z" fill="url(#meditationGradient)" opacity="0.8"/>
      
      {/* Head */}
      <circle cx="200" cy="160" r="25" fill="url(#meditationGradient)" opacity="0.9"/>
      
      {/* Chakra points */}
      <circle cx="200" cy="140" r="3" fill="#F59E0B" opacity="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="170" r="3" fill="#06B6D4" opacity="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="190" r="3" fill="#10B981" opacity="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite" />
      </circle>
      
      {/* Energy lines */}
      <path d="M150 140 Q200 120 250 140" stroke="#A78BFA" strokeWidth="2" fill="none" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M160 200 Q200 180 240 200" stroke="#F472B6" strokeWidth="2" fill="none" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" />
      </path>
    </svg>
  );

  const ConsciousnessSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <defs>
        <linearGradient id="consciousnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <radialGradient id="mindField" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      
      {/* Consciousness field */}
      <circle cx="200" cy="150" r="120" fill="url(#mindField)">
        <animate attributeName="r" values="120;140;120" dur="6s" repeatCount="indefinite" />
      </circle>
      
      {/* Brain/mind representation */}
      <path d="M200 100 Q240 110 260 140 Q270 170 250 190 Q230 200 200 195 Q170 200 150 190 Q130 170 140 140 Q160 110 200 100Z" fill="url(#consciousnessGradient)" opacity="0.7"/>
      
      {/* Neural connections */}
      <g stroke="#A78BFA" strokeWidth="1.5" fill="none" opacity="0.6">
        <path d="M170 130 Q200 115 230 130">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M160 150 Q200 135 240 150">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M170 170 Q200 155 230 170">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Expanding consciousness waves */}
      <circle cx="200" cy="150" r="80" stroke="#F472B6" strokeWidth="2" fill="none" opacity="0.4">
        <animate attributeName="r" values="80;100;80" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="150" r="100" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.3">
        <animate attributeName="r" values="100;120;100" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="5s" repeatCount="indefinite" />
      </circle>
      
      {/* Thought particles */}
      <circle cx="180" cy="120" r="2" fill="#F59E0B">
        <animate attributeName="cy" values="120;80;120" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="220" cy="130" r="1.5" fill="#10B981">
        <animate attributeName="cy" values="130;90;130" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );

  const SacredGeometrySVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <defs>
        <linearGradient id="geometryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <filter id="geometryGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Flower of Life pattern */}
      <g transform="translate(200,150)" filter="url(#geometryGlow)">
        <circle cx="0" cy="0" r="30" stroke="url(#geometryGradient)" strokeWidth="2" fill="none" opacity="0.8"/>
        <circle cx="26" cy="0" r="30" stroke="url(#geometryGradient)" strokeWidth="2" fill="none" opacity="0.7"/>
        <circle cx="-26" cy="0" r="30" stroke="url(#geometryGradient)" strokeWidth="2" fill="none" opacity="0.7"/>
        <circle cx="13" cy="22" r="30" stroke="url(#geometryGradient)" strokeWidth="2" fill="none" opacity="0.7"/>
        <circle cx="-13" cy="22" r="30" stroke="url(#geometryGradient)" strokeWidth="2" fill="none" opacity="0.7"/>
        <circle cx="13" cy="-22" r="30" stroke="url(#geometryGradient)" strokeWidth="2" fill="none" opacity="0.7"/>
        <circle cx="-13" cy="-22" r="30" stroke="url(#geometryGradient)" strokeWidth="2" fill="none" opacity="0.7"/>
        
        <animateTransform attributeName="transform" type="rotate" values="0 200 150;360 200 150" dur="20s" repeatCount="indefinite"/>
      </g>
      
      {/* Mandala elements */}
      <g transform="translate(200,150)">
        <polygon points="0,-40 12,-12 40,0 12,12 0,40 -12,12 -40,0 -12,-12" fill="url(#geometryGradient)" opacity="0.3">
          <animateTransform attributeName="transform" type="rotate" values="0;45;0" dur="8s" repeatCount="indefinite"/>
        </polygon>
        <polygon points="0,-25 7,-7 25,0 7,7 0,25 -7,7 -25,0 -7,-7" fill="url(#geometryGradient)" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" values="0;-45;0" dur="6s" repeatCount="indefinite"/>
        </polygon>
      </g>
      
      {/* Sacred triangles */}
      <g stroke="url(#geometryGradient)" strokeWidth="1.5" fill="none" opacity="0.6">
        <polygon points="200,80 180,120 220,120">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
        </polygon>
        <polygon points="200,220 180,180 220,180">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.5s" repeatCount="indefinite" />
        </polygon>
      </g>
    </svg>
  );

  const JourneyBackground = () => (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#6366F1" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#journeyGradient)" />
      
      {/* Constellation pattern */}
      <g stroke="#A78BFA" strokeWidth="1" opacity="0.4">
        <line x1="100" y1="100" x2="200" y2="150">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="200" y1="150" x2="350" y2="120">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="350" y1="120" x2="500" y2="180">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4.5s" repeatCount="indefinite" />
        </line>
        <line x1="500" y1="180" x2="650" y2="140">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.8s" repeatCount="indefinite" />
        </line>
      </g>
      
      {/* Stars */}
      <circle cx="100" cy="100" r="3" fill="#F59E0B" opacity="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="150" r="2" fill="#10B981" opacity="0.7">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="120" r="2.5" fill="#F472B6" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="500" cy="180" r="2" fill="#38BDF8" opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="650" cy="140" r="3" fill="#A78BFA" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );

  const WaitlistBackground = () => (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="waitlistGradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#EC4899" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.8" />
        </radialGradient>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#F472B6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#waitlistGradient)" />
      
      {/* Flowing energy waves */}
      <path d="M0,400 Q300,350 600,400 T1200,400 L1200,500 Q900,450 600,500 T0,500 Z" fill="url(#waveGradient)">
        <animate attributeName="d" values="M0,400 Q300,350 600,400 T1200,400 L1200,500 Q900,450 600,500 T0,500 Z;M0,420 Q300,370 600,420 T1200,420 L1200,520 Q900,470 600,520 T0,520 Z;M0,400 Q300,350 600,400 T1200,400 L1200,500 Q900,450 600,500 T0,500 Z" dur="8s" repeatCount="indefinite" />
      </path>
      
      {/* Floating orbs */}
      <circle cx="150" cy="200" r="4" fill="#C084FC" opacity="0.6">
        <animate attributeName="cy" values="200;150;200" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="900" cy="300" r="3" fill="#F59E0B" opacity="0.7">
        <animate attributeName="cy" values="300;250;300" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="450" cy="150" r="2" fill="#10B981" opacity="0.5">
        <animate attributeName="cy" values="150;100;150" dur="5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );

  const SampleChart = () => (
    <svg width="100%" height="100%" viewBox="0 0 200 80">
      <rect x="0" y="0" width="200" height="80" rx="16" fill="url(#chartBg)" />
      <defs>
        <linearGradient id="chartBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#chartLine)"
        strokeWidth="4"
        strokeLinejoin="round"
        points="10,70 40,50 70,60 100,30 130,40 160,20 190,35"
      >
        <animate attributeName="points" values="10,70 40,50 70,60 100,30 130,40 160,20 190,35;10,60 40,55 70,40 100,50 130,30 160,40 190,25;10,70 40,50 70,60 100,30 130,40 160,20 190,35" dur="4s" repeatCount="indefinite" />
      </polyline>
      <circle cx="100" cy="30" r="5" fill="#EC4899" opacity="0.7">
        <animate attributeName="cy" values="30;50;30" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );

  const ChatPreview = () => (
    <div className="w-full h-full flex flex-col justify-end items-start p-2 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-lg">
      {/* AI message */}
      <div className="mb-2 flex items-end">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold mr-2 shadow-md">ev</div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-2xl text-xs max-w-[80%] shadow-lg animate-fade-in">
          How are you feeling today?
        </div>
      </div>
      {/* User message */}
      <div className="mb-2 flex items-end justify-end self-end">
        <div className="bg-white/10 text-white px-3 py-2 rounded-2xl text-xs max-w-[80%] shadow-lg animate-fade-in mr-2">
          I feel a bit anxious about my new job.
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shadow-md">U</div>
      </div>
      {/* AI supportive reply */}
      <div className="flex items-end">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold mr-2 shadow-md">ev</div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-2xl text-xs max-w-[80%] shadow-lg animate-fade-in">
          I totally get that! New jobs can be really overwhelming. What's making you feel most anxious about it?
        </div>
      </div>
    </div>
  );

  const DecisionGraph = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 80">
    <rect x="0" y="0" width="200" height="80" rx="16" fill="url(#decisionBg)" />
    <defs>
      <linearGradient id="decisionBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#F472B6" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id="decisionLine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
      <linearGradient id="forecastLine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    {/* Historical data */}
    <path d="M20,60 Q60,20 100,40" fill="none" stroke="url(#decisionLine)" strokeWidth="3" strokeDasharray="5,5" />
    {/* Current point */}
    <circle cx="100" cy="40" r="4" fill="#38BDF8" />
    {/* Forecast line */}
    <path d="M100,40 Q140,25 180,15" fill="none" stroke="url(#forecastLine)" strokeWidth="4" strokeDasharray="8,4">
      <animate attributeName="stroke-dashoffset" values="0;-12" dur="2s" repeatCount="indefinite" />
    </path>
    {/* Forecast ball */}
    <circle cx="140" cy="25" r="6" fill="#F472B6" opacity="0.7">
      <animate attributeName="cx" values="100;140;180" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      <animate attributeName="cy" values="40;25;15" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
    </circle>
    <text x="50" y="25" fontSize="10" fill="#fff" opacity="0.6">Past</text>
    <text x="100" y="35" fontSize="10" fill="#fff" opacity="0.8">Now</text>
    <text x="150" y="10" fontSize="10" fill="#fff" opacity="0.6">Future</text>
  </svg>
);

  const Fingerprint = () => (
  <svg width="100%" height="100%" viewBox="0 0 80 80">
    <defs>
      <radialGradient id="fpBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
      </radialGradient>
      <linearGradient id="fpLine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <circle cx="40" cy="40" r="38" fill="url(#fpBg)">
      <animate attributeName="r" values="38;42;38" dur="3s" repeatCount="indefinite" />
    </circle>
    <path d="M40,60 Q30,50 40,40 Q50,30 40,20" fill="none" stroke="url(#fpLine)" strokeWidth="3">
      <animate attributeName="d" values="M40,60 Q30,50 40,40 Q50,30 40,20;M40,58 Q32,48 40,38 Q48,28 40,18;M40,60 Q30,50 40,40 Q50,30 40,20" dur="4s" repeatCount="indefinite" />
    </path>
    <path d="M40,65 Q20,45 40,25 Q60,5 40,15" fill="none" stroke="url(#fpLine)" strokeWidth="2" opacity="0.7">
      <animate attributeName="d" values="M40,65 Q20,45 40,25 Q60,5 40,15;M40,63 Q22,43 40,23 Q58,3 40,13;M40,65 Q20,45 40,25 Q60,5 40,15" dur="4.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
    </path>
    <path d="M40,70 Q10,40 40,10 Q70,-20 40,5" fill="none" stroke="url(#fpLine)" strokeWidth="1" opacity="0.5">
      <animate attributeName="d" values="M40,70 Q10,40 40,10 Q70,-20 40,5;M40,68 Q12,38 40,8 Q68,-22 40,3;M40,70 Q10,40 40,10 Q70,-20 40,5" dur="5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

  const PrivacyLock = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative">
      {/* Outer shield glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg animate-pulse"></div>
      
      {/* Main shield container */}
      <div className="relative glass-effect-dark rounded-full p-6 flex items-center justify-center shadow-2xl border border-purple-400/30">
        <svg width="50" height="50" viewBox="0 0 50 50">
          <defs>
            <radialGradient id="shieldGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
            </radialGradient>
            <linearGradient id="lockGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          
          {/* Shield background */}
          <ellipse cx="25" cy="25" rx="22" ry="22" fill="url(#shieldGradient)">
            <animate attributeName="rx" values="22;24;22" dur="3s" repeatCount="indefinite" />
            <animate attributeName="ry" values="22;24;22" dur="3s" repeatCount="indefinite" />
          </ellipse>
          
          {/* Shield border */}
          <ellipse cx="25" cy="25" rx="22" ry="22" fill="none" stroke="url(#lockGradient)" strokeWidth="2" strokeOpacity="0.6">
            <animate attributeName="strokeOpacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </ellipse>
          
          {/* Lock body */}
          <rect x="15" y="22" width="20" height="15" rx="6" fill="url(#lockGradient)" fillOpacity="0.8">
            <animate attributeName="fillOpacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite" />
          </rect>
          
          {/* Lock keyhole */}
          <rect x="22" y="28" width="6" height="8" rx="3" fill="#fff" fillOpacity="0.9">
            <animate attributeName="fillOpacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <circle cx="25" cy="26" r="1.5" fill="#fff" fillOpacity="0.9">
            <animate attributeName="r" values="1.5;2;1.5" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Lock shackle */}
          <rect x="18" y="12" width="14" height="12" rx="7" fill="none" stroke="url(#lockGradient)" strokeWidth="3" strokeOpacity="0.8">
            <animate attributeName="strokeOpacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
          </rect>
          
          {/* Privacy dots */}
          <circle cx="15" cy="15" r="1" fill="#10B981" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="15" r="1" fill="#10B981" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="25" cy="8" r="1" fill="#10B981" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      
      {/* Floating security elements */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500/80 rounded-full animate-ping"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500/80 rounded-full animate-pulse"></div>
    </div>
  </div>
);

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
      <nav
        className={`fixed top-0 w-full z-30 bg-black/20 backdrop-blur-lg border-b border-white/10 
          ${showNavbar ? 'navbar-show' : 'navbar-hide'}
        `}
        onMouseEnter={() => setShowNavbar(true)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="#" className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Evolance
              </a>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium">Features</a>
                <a href="#faq" className="text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium">FAQ</a>
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
        <CosmicBackground />
        
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

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-loose text-white">
              World's First AI Platform for
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent pb-2">
                Emotional Intelligence
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Evolance helps you achieve emotional clarity, make better decisions, and unlock your full potential through AI-powered emotional analytics and personalized guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={scrollToWaitlist}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg text-base font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Early Access
              </button>
              
              <a 
                href="#features"
                className="text-white/80 hover:text-white px-8 py-3 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm text-base font-medium cursor-pointer scroll-smooth"
              >
                Learn More
              </a>
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  {/* Animated Bar Chart SVG */}
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <rect x="8" y="22" width="4" height="10" rx="2" fill="#a78bfa">
                      <animate attributeName="height" values="10;16;10" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="y" values="22;16;22" dur="1.5s" repeatCount="indefinite" />
                    </rect>
                    <rect x="18" y="16" width="4" height="16" rx="2" fill="#f472b6">
                      <animate attributeName="height" values="16;10;16" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="y" values="16;22;16" dur="1.5s" repeatCount="indefinite" />
                    </rect>
                    <rect x="28" y="10" width="4" height="22" rx="2" fill="#38bdf8">
                      <animate attributeName="height" values="22;14;22" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="y" values="10;18;10" dur="1.5s" repeatCount="indefinite" />
                    </rect>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Emolytics Dashboard</h3>
                <p className="text-white/70 text-sm">Visualize your emotional trends and patterns with interactive analytics.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  {/* Animated Chat Bubble SVG */}
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <ellipse cx="20" cy="20" rx="14" ry="10" fill="#a78bfa" fillOpacity="0.2">
                      <animate attributeName="rx" values="14;16;14" dur="2s" repeatCount="indefinite" />
                    </ellipse>
                    <rect x="10" y="15" width="20" height="10" rx="5" fill="#f472b6" fillOpacity="0.7">
                      <animate attributeName="width" values="20;24;20" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="x" values="10;8;10" dur="2s" repeatCount="indefinite" />
                    </rect>
                    <circle cx="16" cy="20" r="1.5" fill="#fff">
                      <animate attributeName="r" values="1.5;2;1.5" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="20" cy="20" r="1.5" fill="#fff">
                      <animate attributeName="r" values="1.5;2;1.5" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="24" cy="20" r="1.5" fill="#fff">
                      <animate attributeName="r" values="1.5;2;1.5" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">AI Companion</h3>
                <p className="text-white/70 text-sm">Get 24/7 support and personalized guidance from your emotionally intelligent AI.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  {/* Animated Upward Arrow/Line Chart SVG */}
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <polyline points="8,28 18,18 26,24 32,12" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinejoin="round">
                      <animate attributeName="points" values="8,28 18,18 26,24 32,12;8,28 18,20 26,16 32,8;8,28 18,18 26,24 32,12" dur="2s" repeatCount="indefinite" />
                    </polyline>
                    <circle cx="32" cy="12" r="2.5" fill="#f472b6">
                      <animate attributeName="cy" values="12;8;12" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Decision Forecasting</h3>
                <p className="text-white/70 text-sm">See how your choices could impact your emotional future with predictive insights.</p>
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
              Unlock the Power of Emotional Intelligence
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Evolance gives you the tools to understand, track, and improve your emotional well-being using real-time analytics and AI-driven insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4 h-40 flex items-center justify-center">
                <SampleChart />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Emolytics Dashboard</h3>
              <p className="text-white/70 leading-relaxed">
                Visualize your emotional trends, triggers, and patterns with interactive charts. Track your growth and gain clarity on your emotional journey.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4 h-40 flex items-center justify-center">
                <ChatPreview />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Companion</h3>
              <p className="text-white/70 leading-relaxed">
                Get 24/7 support from an emotionally intelligent AI. Receive personalized guidance, reflection prompts, and actionable insights tailored to your needs.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4 h-40 flex items-center justify-center">
                <DecisionGraph />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Decision Forecasting</h3>
              <p className="text-white/70 leading-relaxed">
                Simulate how life decisions might impact your emotional trajectory. See predictive analytics and make confident, data-driven choices for your future.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4 h-40 flex items-center justify-center">
                <Fingerprint />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Emotional Fingerprint</h3>
              <p className="text-white/70 leading-relaxed">
                Discover your unique emotional identity. Evolance adapts to your patterns, helping you build self-mastery and track your authentic growth over time.
              </p>
            </div>
            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4 h-40 flex items-center justify-center">
                <PrivacyLock />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Privacy-First Design</h3>
              <p className="text-white/70 leading-relaxed">
                You can freely share the things you wouldn't even tell yourself or any therapist. Your data is secure and private, built with privacy at its core.
              </p>
            </div>
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
              Real experiences from those who want to embrace their emotional well-being
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            {[
              {
                name: "Mia",
                role: "Meditation Teacher",
                content: "Evolance opened doorways to self empowerment which I never knew existed. I can't wait to improve my emotional health.",
                initials: "SC"
              },
              {
                name: "Alice",
                role: "MSBA Student at UC Irvine",
                content: "I have used various technologies and guidances but have never gone beyond recorded meditation. I want to really come out of my problems graved inside me.",
                initials: "MR"
              },
              {
                name: "Julian",
                role: "Principal Software Engineer",
                content: "I have always believed that ancient wisdom was all about freedom and not being a part of a conservative society. I found Evolance is breaking the silence finally, and i waitlisted for it.",
                initials: "LP"
              },
              {
                name: "Priya",
                role: "Therapist",
                content: "Evolance's AI insights helped me understand my emotional triggers and patterns in a way nothing else has.",
                initials: "PR"
              },
              {
                name: "Carlos",
                role: "Startup Founder",
                content: "The decision forecasting feature gave me clarity during a tough business pivot. Highly recommended!",
                initials: "CA"
              },
              {
                name: "Fatima",
                role: "Artist",
                content: "I love how Evolance respects privacy while providing deep, actionable emotional analytics.",
                initials: "FA"
              },
              {
                name: "Ethan",
                role: "High School Student",
                content: "The AI companion feels like a real friend who understands me. I feel more confident about my future.",
                initials: "ET"
              }
            ].map((testimonial, index, arr) => (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 ${index === arr.length - 1 ? 'md:col-span-1 md:col-start-2' : ''}`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">{testimonial.initials}</span>
                  </div>
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
      <section id="faq" className="py-20 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-lg text-white/70">Everything you need to know about your journey at Evolance</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What is Evolance and how does it work?",
                answer: "Evolance is a comprehensive platform for emotional growth and intelligence. We bring ancient wisdom and psychology together using AI to guide you through personalized emotional well-being, meditation techniques, and mental strength development exercises."
              },
              {
                question: "Do I need prior meditation or any spiritual experience?",
                answer: "Not at all! Evolance is designed for everyone, from complete beginners to advanced practitioners. Our adaptive system meets you wherever you are on your journey and provides appropriate guidance for your level."
              },
              {
                question: "How is Evolance different from other mental health apps?",
                answer: "Evolance offers a unique blend of personalized AI guidance for emotional health, and community support. We focus on deep transformation rather than surface-level wellness, providing tools for genuine inner contentment evolution. Our platform includes the Emolytics Dashboard for emotional tracking, AI Companion for 24/7 support, Decision Forecasting for life choices, Emotional Fingerprint for personal patterns, and Privacy-First Design for complete data security."
              },
              {
                question: "When will Evolance be available?",
                answer: "We're currently in development and accepting early access members to our waitlist. Waitlist members will receive exclusive early access, special pricing, and the opportunity to shape the platform's development."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors duration-200 flex justify-between items-start"
                  onClick={() => toggleAccordion(index)}
                >
                  <h3 className="text-base font-semibold text-white pr-4 flex-1 text-left leading-relaxed">{faq.question}</h3>
                  <span className={`text-purple-400 transform transition-transform duration-200 flex-shrink-0 mt-1 ${activeAccordion === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {activeAccordion === index && (
                  <div className="px-6 pb-4 text-white/70 leading-relaxed text-sm border-t border-white/10 pt-4">
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
        <WaitlistBackground />
        
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Elevate Your Emotional Intelligence?
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
          <div className="mt-20 flex justify-center">
            <span className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 border border-purple-400/30 text-base font-medium shadow-sm backdrop-blur-sm animated-gradient-text">
              First 100 members get one month free access to our Pro Plan!
            </span>
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
                Unlock your emotional intelligence through AI-powered analytics, decision forecasting, and personalized emotional support.
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
            <p>&copy; 2025 Evolance. All rights reserved. Empowering People.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;