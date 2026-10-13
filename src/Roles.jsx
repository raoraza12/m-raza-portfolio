import React, { useState, useRef, forwardRef } from 'react';
import previewVideo from './assets/hushMeet-CGzQG0sJ.mp4';

const ROLES = [
  'Full-Stack Developer',
  'AI Integrator',
  'UI/UX Designer',
  'Mobile Apps',
];

const Roles = forwardRef(function Roles(props, ref) {
  const vidRef = useRef(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const setMergedRef = (el) => {
    sectionRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const updatePos = (e) => {
    const vid = vidRef.current;
    const sec = sectionRef.current;
    if (!vid || !sec) return;
    const rect = sec.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    vid.style.transform = `translate(${x}px, ${y}px) translate(18px, 24px)`;
  };

  return (
    <section className="roles-section" id="roles" ref={setMergedRef}>
      <p className="roles-eyebrow">02 — SPECIALIZATIONS &amp; ROLES</p>
      <ul
        className="roles-list"
        onMouseEnter={(e) => {
          updatePos(e);
          setVisible(true);
        }}
        onMouseLeave={() => setVisible(false)}
        onMouseMove={updatePos}
      >
        {ROLES.map((role) => (
          <li className="roles-item" key={role} tabIndex={0}>
            {role}
          </li>
        ))}
      </ul>

      <video
        ref={vidRef}
        className={`roles-cursor-vid ${visible ? 'is-visible' : ''}`}
        src={previewVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </section>
  );
});

export default Roles;
