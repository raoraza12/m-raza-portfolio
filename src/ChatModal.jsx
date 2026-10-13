import React, { useState, useEffect, useRef } from 'react';
import './ChatModal.css';
import razaImg from './assets/raza_hero.png';

const INITIAL_MESSAGES = [
  {
    id: 'm-1',
    sender: 'bot',
    text: "Salam! 👋 Main M Raza Rajput ka AI Portfolio Representative hoon. Main yahan Raza Rajput ki profile, unke full-stack expertise, aur featured projects ke baray me guide karne ke liye integrate kiya gaya hoon. Aap Raza ke baray me kya jaanna chahte hain?",
    time: 'Just now',
  },
];

const QUICK_PILLS = [
  { label: '👤 Raza Rajput kon hain?', query: 'Raza Rajput ke baray me batao' },
  { label: '🚀 Featured Projects', query: 'Raza ke featured projects kon se hain?' },
  { label: '⚡ Core Tech Stack', query: 'Raza ka tech stack aur skills kya hain?' },
  { label: '📧 Raza se rabta kaise karein?', query: 'Raza se rabta kaise karein?' },
];

const STORAGE_KEY = 'raza_visitor_chat_history';

export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}
    return INITIAL_MESSAGES;
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync each conversation update to this device's private localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (_) {}
  }, [messages]);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    setMessages(INITIAL_MESSAGES);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      // Freeze Lenis background scroll while chat modal is open
      if (window.__lenis) {
        window.__lenis.stop();
      }
      setTimeout(() => inputRef.current?.focus(), 250);
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      // Resume Lenis smooth scroll when chat modal closes
      if (window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const generateReply = (userText) => {
    const text = userText.trim();
    const lower = text.toLowerCase();

    // 0. Build / Code inquiries — clarify that Raza builds projects, agent is for representation
    if (/\b(build|make|create|code|banao|banado|program|write code|kuch banao)\b/i.test(lower)) {
      return {
        text: "Main Raza Rajput ka portfolio AI assistant hoon — main khud code ya software generate nahi karta! Software, modern web platforms aur AI systems Raza Rajput khud build karte hain. Main yahan sirf Raza ke credentials aur projects ko represent karne ke liye hoon. Agar aap Raza ke saath project discuss karna chahte hain to unhe direct email (raoraza5417@gmail.com) bhej sakte hain!",
        showEmailAction: true,
      };
    }

    // 1. Salam & Islamic Greetings
    if (/\b(salam|assalam|aslam|slam|aoa|assalamualaikum|assalam[ -]?o[ -]?alaikum|asalamu[ -]?alaikum)\b/i.test(lower)) {
      return {
        text: "Walaikum Assalam! 👋 Khush aamdeed! Main M Raza Rajput ka AI Portfolio Representative hoon. Main yahan Raza ki profile, tech stack, aur unke featured projects ke baray me information dene ke liye hoon. Aap Raza ke baray me kya poochna chahte hain?",
        showEmailAction: false,
      };
    }

    // 2. Casual English Greetings & "Wassup"
    if (/\b(wassup|wazzup|what'?s up|sup|yo|hey|heyy|heyyy|hi|hello|hiya|howdy)\b/i.test(lower)) {
      return {
        text: "Hey! 🙌 Main M Raza Rajput ka portfolio assistant hoon. Main yahan Raza ke projects aur expertise ko represent karta hoon. Aap Raza ke baray me kya jaanna chahte hain?",
        showEmailAction: false,
      };
    }

    // 3. Inquiries on well-being / "How are you"
    if (/\b(how are you|how r u|kese ho|kaise ho|kya haal|kya hal|sub theek|sab theek|sab kaisa)\b/i.test(lower)) {
      return {
        text: "Alhamdulillah, bilkul zabardast! 🚀 Raza ke projects aur portfolio ready hain. Aap sunayein, Raza ke kis project ya experience ke baray me baat karni hai?",
        showEmailAction: false,
      };
    }

    // 4. Who is Raza / Identity & Bio
    if (/\b(who are you|who is raza|raza kon hai|kon ho|about raza|introduce|introduction|tell me about)\b/i.test(lower)) {
      return {
        text: "M Raza Rajput aik Full Stack Engineer & AI Integrator hain based in Karachi, Pakistan. Raza high-performance kinetic web platforms, AI agents, dynamic interfaces, aur end-to-end architectures build karte hain. Main unka dedicated digital assistant hoon jo unki portfolio aur projects ko represent karta hai!",
        showEmailAction: false,
      };
    }

    // 5. Location / Where is Raza
    if (/\b(location|where|city|country|karachi|pakistan|kahan rehte|kahan)\b/i.test(lower)) {
      return {
        text: "M Raza Rajput Karachi, Pakistan me based hain, aur globally remote clients aur teams ke saath successfully collaborate karte hain!",
        showEmailAction: false,
      };
    }

    // 6. Services & Capabilities
    if (/\b(services|service|kya kar sakte|offer|capabilities|specialty|specialization)\b/i.test(lower)) {
      return {
        text: "Raza Rajput ye core services deliver karte hain:\n• 🌐 Full-Stack Web Development (Next.js, React, Node.js, Express, PostgreSQL/MongoDB)\n• 🤖 AI Integrations & Agents (Gemini AI, OpenAI, Python AI agents)\n• ✨ Kinetic UI/UX & Motion (GSAP, Three.js, Lenis, Tailwind)\n• 📱 Scalable, mobile-responsive web applications.\nIn ke baray me Raza se baat karne ke liye aap direct email bhej sakte hain!",
        showEmailAction: true,
      };
    }

    // 7. Projects & Portfolio Works
    if (/\b(project|projects|work|works|portfolio|nexus|drake|earthy|healthmate|salt)\b/i.test(lower)) {
      return {
        text: "Raza ke key featured projects hain:\n1. 📚 Nexus AI Book — Intelligent book reading with neural context exploration.\n2. 🛍️ Drake Wears — Luxe fashion storefront with Lenis physics & Postgres.\n3. ⚡ Earthy Electronics — Eco marketplace with Gemini AI scrapers.\n4. 🩺 HealthMate Telemetry — Medical telemetry & AI diagnostics.\n5. 🍽️ Salt & Pepper — Fine dining culinary system.\nProjects section me aap inke live links aur GitHub dekh sakte hain!",
        showEmailAction: true,
      };
    }

    // 8. Tech Stack & Skills
    if (/\b(stack|tech|technology|technologies|skills|skill|frontend|backend|framework|languages|python|react|node|three\.js|database)\b/i.test(lower)) {
      return {
        text: "Raza ka core tech stack:\n• Frontend: React, Next.js, Three.js, GSAP, Lenis, Tailwind CSS\n• Backend: Node.js, Express, Python, REST/GraphQL APIs\n• Databases: PostgreSQL, Prisma, Supabase, MongoDB, MySQL\n• AI / ML: Gemini AI, OpenAI API, Agentic Workflows, LangChain",
        showEmailAction: false,
      };
    }

    // 9. Pricing, Rates, Hiring & Freelance
    if (/\b(hire|freelance|contract|cost|pricing|price|rate|budget|charges|available|availability|paisa|kitna|pese)\b/i.test(lower)) {
      return {
        text: "Raza selective freelance projects, consultations, aur architecture contracts ke liye available hain! Har project ka scope aur timeline unique hota hai, is liye specific quotes ke liye aap direct email bhej sakte hain:",
        showEmailAction: true,
      };
    }

    // 10. Contact, Email & WhatsApp
    if (/\b(email|mail|contact|rabta|phone|number|whatsapp|call|reach|inbox)\b/i.test(lower)) {
      return {
        text: "Aap Raza se direct email par rabta kar sakte hain:\n📧 raoraza5417@gmail.com\nNeeche button par click karke aap seedha email compose kar sakte hain!",
        showEmailAction: true,
      };
    }

    // 11. Thanks & Compliments
    if (/\b(thanks|thank you|shukriya|jazakallah|dhanyawad|great|awesome|cool|zabardast|nice|good job)\b/i.test(lower)) {
      return {
        text: "Bohat shukriya! It's always a pleasure. Agar koi mazeed sawal ho ya koi project start karna ho, to main hamesha hazir hoon! 🚀",
        showEmailAction: false,
      };
    }

    // 12. Smart Contextual Fallback
    return {
      text: "Samajh gaya! Raza se is baray me detailed baat karne ke liye aap direct email bhej sakte hain (raoraza5417@gmail.com). Ya agar aapko Raza ke projects, tech stack, ya freelance availability ke baray me poochna ho to zaroor poochiye! 😊",
      showEmailAction: true,
    };
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(text);
      const botMsg = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        time: getTimeString(),
        showEmailAction: reply.showEmailAction,
        originalQuery: text,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handlePillClick = (query) => {
    handleSend(query);
  };

  const handleScrollToContact = () => {
    onClose();
    setTimeout(() => {
      const contactEl = document.getElementById('contact');
      if (window.__lenis) {
        window.__lenis.scrollTo(contactEl || document.body.scrollHeight, { duration: 1.4 });
      } else {
        contactEl?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  return (
    <div
      className="chat-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      data-lenis-prevent="true"
    >
      <div
        className="chat-modal-window"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        {/* Header */}
        <header className="chat-header">
          <div className="chat-header-profile">
            <div className="chat-avatar-wrap">
              <img src={razaImg} alt="M Raza Rajput" className="chat-avatar-img" />
              <span className="chat-status-dot" title="Online" />
            </div>
            <div className="chat-header-info">
              <div className="chat-header-name">
                M Raza Rajput
                <span className="chat-header-badge">Online</span>
              </div>
              <span className="chat-header-status">Full Stack Architect & AI Integrator</span>
            </div>
          </div>

          <div className="chat-header-actions">
            <button
              type="button"
              className="chat-clear-btn"
              onClick={handleClearHistory}
              title="Clear conversation history on this device"
              aria-label="Clear chat history"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
            <button
              type="button"
              className="chat-close-btn"
              onClick={onClose}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Message Thread */}
        <div
          className="chat-messages"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrap ${msg.sender}`}>
              <div className="chat-bubble">{msg.text}</div>
              <span className="chat-time">{msg.time}</span>

              {msg.showEmailAction && (
                <div className="chat-action-card">
                  <a
                    href={`mailto:raoraza5417@gmail.com?subject=Let's Connect&body=${encodeURIComponent(
                      msg.originalQuery || ''
                    )}`}
                    className="chat-action-btn chat-action-btn-email"
                  >
                    ✉ Send Email to Raza
                  </a>
                  <button
                    type="button"
                    className="chat-action-btn chat-action-btn-secondary"
                    onClick={handleScrollToContact}
                  >
                    View Contact Section ↓
                  </button>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-wrap bot">
              <div className="chat-typing" aria-label="Raza is typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {/* Quick pills after initial message */}
          {messages.length === 1 && !isTyping && (
            <div className="chat-pills-container">
              <span className="chat-pills-label">Quick topics:</span>
              <div className="chat-pills-list">
                {QUICK_PILLS.map((pill, i) => (
                  <button
                    key={i}
                    type="button"
                    className="chat-pill-btn"
                    onClick={() => handlePillClick(pill.query)}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <footer className="chat-footer">
          <form
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="chat-input-field"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-label="Type message"
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <div className="chat-footer-caption">
            Direct Email: raoraza5417@gmail.com
          </div>
        </footer>
      </div>
    </div>
  );
}
