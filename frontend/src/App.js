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

            {/* Infinity Symbol - Representing Infinite Consciousness */}
            <div className="mb-8 opacity-90">
              <InfinitySymbol />
              <p className="text-white/60 text-xs mt-2 font-light tracking-widest">
                INFINITE POTENTIAL
              </p>
            </div>

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
              <div className="mb-4 h-40 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-lg p-4">
                <MeditationSVG />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Guided Meditation</h3>
              <p className="text-white/70 leading-relaxed">
                Experience profound inner peace through personalized meditation practices tailored to your spiritual journey.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4 h-40 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-lg p-4">
                <ConsciousnessSVG />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Consciousness Expansion</h3>
              <p className="text-white/70 leading-relaxed">
                Expand your awareness and tap into higher states of consciousness through proven techniques and practices.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4 h-40 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-4">
                <SacredGeometrySVG />
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
        <JourneyBackground />
        
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
                initials: "SC"
              },
              {
                name: "Marcus Rivera",
                role: "Spiritual Seeker",
                content: "The journey through Evolance has been nothing short of miraculous. I've discovered my true purpose and connected with my higher self.",
                initials: "MR"
              },
              {
                name: "Luna Patel",
                role: "Energy Healer",
                content: "This platform bridges ancient wisdom with modern understanding. My spiritual growth has accelerated beyond my wildest dreams.",
                initials: "LP"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
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
        <WaitlistBackground />
        
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