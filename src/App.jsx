import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import IntroLoader from './IntroLoader';
import ScrollBackground from './ScrollBackground';
import FixedVideoBg from './FixedVideoBg';
import Navbar from './Navbar';
import HeroReveal from './HeroReveal';
import DiveIntro from './DiveIntro';
import ScrollCurve from './ScrollCurve';
import Hero from './Hero';
import Roles from './Roles';
import FeaturedWorks from './FeaturedWorks';
import Contact from './Contact';
import Footer from './Footer';
import ChatModal from './ChatModal';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [showIntro, setShowIntro] = useState(() => {
    if (prefersReducedMotion) return false;
    try {
      return !sessionStorage.getItem('portfolio_intro_seen');
    } catch (_) {
      return true;
    }
  });
  const [zoomed, setZoomed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const rolesRef = useRef(null);
  const curveRegionRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!showIntro) return;
    window.scrollTo(0, 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showIntro]);

  useEffect(() => {
    const rolesEl = rolesRef.current;
    if (!rolesEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setZoomed(entry.isIntersecting || entry.boundingClientRect.top < 0);
      },
      { rootMargin: '-35% 0px -35% 0px' }
    );
    observer.observe(rolesEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (showIntro) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;
    lenis.scrollTo(0, { immediate: true });
    lenis.on('scroll', ScrollTrigger.update);

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, [showIntro]);

  return (
    <>
      {showIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
      <ScrollBackground zoomed={zoomed} />
      <FixedVideoBg />
      <Navbar onOpenChat={() => setIsChatOpen(true)} />

      <div className="reveal-bg" aria-hidden="true" />

      <main
        className={`site-main ${!showIntro ? 'page-rise' : ''}`}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="hero-shift">
          <HeroReveal />
        </div>

        <DiveIntro />

        <div className="curve-region" ref={curveRegionRef}>
          <ScrollCurve regionRef={curveRegionRef} />
          <Hero />
          <Roles ref={rolesRef} />
        </div>

        <FeaturedWorks />
        <Contact />
      </main>

      <Footer />

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
