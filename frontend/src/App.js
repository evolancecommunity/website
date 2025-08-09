import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import "./App.css";
import "./EmolyticsAnimations.css";
import { useRef } from "react";
import { BarChart3, Brain, MessageCircle, Check, X, Pen } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush
} from 'recharts';

// Avatar component for user representation
const UserAvatar = ({ size = 32, className = "" }) => (
  <div 
    className={`rounded-2xl overflow-hidden ${className}`}
    style={{ 
      width: size, 
      height: size
    }}
  >
    <img 
      src="/avatar.png" 
      alt="User Avatar" 
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback to simple "U" if image fails to load
        e.target.style.display = 'none';
        e.target.parentElement.style.display = 'flex';
        e.target.parentElement.style.alignItems = 'center';
        e.target.parentElement.style.justifyContent = 'center';
        e.target.parentElement.style.fontSize = size * 0.4 + 'px';
        e.target.parentElement.style.fontWeight = 'bold';
        e.target.parentElement.style.color = '#ffffff80';
        e.target.parentElement.innerHTML = 'U';
      }}
    />
  </div>
);

// Ev Icon component
const EvIcon = ({ size = 32 }) => (
  <div 
    className="rounded-full flex items-center justify-center text-white font-bold shadow-lg"
    style={{ 
      width: size, 
      height: size, 
      background: '#2A7B9B',
      fontSize: size * 0.4 
    }}
  >
    ev
  </div>
);

// Emotion data for charts
const emotionData = {
  Joy: [
    { date: 'Jun 24', intensity: 60, trigger: 'Morning walk', reasoning: 'Fresh air boosted mood' },
    { date: 'Jun 26', intensity: 70, trigger: 'Team lunch', reasoning: 'Positive social interaction' },
    { date: 'Jun 28', intensity: 50, trigger: 'Work deadline', reasoning: 'Mild stress reduced joy' },
    { date: 'Jul 1', intensity: 80, trigger: 'Job offer', reasoning: 'Excitement about new opportunity' },
    { date: 'Jul 3', intensity: 90, trigger: 'Family call', reasoning: 'Supportive conversation' },
    { date: 'Jul 5', intensity: 75, trigger: 'Gym session', reasoning: 'Physical activity uplifted mood' },
    { date: 'Jul 7', intensity: 85, trigger: 'Weekend trip', reasoning: 'Relaxation and fun' }
  ],
  Sadness: [
    { date: 'Jun 24', intensity: 40, trigger: 'Rainy weather', reasoning: 'Gloomy day affected mood' },
    { date: 'Jun 26', intensity: 35, trigger: 'Missed call', reasoning: 'Felt disconnected' },
    { date: 'Jun 28', intensity: 50, trigger: 'Work stress', reasoning: 'Overwhelmed by tasks' },
    { date: 'Jul 1', intensity: 30, trigger: 'Job offer', reasoning: 'Hopeful for change' },
    { date: 'Jul 3', intensity: 20, trigger: 'Family call', reasoning: 'Reassurance from loved ones' },
    { date: 'Jul 5', intensity: 25, trigger: 'Gym session', reasoning: 'Endorphins helped' },
    { date: 'Jul 7', intensity: 15, trigger: 'Weekend trip', reasoning: 'Distraction from worries' }
  ],
  Anger: [
    { date: 'Jun 24', intensity: 30, trigger: 'Traffic jam', reasoning: 'Frustration with commute' },
    { date: 'Jun 26', intensity: 45, trigger: 'Work conflict', reasoning: 'Disagreement with colleague' },
    { date: 'Jun 28', intensity: 20, trigger: 'Missed appointment', reasoning: 'Disappointment in self' },
    { date: 'Jul 1', intensity: 25, trigger: 'Job offer', reasoning: 'Hopeful for change' },
    { date: 'Jul 3', intensity: 35, trigger: 'Family call', reasoning: 'Supportive conversation' },
    { date: 'Jul 5', intensity: 30, trigger: 'Gym session', reasoning: 'Physical activity uplifted mood' },
    { date: 'Jul 7', intensity: 40, trigger: 'Weekend trip', reasoning: 'Relaxation and fun' }
  ],
  Fear: [
    { date: 'Jun 24', intensity: 50, trigger: 'Dark room', reasoning: 'Fear of the unknown' },
    { date: 'Jun 26', intensity: 40, trigger: 'Missed call', reasoning: 'Felt disconnected' },
    { date: 'Jun 28', intensity: 30, trigger: 'Work deadline', reasoning: 'Mild stress reduced joy' },
    { date: 'Jul 1', intensity: 20, trigger: 'Job offer', reasoning: 'Hopeful for change' },
    { date: 'Jul 3', intensity: 25, trigger: 'Family call', reasoning: 'Reassurance from loved ones' },
    { date: 'Jul 5', intensity: 15, trigger: 'Gym session', reasoning: 'Endorphins helped' },
    { date: 'Jul 7', intensity: 20, trigger: 'Weekend trip', reasoning: 'Distraction from worries' }
  ]
};

const emotionColors = {
  Joy: '#facc15',
  Sadness: '#3b82f6',
  Anger: '#ef4444',
  Fear: '#a21caf',
  Surprise: '#06b6d4',
  Disgust: '#22c55e',
};

// Custom Tooltip for emotion analytics
const EmolyticsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="relative min-w-[240px] max-w-xs px-0 py-0">
        <div className="text-white rounded-2xl px-6 py-5 shadow-xl font-medium relative animate-fade-in-up" style={{backgroundColor: '#2A7B9B'}}>
          <div className="absolute -top-6 left-4 flex items-center">
            <EvIcon size={36} />
          </div>
          <span className="absolute left-8 -bottom-4 w-6 h-6 rotate-45 rounded-sm" style={{clipPath:'polygon(0 0, 100% 0, 100% 100%)', backgroundColor: '#2A7B9B'}}></span>
          <div className="mb-2 mt-2 text-base font-semibold">Here's what I see in your Emolytics for <span style={{color: '#B0E0E6', fontWeight: 'bold'}}>{label?.toString()}</span>:</div>
          <div className="mb-1"><span style={{fontWeight: 'bold', color: '#B0E0E6'}}>Trigger:</span> {d.trigger || '—'}</div>
          <div className="mb-1"><span style={{fontWeight: 'bold', color: '#B0E0E6'}}>Reasoning:</span> {d.reasoning || '—'}</div>
          <div><span style={{fontWeight: 'bold', color: '#B0E0E6'}}>Intensity:</span> {d.intensity}</div>
        </div>
      </div>
    );
  }
  return null;
};

// Scroll reveal hook
function useScrollReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// Typing animation hook
function useTypingAnimation(fullText, speed = 18, onDone) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    let timeout;
    function type() {
      setDisplayed(fullText.slice(0, i));
      if (i < fullText.length) {
        timeout = setTimeout(() => {
          i++;
          type();
        }, speed);
      } else if (onDone) {
        onDone();
      }
    }
    type();
    return () => clearTimeout(timeout);
  }, [fullText, speed, onDone]);
  return displayed;
}

// Journal typing animation with typo correction
function useJournalTypingAnimation() {
  const [journalText, setJournalText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    const fullText = "Feeling grateful today. The morning walk really helped clear my mind. I noticed I was more patient with my team during the meeting. Small wins, but they matter.";
    
    let currentIndex = 0;
    let isBackspacing = false;
    let backspaceIndex = 0;
    let hasTypo = false;
    let hasBackspaced = false;
    
    const typeSpeed = 50;
    const backspaceSpeed = 30;
    
    const type = () => {
      if (!isBackspacing) {
        if (currentIndex < fullText.length) {
          let currentText = fullText.slice(0, currentIndex + 1);
          
          // Introduce a typo at "patient" -> "patinet" around word 65-70
          if (currentIndex >= 65 && currentIndex < 70 && !hasTypo) {
            currentText = fullText.slice(0, 65) + "patinet" + fullText.slice(71);
            hasTypo = true;
          }
          
          setJournalText(currentText);
          currentIndex++;
          
          // Start backspacing in the middle after typing "patinet"
          if (currentIndex === 72 && hasTypo && !hasBackspaced) {
            setTimeout(() => {
              isBackspacing = true;
              backspaceIndex = currentIndex;
              backspace();
            }, 800);
          } else {
            setTimeout(type, typeSpeed);
          }
        }
      }
    };
    
    const backspace = () => {
      if (backspaceIndex > 65) {
        let currentText = fullText.slice(0, backspaceIndex - 1);
        setJournalText(currentText);
        backspaceIndex--;
        setTimeout(backspace, backspaceSpeed);
      } else {
        // Continue typing from where we backspaced
        hasBackspaced = true;
        isBackspacing = false;
        currentIndex = backspaceIndex;
        setTimeout(type, 300);
      }
    };
    
    setIsTyping(true);
    type();
    
    return () => {
      setIsTyping(false);
    };
  }, []);
  
  return { journalText, isTyping };
}

// Emolytics Demo Component
const EmolyticsDemoComponent = () => {
  const { journalText, isTyping } = useJournalTypingAnimation();
  const [chartsRef, chartsVisible] = useScrollReveal(0.1);
  const [companionRef, companionVisible] = useScrollReveal(0.2);
  const [insightRef, insightVisible] = useScrollReveal(0.3);
  
  // Sequential loading: insights only appear after charts are fully loaded
  const [chartsFullyLoaded, setChartsFullyLoaded] = useState(false);
  
  useEffect(() => {
    if (chartsVisible) {
      // Wait for charts to "complete loading" before showing insights
      const timer = setTimeout(() => {
        setChartsFullyLoaded(true);
      }, 1500); // 1.5 second delay after charts become visible
      
      return () => clearTimeout(timer);
    }
  }, [chartsVisible]);

  // Chat companion text
  const evBubble1 = 'How are you feeling today?';
  const userBubble = 'I feel a bit anxious about my new job.';
  const evBubble2 = `I totally get that! New jobs can be really overwhelming. What's making you feel most anxious about it?`;

  // Insight typing animation
  const insightSegments = [
    'wow! you were really ',
    React.createElement('span', { key: 'joy', style: { color: emotionColors.Joy } }, 'joyful'),
    ' about that job offer, weren\'t you? and i can see you\'ve been feeling more ',
    React.createElement('span', { key: 'joy2', style: { color: emotionColors.Joy } }, 'happy'),
    ' about your morning walks too. when you do things that make you ',
    React.createElement('span', { key: 'joy3', style: { color: emotionColors.Joy } }, 'joyful'),
    ', it really shows in your energy!'
  ];

  const [insightTypedNodes, setInsightTypedNodes] = useState([]);
  const [insightDone, setInsightDone] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    // Only start typing animation when charts are fully loaded
    if (!chartsFullyLoaded) return;
    
    let i = 0;
    let j = 0;
    let current = [];
    let timeout;
    
    function type() {
      if (i >= insightSegments.length) {
        setInsightTypedNodes(current);
        setInsightDone(true);
        return;
      }
      const seg = insightSegments[i];
      if (typeof seg === 'string') {
        if (j < seg.length) {
          setInsightTypedNodes([...current, seg.slice(0, j + 1)]);
          j++;
          timeout = setTimeout(type, 18);
          return;
        } else {
          current = [...current, seg];
          i++;
          j = 0;
          timeout = setTimeout(type, 18);
          return;
        }
      } else {
        current = [...current, seg];
        setInsightTypedNodes(current);
        i++;
        j = 0;
        timeout = setTimeout(type, 18);
        return;
      }
    }
    
    // Start typing after a brief delay once charts are loaded
    const startDelay = setTimeout(type, 500);
    return () => {
      clearTimeout(timeout);
      clearTimeout(startDelay);
    };
  }, [chartsFullyLoaded]);

  useEffect(() => {
    if (insightDone) {
      setTimeout(() => setShowAvatar(true), 100);
    }
  }, [insightDone]);

  const feelingText = 'feeling amazing!';
  const feelingTyped = useTypingAnimation(feelingText, 22);

  return (
    <div className="mobile-container relative z-10">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="mobile-text-3xl sm:mobile-text-4xl md:mobile-text-5xl font-bold text-white mb-4 tracking-tight px-4">Experience Evolance</h2>
        <p className="mobile-text-responsive text-white/90 max-w-3xl mx-auto mb-8 sm:mb-10 mobile-leading-relaxed font-light px-4">
          See how Evolance will work — interactive previews of emotional analytics, AI conversations, and personalized insights.
        </p>
      </div>

      {/* AI Chat Companion */}
      <div ref={companionRef} className={`w-full flex flex-col items-center mb-8 sm:mb-12 mt-8 sm:mt-12 transition-all duration-700 ease-out ${companionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] sm:w-[60vw] h-[40vw] sm:h-[32vw] max-w-4xl max-h-96 rounded-3xl blur-3xl z-0" style={{pointerEvents:'none', background: 'linear-gradient(135deg, #2A7B9B20, #87CEEB15, #B0E0E610)'}}></div>
        <div className="w-full flex justify-center relative z-10">
          <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-4 sm:gap-6 lg:gap-8 xl:gap-12 px-2 sm:px-4">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 animate-fade-in-up drop-shadow-glow" style={{color: '#87CEEB'}}>meet ev!</h3>
              <p className="text-xs sm:text-sm lg:text-base text-white/80 max-w-xs">Your AI companion for emotional growth</p>
            </div>
            
            <div className="flex-1 flex flex-col gap-4 sm:gap-6 lg:gap-8 items-center">
              <div className="flex w-full fade-in-bubble-1">
                <div className="flex-shrink-0 mr-2 sm:mr-3 lg:mr-5"><EvIcon size={28} /></div>
                <div className="px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-3xl text-white/80 mobile-text-responsive text-center max-w-2xl font-light shadow-xl animate-float-bubble-1 backdrop-blur-md border border-white/20 fade-in-bubble-1 mobile-card-compact" style={{backgroundColor: '#2A7B9B80'}}>
                  {evBubble1}
                </div>
              </div>
              <div className="flex w-full justify-end fade-in-bubble-2">
                <div className="px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-3xl bg-white/20 text-white/80 mobile-text-responsive text-center max-w-2xl font-light border border-white/20 shadow-xl animate-float-bubble-2 backdrop-blur-md bg-opacity-60 fade-in-bubble-2 mobile-card-compact">
                  {userBubble}
                </div>
                <UserAvatar size={32} className="ml-2 sm:ml-3 lg:ml-5" />
              </div>
              <div className="flex w-full fade-in-bubble-3">
                <div className="flex-shrink-0 mr-2 sm:mr-3 lg:mr-5"><EvIcon size={28} /></div>
                <div className="px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-3xl text-white/80 mobile-text-responsive text-center max-w-2xl font-light shadow-xl animate-float-bubble-3 backdrop-blur-md border border-white/20 fade-in-bubble-3 mobile-card-compact" style={{backgroundColor: '#2A7B9B80'}}>
                  {evBubble2}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journal Space */}
      <div className="w-full flex flex-col items-center mb-6 sm:mb-8 mt-6 sm:mt-8">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] sm:w-[60vw] h-[40vw] sm:h-[32vw] max-w-4xl max-h-96 rounded-3xl blur-3xl z-0" style={{pointerEvents:'none', background: 'linear-gradient(135deg, #8B5CF620, #A78BFA15, #C084FC10)'}}></div>
        <div className="w-full flex justify-center relative z-10">
          <div className="w-full max-w-full flex flex-col md:flex-row items-center gap-4 sm:gap-6 lg:gap-8 xl:gap-12 px-2 sm:px-4">
            <div className="flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2">
              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 animate-fade-in-up drop-shadow-glow" style={{color: '#87CEEB'}}>how was your day?</h3>
              <p className="text-xs sm:text-sm lg:text-base text-white/80 max-w-xs">Reflect and grow with ambient mood settings</p>
            </div>
            
            <div className="flex-[4] order-2 md:order-1">
              <div className="w-full backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-white/20 shadow-xl animate-ethereal-rgb mobile-card">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" />
                    </div>
                    <span className="text-white/90 mobile-text-sm font-medium">Today's Reflection</span>
                  </div>
                  <span className="text-white/60 mobile-text-xs">2 hours ago</span>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white/80 mobile-text-sm mobile-leading-relaxed">
                        "{journalText}{isTyping && <span className="animate-pulse">|</span>}"
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4">
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 mobile-text-xs border border-green-500/30">Grateful</span>
                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 mobile-text-xs border border-blue-500/30">Calm</span>
                        <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 mobile-text-xs border border-purple-500/30">Focused</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 ml-2 sm:ml-4">
                      <div className="text-center">
                        <p className="mobile-text-xs font-medium text-purple-300">Weightless</p>
                        <p className="mobile-text-xs text-purple-400/70">Marconi Union</p>
                      </div>
                      
                      <div className="flex items-end gap-0.5 h-3 sm:h-4">
                        <div className="w-0.5 bg-purple-400 rounded-full music-bar" style={{height: '4px', animationDelay: '0ms'}}></div>
                        <div className="w-0.5 bg-purple-400 rounded-full music-bar" style={{height: '6px', animationDelay: '150ms'}}></div>
                        <div className="w-0.5 bg-purple-400 rounded-full music-bar" style={{height: '8px', animationDelay: '300ms'}}></div>
                        <div className="w-0.5 bg-purple-400 rounded-full music-bar" style={{height: '5px', animationDelay: '450ms'}}></div>
                        <div className="w-0.5 bg-purple-400 rounded-full music-bar" style={{height: '7px', animationDelay: '600ms'}}></div>
                        <div className="w-0.5 bg-purple-400 rounded-full music-bar" style={{height: '4px', animationDelay: '750ms'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transition Section */}
      <div className="flex flex-col items-center mb-8 sm:mb-12 px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor: '#2A7B9B'}}>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold drop-shadow-glow font-display" style={{color: '#87CEEB'}}>ev then generates your emolytics</span>
        </div>
        <div className="mt-2 text-white/80 text-base sm:text-lg text-center max-w-2xl font-light">Preview how your emotional data will transform into beautiful, interactive analytics—personalized just for you.</div>
      </div>

      {/* Unified Trend Graphs & Emotional Avatar */}
      <div className="w-full flex flex-col items-center mb-6 sm:mb-8 mt-6 sm:mt-8">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] sm:w-[60vw] h-[40vw] sm:h-[32vw] max-w-4xl max-h-96 rounded-3xl blur-3xl z-0" style={{pointerEvents:'none', background: 'linear-gradient(135deg, #2A7B9B20, #87CEEB15, #B0E0E610)'}}></div>
        <div className="w-full flex justify-center relative z-10">
          <div className="w-full max-w-7xl flex flex-col lg:flex-row items-start gap-8 sm:gap-12 px-4">
            
            <div className="flex-1 lg:flex-[2]">
              <div className="mb-6 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up drop-shadow-glow" style={{color: '#87CEEB'}}>your emotional trends</h3>
                <p className="text-white/80 text-base sm:text-lg">Preview of analytics & patterns</p>
              </div>
              
              <div ref={chartsRef} className={`grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 transition-all duration-700 ease-out ${chartsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {Object.keys(emotionData).slice(0, 4).map((emotion) => (
                  <div key={emotion} className="bg-white/5 rounded-2xl p-4 sm:p-6 flex flex-col items-center shadow border border-white/10 touch-manipulation">
                    <h3 className="text-base sm:text-lg font-bold mb-3 text-white">{emotion}</h3>
                    <ResponsiveContainer width="100%" height={120} className="sm:h-[140px]">
                      <LineChart data={emotionData[emotion]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip 
                          content={(props) => <EmolyticsTooltip {...props} />} 
                          allowEscapeViewBox={{ x: true, y: true }}
                          wrapperStyle={{ pointerEvents: 'none', background: 'rgba(30,41,59,0.92)', boxShadow: '0 8px 32px 0 rgba(56,189,248,0.18)', borderRadius: '1rem', border: '1px solid #60a5fa', zIndex: 50 }}
                          offset={30}
                        />
                        <Line type="monotone" dataKey="intensity" stroke={emotionColors[emotion]} strokeWidth={3} dot={false} />
                        <Brush 
                          dataKey="date" 
                          height={25} 
                          stroke={emotionColors[emotion]}
                          fill={emotionColors[emotion] + '20'}
                          strokeWidth={2}
                          gap={10}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1 lg:max-w-sm">
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up drop-shadow-glow" style={{color: '#87CEEB'}}>Your Reflective Insights!</h3>
                <p className="text-white/80 text-base sm:text-lg">AI-powered emotional insights</p>
              </div>
              
              <div ref={insightRef} className={`transition-all duration-700 ease-out ${insightVisible && chartsFullyLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex items-center gap-3 sm:gap-5 mb-6">
                  <div className="flex-shrink-0 flex items-center justify-center"><EvIcon size={36} /></div>
                  <div className="text-white/80 text-base sm:text-lg text-center lg:text-left max-w-xl font-light">
                    {insightTypedNodes}
                  </div>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <UserAvatar 
                    size={112}
                    className={`mb-4 transition-all duration-700 ease-out ${showAvatar ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                  />
                  <div className="text-white/80 text-base sm:text-lg text-center lg:text-left">
                    {insightDone ? (
                      <span>
                        {feelingTyped}
                        {feelingTyped.length < feelingText.length && <span className="typing-cursor">|</span>}
                      </span>
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="text-center mb-4 sm:mb-6 px-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
          Starting with <span style={{color: '#87CEEB'}}>Emolytics</span> for emotional trends
        </h3>
        <p className="text-base sm:text-lg text-white/90 mb-4 leading-relaxed max-w-4xl mx-auto">
          We're building a comprehensive platform for <span style={{fontWeight: 'bold', color: '#87CEEB'}}>all age groups</span> - from kids to elderly - helping everyone grow emotionally through innovative, age-appropriate approaches.
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Kids</span>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Teens</span>
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">Adults</span>
          <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">Elderly</span>
        </div>
      </div>
    </div>
  );
};

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('nav')) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

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
        {/* Seamless linear gradient that flows to next section */}
        <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.9" />
          <stop offset="20%" stopColor="#8B5CF6" stopOpacity="0.7" />
          <stop offset="40%" stopColor="#6366F1" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#EC4899" stopOpacity="0.4" />
          <stop offset="80%" stopColor="#16213e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#16213e" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Seamless background that matches next section */}
      <rect width="100%" height="100%" fill="url(#cosmicGradient)" />
      
      {/* Floating constellation points */}
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
      
      {/* Additional stars closer to bottom for better transition */}
      <circle cx="400" cy="650" r="1.5" fill="#8B5CF6" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="900" cy="700" r="1" fill="#EC4899" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4.5s" repeatCount="indefinite" />
      </circle>
      
      {/* More scattered twinkling stars */}
      <circle cx="150" cy="300" r="1" fill="#A78BFA" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="750" cy="150" r="1.2" fill="#F472B6" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.7;0.1" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="450" cy="80" r="0.8" fill="#38BDF8" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="950" cy="400" r="1.3" fill="#C084FC" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="600" r="0.9" fill="#F59E0B" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.9;0.1" dur="3.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="680" cy="450" r="1.1" fill="#10B981" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.9s" repeatCount="indefinite" />
      </circle>
      <circle cx="320" cy="220" r="0.7" fill="#8B5CF6" opacity="0.8" filter="url(#glow)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="850" cy="350" r="1.4" fill="#EC4899" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="550" cy="550" r="0.8" fill="#A78BFA" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="250" cy="400" r="1.2" fill="#38BDF8" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="720" cy="600" r="0.9" fill="#F472B6" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.8;0.1" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="180" r="1.0" fill="#C084FC" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="480" cy="320" r="0.6" fill="#F59E0B" opacity="0.8" filter="url(#glow)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="820" cy="520" r="1.1" fill="#10B981" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3.9s" repeatCount="indefinite" />
      </circle>
      <circle cx="380" cy="150" r="0.8" fill="#8B5CF6" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="650" cy="280" r="1.3" fill="#EC4899" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.3s" repeatCount="indefinite" />
      </circle>
      
      {/* Fill the entire screen with more twinkling stars */}
      <circle cx="80" cy="120" r="0.5" fill="#A78BFA" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="920" cy="80" r="0.7" fill="#F472B6" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="160" cy="420" r="0.6" fill="#38BDF8" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="1080" cy="250" r="0.8" fill="#C084FC" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="480" r="0.4" fill="#F59E0B" opacity="0.8" filter="url(#glow)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="1150" cy="180" r="0.9" fill="#10B981" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.5;0.1" dur="4.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="220" cy="80" r="0.5" fill="#8B5CF6" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="980" cy="460" r="0.7" fill="#EC4899" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.7;0.1" dur="3.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="320" r="0.6" fill="#A78BFA" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="1100" cy="380" r="0.8" fill="#F472B6" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="520" r="0.5" fill="#38BDF8" opacity="0.8" filter="url(#glow)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="780" cy="40" r="0.7" fill="#C084FC" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.8;0.1" dur="3.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="680" r="0.6" fill="#F59E0B" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.9s" repeatCount="indefinite" />
      </circle>
      <circle cx="1020" cy="600" r="0.8" fill="#10B981" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="140" r="0.5" fill="#8B5CF6" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="880" cy="240" r="0.7" fill="#EC4899" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="560" r="0.6" fill="#A78BFA" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="1140" cy="120" r="0.8" fill="#F472B6" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.5;0.1" dur="4.0s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="240" r="0.5" fill="#38BDF8" opacity="0.8" filter="url(#glow)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.0s" repeatCount="indefinite" />
      </circle>
      <circle cx="760" cy="580" r="0.7" fill="#C084FC" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="420" cy="40" r="0.6" fill="#F59E0B" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="1060" cy="320" r="0.8" fill="#10B981" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3.9s" repeatCount="indefinite" />
      </circle>
      <circle cx="240" cy="360" r="0.5" fill="#8B5CF6" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="840" cy="420" r="0.7" fill="#EC4899" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="140" cy="160" r="0.6" fill="#A78BFA" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="960" cy="180" r="0.8" fill="#F472B6" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="580" r="0.5" fill="#38BDF8" opacity="0.8" filter="url(#glow)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="1180" cy="440" r="0.7" fill="#C084FC" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="360" cy="620" r="0.6" fill="#F59E0B" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.9s" repeatCount="indefinite" />
      </circle>
      <circle cx="520" cy="120" r="0.8" fill="#10B981" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.5;0.1" dur="4.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="640" r="0.5" fill="#8B5CF6" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="900" cy="160" r="0.7" fill="#EC4899" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="360" r="0.6" fill="#A78BFA" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="1120" cy="560" r="0.8" fill="#F472B6" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3.8s" repeatCount="indefinite" />
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

      {/* Modern Navigation */}
      <nav
        className={`fixed top-6 left-4 right-4 z-30
          ${showNavbar ? 'navbar-show' : 'navbar-hide'}
        `}
        onMouseEnter={() => setShowNavbar(true)}
      >
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center h-14 px-6">
            {/* Logo Section */}
            <div className="flex items-center">
              <a href="#" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img 
                    src="/logo.png" 
                    alt="Evolance Logo" 
                    className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Evolance
                </span>
              </a>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <a href="#features" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium">
                Features
              </a>
              <a href="#testimonials" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium">
                Stories
              </a>
              <a href="#faq" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium">
                FAQ
              </a>
              
              {/* CTA Link */}
                <button 
                  onClick={scrollToWaitlist}
                className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-300 hover:to-indigo-300 hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center"
                >
                <span className="leading-none">Join Waitlist</span>
                </button>
              </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 mx-4">
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <div className="py-4 space-y-2">
                  <a 
                    href="#features" 
                    className="block px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#testimonials" 
                    className="block px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Stories
                  </a>
                  <a 
                    href="#faq" 
                    className="block px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </a>
                  <button 
                    onClick={() => {
                      scrollToWaitlist();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-6 py-3 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-300 hover:to-indigo-300 hover:bg-white/5 transition-all duration-300 text-base font-medium"
                  >
                    Join Waitlist
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <CosmicBackground />
        
        <div className="relative z-20 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Logo Animation */}
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            

            {/* Animated Logo */}
            <div className="mb-8 transform transition-all duration-1000 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6">
                <img 
                  src="/logo.png" 
                  alt="Evolance" 
                  className="w-full h-full object-contain opacity-0 animate-fade-in transform scale-75 hover:scale-110 transition-all duration-700"
                  style={{ 
                    animationDelay: '1s', 
                    animationFillMode: 'both'
                  }}
                />
              </div>
            </div>

            {/* Evolance Text */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent tracking-wide">
                Evolance
            </h1>
              <p className="text-xl md:text-2xl text-white/70 font-light tracking-wider">
                First AI Platform for Human Being's Emotional Intelligence
              </p>
            </div>

            {/* Aristotle Quote */}
            <div className="mb-8">
              <blockquote className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed font-light italic mb-4 animate-fade-in tracking-wide" style={{ 
                animationDelay: '2s', 
                animationFillMode: 'both',
                fontFamily: 'Georgia, "Times New Roman", serif',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
                <span className="animate-fade-in" style={{ animationDelay: '2.2s', animationFillMode: 'both' }}>
                  "Knowing yourself is the beginning of all wisdom."
                </span>
              </blockquote>
              <p className="text-base md:text-lg text-white/70 font-normal tracking-wider animate-fade-in transform translate-y-4 opacity-0" style={{ 
                animationDelay: '3s', 
                animationFillMode: 'both',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic'
              }}>
                — Aristotle
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '2.5s', animationFillMode: 'both' }}>
              <button 
                onClick={scrollToWaitlist}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg text-base font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Join Waitlist
              </button>
              
              <a 
                href="#features"
                className="text-white/80 hover:text-white px-8 py-3 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm text-base font-medium cursor-pointer scroll-smooth"
              >
                Learn More
              </a>
            </div>
                </div>
              </div>
      </section>

      {/* Experience Evolance - Interactive Demo Section */}
      <section id="features" className="relative overflow-hidden mobile-section-padding">
        {/* Seamless gradient background that continues from hero */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(135deg, 
              #16213e 0%,
              #1a1a3a 15%,
              #1e1e42 30%,
              #252550 50%,
              #2d2d5a 70%,
              #363663 85%,
              #4c1d95 100%
            )
          `
        }}></div>
        
        {/* Floating ethereal orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-20" style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #ec4899 50%, transparent 70%)'
          }}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl opacity-15" style={{
            background: 'radial-gradient(circle, #06b6d4 0%, #8b5cf6 50%, transparent 70%)'
          }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10" style={{
            background: 'radial-gradient(circle, #f472b6 0%, #a78bfa 50%, transparent 70%)'
          }}></div>
              </div>
              
        <div className="py-12 sm:py-16">
          <EmolyticsDemoComponent />
        </div>
      </section>



      {/* Testimonials Section - Seamless continuation */}
      <section id="testimonials" className="relative overflow-hidden">
        {/* Mixed gradient from Hero + Features sections */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(135deg, 
              #2d2d5a 0%,
              #363663 15%,
              #4c1d95 30%,
              #6366F1 45%,
              #8B5CF6 60%,
              #EC4899 75%,
              #1E1B4B 90%,
              #16213e 100%
            )
          `
        }}></div>
        
        {/* Logo watermark in background */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-5">
          <img src="/logo.png" alt="Evolance" className="w-full h-full object-contain filter brightness-0 invert" />
          </div>

        {/* Ethereal ambient elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 left-16 w-80 h-80 rounded-full blur-3xl opacity-15" style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #ec4899 50%, transparent 70%)'
          }}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-10" style={{
            background: 'radial-gradient(circle, #06b6d4 0%, #a855f7 50%, transparent 70%)'
          }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-8" style={{
            background: 'radial-gradient(circle, #f472b6 0%, #c084fc 50%, transparent 70%)'
          }}></div>
              </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Integrated logo and title */}
          <div className="text-center mb-12 relative">
            <div className="flex items-center justify-center mb-6">
              <img src="/logo.png" alt="Evolance" className="w-12 h-12 mr-4 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Why People Joined Our Waitlist
              </h2>
            </div>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              Real experiences from people who joined the Evolance waitlist after learning about our platform
              </p>
            </div>

          {/* Scattered, realistic testimonials */}
          <div className="relative max-w-6xl mx-auto h-[850px] overflow-hidden">
            {[
              {
                name: "Moushumi",
                role: "Psychology Professor",
                content: "The Emolytics feature completely blew my mind! As someone who studies emotions for a living, seeing real-time emotional analytics visualized this way... it's exactly what I've been hoping someone would build.",
                initials: "MR",
                position: "top-0 left-0",
                rotation: "-rotate-2",
                size: "w-72"
              },
              {
                name: "Sanchita",
                role: "Marketing Manager",
                content: "I've always been terrible at understanding my own emotions, let alone managing them. When I saw the demo, I literally got goosebumps thinking about how this could help me finally make sense of my feelings.",
                initials: "SB",
                position: "top-16 right-8",
                rotation: "rotate-1",
                size: "w-80"
              },
              {
                name: "Rosemary",
                role: "Nurse",
                content: "Working in healthcare is emotionally draining. The way Evolance approaches emotional intelligence through data and patterns... it feels like exactly what I need to take better care of myself while caring for others.",
                initials: "RK",
                position: "top-64 left-16",
                rotation: "rotate-3",
                size: "w-84"
              },
              {
                name: "Kyle",
                role: "Fitness Trainer",
                content: "Honestly, I never thought about tracking emotions like I track workouts. But the Emolytics concept makes so much sense - if you can measure it, you can improve it, right?",
                initials: "KM",
                position: "top-80 right-0",
                rotation: "-rotate-1",
                size: "w-76"
              },
              {
                name: "Shubhodeep",
                role: "Software Engineer",
                content: "The technical approach to emotional intelligence is fascinating. I'm a data person, so seeing emotions presented as analyzable patterns and trends... that actually resonates with how my brain works.",
                initials: "SD",
                position: "top-[400px] left-32",
                rotation: "rotate-2",
                size: "w-80"
              },
              {
                name: "Austin",
                role: "Musician",
                content: "Music is all about emotion, but I've never been good at processing my own feelings. When I heard about this platform, especially the AI companion part, I thought... maybe this could help me understand myself better.",
                initials: "AC",
                position: "top-[480px] right-16",
                rotation: "-rotate-3",
                size: "w-72"
              },
              {
                name: "Jennifer",
                role: "Teacher",
                content: "Managing a classroom full of kids requires emotional intelligence I sometimes feel I lack. The Emolytics dashboard showed me patterns in my stress I never noticed before - it was like seeing myself clearly for the first time.",
                initials: "JW",
                position: "top-[520px] left-8",
                rotation: "rotate-1",
                size: "w-78"
              },
              {
                name: "Kayla",
                role: "Social Worker",
                content: "I spend all day helping others with their emotional challenges, but I'm terrible at managing my own. The self-reflection approach this platform takes feels different from anything I've tried before.",
                initials: "KT",
                position: "top-[560px] right-24",
                rotation: "-rotate-2",
                size: "w-74"
              },
              {
                name: "Carla",
                role: "Entrepreneur",
                content: "Running a startup is an emotional rollercoaster. When I saw how Emolytics could help me track and understand my emotional patterns, I knew this could be a game-changer for my mental health and decision-making.",
                initials: "CN",
                position: "top-[600px] left-40",
                rotation: "rotate-2",
                size: "w-76"
              },
              {
                name: "Meghna",
                role: "UX Designer",
                content: "As a designer, I'm always thinking about user emotions, but I rarely pay attention to my own. The way this platform visualizes emotional data is both beautiful and insightful - it's like design meets psychology.",
                initials: "MK",
                position: "top-[640px] right-8",
                rotation: "-rotate-1",
                size: "w-78"
              },
              {
                name: "Arsh",
                role: "Medical Student",
                content: "Med school is incredibly stressful, and I've been looking for ways to better understand my mental health. The Emolytics approach feels so much more scientific and actionable than traditional mood tracking apps.",
                initials: "AP",
                position: "top-[680px] left-16",
                rotation: "rotate-3",
                size: "w-74"
              },
              {
                name: "Sam",
                role: "Content Creator",
                content: "Creating content means constantly dealing with rejection and criticism. I need something that helps me process those emotions better. This platform seems like it could actually help me build emotional resilience.",
                initials: "SK",
                position: "top-[720px] right-32",
                rotation: "-rotate-2",
                size: "w-80"
              },
              {
                name: "Krish",
                role: "Data Analyst",
                content: "I analyze data for a living, so when I saw Emolytics turning emotions into actual analyzable data... that's when I knew this wasn't just another wellness app. This is something I can actually work with.",
                initials: "KG",
                position: "top-[760px] left-24",
                rotation: "rotate-1",
                size: "w-76"
              }
            ].map((testimonial, index) => {
              const [isModalOpen, setIsModalOpen] = useState(false);
              
              return (
                <div key={index}>
                  {/* Testimonial Card */}
                  <div
                    className={`absolute ${testimonial.position} ${testimonial.size} bg-white/8 backdrop-blur-lg rounded-2xl p-6 border border-white/15 transition-all duration-500 shadow-lg opacity-0 animate-fade-in-up cursor-pointer hover:scale-105 hover:bg-white/12 hover:border-purple-400/40`}
                    style={{
                      animationDelay: `${index * 0.3}s`,
                      animationFillMode: 'both',
                      transform: `${testimonial.rotation === 'rotate-1' ? 'rotate(1deg)' : testimonial.rotation === 'rotate-2' ? 'rotate(2deg)' : testimonial.rotation === 'rotate-3' ? 'rotate(3deg)' : testimonial.rotation === '-rotate-1' ? 'rotate(-1deg)' : testimonial.rotation === '-rotate-2' ? 'rotate(-2deg)' : 'rotate(-3deg)'}`
                    }}
                    onClick={() => setIsModalOpen(true)}
                  >
                                                    {/* Card content */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                        <span className="text-white font-semibold text-xs">{testimonial.initials}</span>
                  </div>
                  <div>
                        <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                        <p className="text-purple-300 text-xs">{testimonial.role}</p>
                  </div>
                </div>
                    <p className="text-white/70 leading-relaxed text-xs">"{testimonial.content.substring(0, 60)}..."</p>
              </div>

                  {/* Modal */}
                  {isModalOpen && (
                    <div 
                      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500"
                      onClick={() => setIsModalOpen(false)}
                    >
                      {/* Popup card */}
                      <div 
                        className="relative w-96 max-w-[90vw] mx-4 transform scale-100 transition-all duration-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Elegant backdrop with blur */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-purple-600/25 to-pink-600/25 backdrop-blur-xl rounded-3xl border border-purple-400/50 shadow-2xl"></div>
                        
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-3xl blur-lg"></div>
                        
                        {/* Content */}
                        <div className="relative p-8 flex flex-col justify-between min-h-[320px]">
                          {/* Close hint */}
                          <div className="absolute top-4 right-4 text-white/50 text-xs">
                            <span>Click anywhere to close</span>
                          </div>
                          
                          <div>
                            <div className="flex items-center mb-6 mt-4">
                              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4 shadow-lg ring-2 ring-white/30">
                                <span className="text-white font-bold text-base">{testimonial.initials}</span>
                              </div>
                              <div>
                                <h4 className="text-white font-bold text-xl mb-1">{testimonial.name}</h4>
                                <p className="text-purple-300 text-base font-medium">{testimonial.role}</p>
                              </div>
                            </div>
                            
                            <blockquote className="text-white/95 leading-relaxed text-lg font-light italic relative">
                              <span className="absolute -top-3 -left-3 text-purple-400/60 text-5xl font-serif">"</span>
                              <span className="relative z-10 block pt-4 pb-6 px-4">{testimonial.content}</span>
                              <span className="absolute -bottom-5 -right-3 text-purple-400/60 text-5xl font-serif">"</span>
                            </blockquote>
                          </div>
                          
                          {/* Elegant bottom accent */}
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
                            <div className="flex space-x-1">
                              <div className="w-3 h-3 bg-purple-400 rounded-full opacity-70"></div>
                              <div className="w-3 h-3 bg-pink-400 rounded-full opacity-50"></div>
                              <div className="w-3 h-3 bg-blue-400 rounded-full opacity-30"></div>
                            </div>
                            <span className="text-purple-300/80 text-sm font-medium tracking-wider">Real story</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section - Seamless continuation */}
      <section id="faq" className="relative overflow-hidden">
        {/* Seamless gradient flowing from testimonials */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(135deg, 
              #a855f7 0%,
              #9333ea 25%,
              #7c3aed 50%,
              #6d28d9 75%,
              #5b21b6 100%
            )
          `
        }}></div>
        
        {/* Logo watermark */}
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 opacity-5">
          <img src="/logo.png" alt="Evolance" className="w-full h-full object-contain filter brightness-0 invert" />
        </div>
        
        {/* Floating ethereal elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 right-16 w-72 h-72 rounded-full blur-3xl opacity-12" style={{
            background: 'radial-gradient(circle, #06b6d4 0%, #3b82f6 50%, transparent 70%)'
          }}></div>
          <div className="absolute bottom-20 left-20 w-88 h-88 rounded-full blur-3xl opacity-10" style={{
            background: 'radial-gradient(circle, #ec4899 0%, #f472b6 50%, transparent 70%)'
          }}></div>
          <div className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-8" style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #c084fc 50%, transparent 70%)'
          }}></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Integrated logo and title */}
          <div className="text-center mb-12 relative">
            <div className="flex items-center justify-center mb-6">
              <img src="/logo.png" alt="Evolance" className="w-12 h-12 mr-4 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h2>
            </div>
            <p className="text-lg text-white/80 leading-relaxed">Everything you need to know about your journey at Evolance</p>
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
                answer: "Evolance offers a unique blend of personalized AI guidance for emotional health, and community support. We focus on deep transformation rather than surface-level wellness, providing tools for genuine inner contentment evolution. Our platform includes the Emolytics Dashboard for emotional tracking, AI Companion for 24/7 support, Reflective Insights for life choices, Emotional Fingerprint for personal patterns, and Privacy-First Design for complete data security."
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

      {/* Waitlist Section - Seamless continuation */}
      <section id="waitlist" className="relative overflow-hidden">
        {/* Seamless gradient flowing from FAQ */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(135deg, 
              #5b21b6 0%,
              #4c1d95 25%,
              #3730a3 50%,
              #312e81 75%,
              #1e1b4b 100%
            )
          `
        }}></div>
        
        {/* Central logo watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-5">
          <img src="/logo.png" alt="Evolance" className="w-full h-full object-contain filter brightness-0 invert" />
        </div>
        
        {/* Ethereal floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-80 h-80 rounded-full blur-3xl opacity-15" style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #ec4899 50%, transparent 70%)'
          }}></div>
          <div className="absolute bottom-16 right-16 w-96 h-96 rounded-full blur-3xl opacity-10" style={{
            background: 'radial-gradient(circle, #06b6d4 0%, #3b82f6 50%, transparent 70%)'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Animated Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <img src="/logo.png" alt="Evolance" className="w-16 h-16 mx-auto opacity-90 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl"></div>
              </div>
            </div>
            
            {/* Title with gradient text */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Ready to Elevate Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Emotional Intelligence?
              </span>
          </h2>
            
            {/* Daniel Goleman Quote */}
            <div className="mb-8 max-w-4xl mx-auto text-center">
              <blockquote className="text-lg md:text-xl text-white/90 leading-relaxed font-light italic mb-6 relative">
                <span className="absolute -top-3 -left-3 text-purple-400/60 text-5xl font-serif">"</span>
                <span className="relative z-10">
                  Emotional self‑awareness is the building block of the next fundamental emotional intelligence: being able to shake off a bad mood.
                </span>
                <span className="absolute -bottom-5 -right-3 text-purple-400/60 text-5xl font-serif">"</span>
              </blockquote>
              
              <div className="mb-4">
                <p className="text-white/80 font-semibold text-base">— Daniel Goleman</p>
                <p className="text-purple-300/80 text-sm">Leading voice on emotional intelligence</p>
              </div>
            </div>
          </div>

          {/* Enhanced Form Container */}
          <div className="max-w-lg mx-auto">
            {isWaitlistSubmitted ? (
              <div className="relative">
                {/* Success card with enhanced design */}
                <div className="relative bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-3xl p-8 shadow-2xl">
                  {/* Animated success icon */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center mb-4 animate-bounce">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Welcome to the Journey!</h3>
                    <p className="text-emerald-300 text-lg mb-3">You're officially on our waitlist ✨</p>
                  </div>
                  
                  {/* Member info with style */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">#{waitlistCount}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Waitlist Member</p>
                          <p className="text-white/60 text-sm">Check your email for updates</p>
                        </div>
                      </div>
                      <div className="text-2xl">🎉</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Enhanced form with premium design */}
                <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  {/* Form header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Join Waitlist</h3>
                    <p className="text-white/70">Make an intentional decision to grow yourself</p>
                  </div>

                  {/* Enhanced error display */}
                {submitError && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/40 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <div className="text-red-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <p className="text-red-300 text-sm font-medium">{submitError}</p>
                      </div>
                  </div>
                )}
                
                  <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                    {/* Enhanced input fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                          className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 group-hover:border-white/30"
                  />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      <div className="relative group">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                          className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 group-hover:border-white/30"
                  />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                </div>
                
                    <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                        className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 group-hover:border-white/30"
                  />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                    {/* Enhanced button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                      className="relative w-full group overflow-hidden rounded-2xl"
                >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 transition-all duration-300 group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-indigo-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative px-8 py-4 text-white font-semibold text-lg transition-all duration-300 group-hover:scale-105 group-disabled:scale-100 disabled:opacity-50">
                  {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="relative">
                              <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                            </div>
                            <span>Joining the future...</span>
                    </div>
                  ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <span>Submit</span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                </button>
                

              </form>
                </div>
              </div>
            )}
          </div>
          <div className="mt-20 flex justify-center">
            <span className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 border border-purple-400/30 text-base font-medium shadow-sm backdrop-blur-sm animated-gradient-text">
              First 100 members get one month free access to our Pro Plan!
            </span>
          </div>
        </div>
      </section>

      {/* Footer - Seamless continuation */}
      <footer className="relative overflow-hidden">
        {/* Seamless gradient flowing from waitlist */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(135deg, 
              #1e1b4b 0%,
              #1e293b 50%,
              #0f172a 100%
            )
          `
        }}></div>
        
        <div className="relative z-10 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <img src="/logo.png" alt="Evolance" className="w-8 h-8 mr-3 opacity-80" />
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Evolance
                </div>
              </div>
              <p className="text-white/70 mb-6 max-w-md text-sm">
                Unlock your emotional intelligence through AI-powered analytics, reflective insights, and personalized emotional support.
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
        </div>
      </footer>
    </div>
  );
};

export default App;