import React, { useRef, useEffect } from 'react';
import './VariableFontText.css';

export const DEFAULTS = {
  thinWght: 100,
  boldWght: 820,
  thinWdth: 30,
  boldWdth: 151,
  entranceDuration: 0.9,
  entranceEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  stagger: 0.045, // 45ms between letters (Chapter 08)
  pinchRadius: 160,
  hoverTransition: '0.22s ease-out',
};

const fvs = (wght, wdth) => `'wght' ${wght}, 'wdth' ${wdth}`;

export default function VariableFontText({
  text,
  className = '',
  as: Component = 'span',
  config = {},
}) {
  const rootRef = useRef(null);
  const cfg = { ...DEFAULTS, ...config };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const spans = root.querySelectorAll('[data-vft-letter]');

    if (prefersReducedMotion) {
      spans.forEach((s) => {
        s.style.fontVariationSettings = fvs(cfg.boldWght, cfg.boldWdth);
      });
      return;
    }

    // Step 5: The forced reflow for staggered entrance (Chapter 08)
    spans.forEach((s) => {
      s.style.transition = 'none';
      s.style.fontVariationSettings = fvs(cfg.thinWght, cfg.thinWdth);
    });

    // Reading offsetWidth forces synchronous layout reflow (Load-bearing!)
    void root.offsetWidth;

    spans.forEach((s, i) => {
      s.style.transition = `font-variation-settings ${cfg.entranceDuration}s ${cfg.entranceEasing}`;
      s.style.transitionDelay = `${i * cfg.stagger}s`;
      s.style.fontVariationSettings = fvs(cfg.boldWght, cfg.boldWdth);
    });

    // Step 4: Proximity measurement throttled to 1 rAF per frame
    let rafId = 0;
    let lastEvent = null;

    const applyProximity = (e) => {
      if (!e) return;
      const { clientX, clientY } = e;

      spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;
        const d = Math.hypot(clientX - charX, clientY - charY);

        if (d > cfg.pinchRadius) {
          span.style.fontVariationSettings = fvs(cfg.boldWght, cfg.boldWdth);
        } else {
          // Letters flinch thin when cursor gets close (Chapter 08)
          const factor = Math.max(0, 1 - d / cfg.pinchRadius);
          const weight = Math.round(cfg.boldWght + (cfg.thinWght - cfg.boldWght) * factor);
          const width = Math.round(cfg.boldWdth + (cfg.thinWdth - cfg.boldWdth) * factor);
          span.style.transition = `font-variation-settings ${cfg.hoverTransition}`;
          span.style.transitionDelay = '0s';
          span.style.fontVariationSettings = fvs(weight, width);
        }
      });
    };

    const onMove = (e) => {
      lastEvent = e;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        applyProximity(lastEvent);
      });
    };

    const onLeave = () => {
      spans.forEach((span) => {
        span.style.transition = 'font-variation-settings 0.4s ease';
        span.style.transitionDelay = '0s';
        span.style.fontVariationSettings = fvs(cfg.boldWght, cfg.boldWdth);
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [text]);

  const characters = [...text];

  return (
    <Component ref={rootRef} className={`vft-root ${className}`}>
      {characters.map((char, index) => (
        <span
          key={index}
          data-vft-letter
          className="vft-letter"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Component>
  );
}
