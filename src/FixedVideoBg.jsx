import React, { useState, useEffect, useRef } from 'react';
import heroVdo from './assets/hero_vdo-BiUQ78eI.mp4';

export default function FixedVideoBg() {
  const [active, setActive] = useState(false);
  const rafRef = useRef(0);
  const vidRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const vid = vidRef.current;
    const diveVid = document.querySelector('.dive-video');
    if (vid && diveVid) {
      try {
        vid.currentTime = diveVid.currentTime;
      } catch (_) {}
    }
  }, [active]);

  useEffect(() => {
    const update = () => {
      const dive = document.querySelector('.dive-section');
      if (dive) {
        const p = parseFloat(getComputedStyle(dive).getPropertyValue('--dive-progress')) || 0;
        const rect = dive.getBoundingClientRect();
        const inView = rect.bottom > window.innerHeight;
        setActive(p > 0.06 && inView);
      }
      rafRef.current = 0;
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={`fvb-root ${active ? 'is-active' : ''}`} aria-hidden="true">
      <video
        ref={vidRef}
        className="fvb-video"
        src={heroVdo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="fvb-grad" />
    </div>
  );
}
