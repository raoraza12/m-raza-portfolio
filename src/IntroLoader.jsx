import React, { useEffect } from 'react';
import { signatureSvg } from './assets/signatureMarkup';

export default function IntroLoader({ onComplete }) {
  useEffect(() => {
    // Safety fallback: ensure loader dismisses even in headless browsers or slow devices
    const timer = setTimeout(() => {
      handleFinish();
    }, 4200);

    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleFinish();
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onComplete]);

  const handleFinish = () => {
    try {
      sessionStorage.setItem('portfolio_intro_seen', 'true');
    } catch (_) {}
    onComplete?.();
  };

  return (
    <div
      className="intro-loader"
      role="region"
      aria-label="Loading animation"
      onAnimationEnd={(e) => {
        if (e.animationName === 'intro-lift') {
          handleFinish();
        }
      }}
    >
      <div
        className="intro-sig"
        dangerouslySetInnerHTML={{ __html: signatureSvg }}
      />
      <button
        type="button"
        className="intro-skip-btn"
        onClick={handleFinish}
        aria-label="Skip introduction"
      >
        Skip ✕
      </button>
    </div>
  );
}

