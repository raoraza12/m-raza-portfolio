import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GithubIcon, InstagramIcon, LinkedinIcon } from './Icons';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['impact', 'visions', 'systems', 'intelligence'];
const EMAIL = 'raoraza5417@gmail.com';

export default function Contact() {
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    const bg = document.querySelector('.reveal-bg');
    if (!wrap) return;

    const setCircle = (r) => {
      if (bg) bg.style.clipPath = `circle(${r}px at 50% 100%)`;
    };

    const maxR = () => Math.hypot(window.innerWidth, window.innerHeight);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onLeaveBack: () => setCircle(0),
        },
      });

      tl.fromTo(
        wrap,
        { '--clip-progress': 0 },
        {
          '--clip-progress': 1,
          ease: 'none',
          duration: 1,
          onUpdate() {
            const p = tl.progress();
            setCircle(p * maxR());
          },
        },
        0
      );

      if (panel) {
        tl.fromTo(
          panel,
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: 'none', duration: 0.4 },
          0.55
        );
      }
    }, wrap);

    const onRefresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', onRefresh);
    const timer = setTimeout(onRefresh, 600);

    return () => {
      window.removeEventListener('load', onRefresh);
      clearTimeout(timer);
      ctx.revert();
      setCircle(0);
    };
  }, []);

  return (
    <section className="contact-reveal" id="contact" aria-label="Contact">
      <div className="contact-blob-wrap" ref={wrapRef}>
        <div className="contact-panel" ref={panelRef}>
          <h2 className="cr-heading">
            Let’s build<br />
            <span className="cr-rotate" key={wordIdx}>
              {WORDS[wordIdx]}
            </span>
            <br />
            together
          </h2>

          <div className="cr-right">
            <a className="cr-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>

            <ul className="cr-socials">
              <li>
                <a
                  href="https://github.com/raoraza12"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/supraa_main?srtk=MWJpaWZwdHQwdG0xZQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/raoraza12"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
