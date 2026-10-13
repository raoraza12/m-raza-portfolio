import React, { useState, useEffect, useRef } from 'react';
import heroVdo from './assets/hero_vdo-BiUQ78eI.mp4';
import creativeVdo from './assets/creative-CrXiI4kt.mp4';

const ROTATING_WORDS = ['INTELLIGENCE', 'SYSTEMS', 'INTERFACES', 'PRODUCTS'];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [cueHidden, setCueHidden] = useState(false);
  const heroVidRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setIsAtBottom(scrollY >= docHeight - 80);
      setCueHidden(scrollY > 200 && scrollY < docHeight - 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCueClick = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="hero" id="top">
        <p className="hero-since">
          Karachi, PK<br />
          Available 2026
        </p>

        <h1 className="hero-headline">
          NOT JUST<br />
          WEBSITES — <span className="curve-anchor">I</span><br />
          BUILD{' '}
          <button
            type="button"
            className="hero-vid-btn"
            onClick={() => setShowModal(true)}
            aria-label="Play creative showreel"
          >
            <video
              ref={heroVidRef}
              src={heroVdo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </button>
          <br />
          <span className="hero-rotating-word" key={wordIndex}>
            {ROTATING_WORDS[wordIndex]}
          </span>
        </h1>
      </section>

      {/* Floating scroll cue with drop line and pulsing dot */}
      <button
        type="button"
        className={`hero-scroll-cue ${isAtBottom ? 'is-at-bottom' : ''} ${
          cueHidden ? 'is-hidden' : ''
        }`}
        onClick={handleCueClick}
        aria-label={isAtBottom ? 'Back to top' : 'Scroll down'}
      >
        <span className="cue-dot" />
        <span className="cue-line" />
      </button>

      {/* Creative showreel modal */}
      {showModal && (
        <div
          className="hero-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowModal(false)}
        >
          <button
            type="button"
            className="hero-modal-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(false);
            }}
            aria-label="Close modal"
          >
            ×
          </button>
          <video
            src={creativeVdo}
            autoPlay
            loop
            playsInline
            controls
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
