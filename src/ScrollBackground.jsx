import React, { useRef, useState, useEffect } from 'react';
import bgVideo from './assets/bgvideo-WLnX9sPP.mp4';

export default function ScrollBackground({ zoomed = false }) {
  const rootRef = useRef(null);
  const rafRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onUpdate = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      el.style.setProperty('--scroll-progress', progress.toFixed(4));

      const dive = document.querySelector('.dive-section');
      const diveProgress = dive
        ? parseFloat(getComputedStyle(dive).getPropertyValue('--dive-progress')) || 0
        : 1;
      setRevealed(diveProgress > 0.25);
      rafRef.current = false;
    };

    const handleScroll = () => {
      if (!rafRef.current) {
        requestAnimationFrame(onUpdate);
        rafRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onUpdate);
    onUpdate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onUpdate);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`sb-root ${zoomed ? 'sb-zoomed' : ''} ${revealed ? 'sb-revealed' : ''}`}
      aria-hidden="true"
    >
      <video
        className="sb-video"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="sb-wash" />
      <div className="sb-tint" />
      <div className="sb-grain-coarse" />
      <div className="sb-grain" />
      <div className="sb-vignette" />
      <div className="sb-cover" />
    </div>
  );
}
