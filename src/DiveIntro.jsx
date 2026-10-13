import React, { useRef, useState, useEffect } from 'react';
import heroBgImg from './assets/hero_bg-CfSw2las.png';
import heroVdo from './assets/hero_vdo-BiUQ78eI.mp4';

export default function DiveIntro() {
  const secRef = useRef(null);
  const gRef = useRef(null);
  const textRef = useRef(null);
  const [center, setCenter] = useState({ x: 800, y: 450 });

  useEffect(() => {
    const updateCenter = () => {
      const text = textRef.current;
      if (!text || typeof text.getExtentOfChar !== 'function') return;
      try {
        const bbox = text.getExtentOfChar(4);
        setCenter({ x: bbox.x + bbox.width * 0.11, y: bbox.y + bbox.height / 2 });
      } catch (_) {}
    };
    const raf = requestAnimationFrame(updateCenter);
    document.fonts?.ready?.then(updateCenter);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const sec = secRef.current;
    const g = gRef.current;
    if (!sec || !g) return;

    const cx = center.x;
    const cy = center.y;
    let raf = 0;

    const onUpdate = () => {
      const rect = sec.getBoundingClientRect();
      const h = window.innerHeight;
      const total = Math.max(1, sec.offsetHeight - h);
      const progress = Math.max(0, Math.min(total, -rect.top)) / total;
      const p = Math.max(0, Math.min(1, (progress - 0.04) / 0.16));
      // Quintic polynomial ease
      const scale = 1 + p * p * p * (p * (p * 6 - 15) + 10) * 200;
      g.setAttribute(
        'transform',
        `translate(${cx} ${cy}) scale(${scale.toFixed(3)}) translate(${-cx} ${-cy})`
      );
      sec.style.setProperty('--dive-progress', progress.toFixed(4));
      raf = 0;
    };

    const handleScroll = () => {
      if (!raf) raf = requestAnimationFrame(onUpdate);
    };

    onUpdate();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onUpdate);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [center]);

  return (
    <section ref={secRef} className="dive-section" id="work">
      <div className="dive-sticky">
        <img className="dive-cover-bg" src={heroBgImg} alt="" draggable="false" />
        <div className="dive-masked">
          <video
            className="dive-video"
            src={heroVdo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <div className="dive-blur-grad" />
        </div>

        <svg
          className="dive-cover-svg"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs className="dive-svg-defs">
            <mask
              id="dive-text-mask"
              maskUnits="userSpaceOnUse"
              x="-50000"
              y="-50000"
              width="100000"
              height="100000"
            >
              <rect x="-50000" y="-50000" width="100000" height="100000" fill="black" />
              <g ref={gRef}>
                <text
                  ref={textRef}
                  x="800"
                  y="450"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="Archivo, system-ui, sans-serif"
                  fontWeight="900"
                  fontSize="140"
                  letterSpacing="-3"
                  fill="white"
                >
                  DELVE IN
                </text>
              </g>
            </mask>
          </defs>
        </svg>

        <div className="dive-journey-content">
          <h2 className="dive-journey-title">
            <span className="dive-journey-title-span">through</span> THIS<br />
            JOURNEY WITH ME
          </h2>
        </div>
      </div>
    </section>
  );
}
