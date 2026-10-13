import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const sectionRef = useRef(null);
  const wordmarkRef = useRef(null);
  const [inFooter, setInFooter] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInFooter(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    const resize = () => {
      el.style.fontSize = '100px';
      const w = el.scrollWidth;
      if (w) {
        el.style.fontSize = `${(window.innerWidth / w) * 100}px`;
      }
    };

    resize();
    const handleResize = () => {
      resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    document.fonts?.ready?.then(() => {
      resize();
      ScrollTrigger.refresh();
    });

    return () => window.removeEventListener('resize', handleResize);
  }, [inFooter]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    if (!section || !wordmark || !inFooter) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordmark,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [inFooter]);

  return (
    <section className="footer-reveal" ref={sectionRef} aria-label="End">
      {inFooter && (
        <div className="footer-panel">
          <h2 ref={wordmarkRef} className="footer-wordmark">
            RAZA RAJPUT
          </h2>
        </div>
      )}
    </section>
  );
}
