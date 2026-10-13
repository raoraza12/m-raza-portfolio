import React, { useRef, useState, useEffect, useCallback } from 'react';
import jacketImg from './assets/raza_hero.png';
import heroImg from './assets/raza_hero.png';

export default function HeroReveal() {
  const btnRef = useRef(null);
  const [active, setActive] = useState(false);
  const [forced, setForced] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(m.matches);
    onChange();
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const btn = btnRef.current;
    const stage = btn?.parentElement;
    const runway = stage?.parentElement;
    if (!stage || !runway) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight;
      const pinDist = Math.max(1, runway.offsetHeight - h);
      const p = Math.min(1, Math.max(0, -runway.getBoundingClientRect().top / pinDist));
      const e = p * p;
      stage.style.filter = `brightness(${(1 - e * 0.55).toFixed(3)})`;
      stage.style.visibility = p >= 1 ? 'hidden' : 'visible';
      stage.style.pointerEvents = p > 0.5 ? 'none' : '';
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (raf) cancelAnimationFrame(raf);
      stage.style.filter = '';
      stage.style.visibility = '';
      stage.style.pointerEvents = '';
    };
  }, [reduced]);

  const setPos = useCallback((clientX, clientY) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${clientX - rect.left}px`);
    el.style.setProperty('--my', `${clientY - rect.top}px`);
  }, []);

  const handleMouseEnter = useCallback(
    (e) => {
      setPos(e.clientX, e.clientY);
      setActive(true);
    },
    [setPos]
  );

  const handleMouseMove = useCallback(
    (e) => {
      setPos(e.clientX, e.clientY);
    },
    [setPos]
  );

  const handleMouseLeave = useCallback(() => {
    setActive(false);
  }, []);

  const handleTouchStart = useCallback(
    (e) => {
      const t = e.touches[0];
      if (t) {
        setPos(t.clientX, t.clientY);
        setActive(true);
      }
    },
    [setPos]
  );

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setForced((prev) => !prev);
    }
  }, []);

  return (
    <section className="reveal-section" aria-label="Featured portrait">
      <button
        ref={btnRef}
        type="button"
        className={`reveal ${active ? 'is-active' : ''} ${forced ? 'is-forced' : ''}`}
        aria-pressed={forced}
        aria-label="Move cursor to reveal creative mode, or press Enter to lock"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchStart}
        onTouchEnd={handleMouseLeave}
        onClick={() => setForced((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        <img
          className="reveal-img reveal-base"
          src={jacketImg}
          alt="M Raza Rajput portrait"
          draggable="false"
        />
        <img
          className="reveal-img reveal-top"
          src={heroImg}
          alt="Creative identity cutout"
          loading="lazy"
          draggable="false"
        />

        <svg
          className="reveal-shape"
          aria-hidden="true"
          focusable="false"
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              id="amoebaDistort"
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="turbulence"
                baseFrequency="0.013"
                numOctaves="2"
                seed="4"
                result="noise"
              >
                {!reduced && (
                  <animate
                    attributeName="baseFrequency"
                    dur="12s"
                    values="0.009;0.018;0.012;0.009"
                    repeatCount="indefinite"
                  />
                )}
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="60"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <mask id="revealMask">
              <g filter="url(#amoebaDistort)">
                <circle className="reveal-mask-shape" />
              </g>
            </mask>
          </defs>
          <circle className="reveal-edge-glow reveal-edge" />
          <circle className="reveal-edge" />
        </svg>

        <div className="reveal-scrim reveal-scrim-top" />
        <div className="reveal-scrim reveal-scrim-bottom" />

        <div className="reveal-caption">
          <span className="reveal-caption-base">AI INTEGRATOR & CREATIVE ENGINEER</span>
          <span className="reveal-caption-top">FULL STACK ARCHITECT</span>
        </div>

        <div className="reveal-hint-badge">
          {forced ? '⚡ Creative Persona Active' : '✦ Tap or hover to reveal'}
        </div>
      </button>
    </section>
  );
}
