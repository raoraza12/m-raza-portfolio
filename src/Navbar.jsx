import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenChat }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const scrollToTarget = (target) => {
    if (window.__lenis) {
      window.__lenis.scrollTo(target, {
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      target?.scrollIntoView?.({ behavior: 'smooth' });
    }
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    if (onOpenChat) {
      onOpenChat();
    } else {
      const contact = document.getElementById('contact');
      if (contact) {
        scrollToTarget(contact);
      } else {
        scrollToTarget(document.body.scrollHeight);
      }
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    scrollToTarget(0);
  };

  const handleNavClick = (e, target) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      if (target === '#top') {
        scrollToTarget(0);
      } else {
        const el = document.querySelector(target);
        if (el) scrollToTarget(el);
      }
    }, 150);
  };

  const handleMenuChatClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      onOpenChat?.();
    }, 200);
  };

  return (
    <>
      <nav className="site-nav" aria-label="Primary navigation">
        <button
          type="button"
          className="nav-btn nav-menu"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="currentColor" aria-hidden="true">
            <rect y="0" width="22" height="2" rx="1" />
            <rect y="6" width="16" height="2" rx="1" />
            <rect y="12" width="22" height="2" rx="1" />
          </svg>
          <span>Menu</span>
        </button>

        <a href="#top" onClick={handleLogoClick} className="nav-logo" aria-label="M Raza Rajput Home">
          <span className="logo-from">M Raza </span>
          <span className="logo-another">Rajput</span>
        </a>

        <div className="nav-right">
          <button
            type="button"
            onClick={handleChatClick}
            className="nav-btn nav-chat"
            aria-label="Open chat assistant"
          >
            <span>Let’s chat</span>
            <span className="nav-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`menu-overlay ${menuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <span className="menu-close-x" aria-hidden="true">
            ×
          </span>
          <span>CLOSE</span>
        </button>

        <nav className="menu-nav">
          <ul>
            <li style={{ '--menu-i': 0 }}>
              <a href="#top" onClick={(e) => handleNavClick(e, '#top')} className="menu-link">
                Home
              </a>
            </li>
            <li style={{ '--menu-i': 1 }}>
              <a href="#roles" onClick={(e) => handleNavClick(e, '#roles')} className="menu-link">
                Roles
              </a>
            </li>
            <li style={{ '--menu-i': 2 }}>
              <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="menu-link">
                Projects
              </a>
            </li>
            <li style={{ '--menu-i': 3 }}>
              <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="menu-link">
                Contact
              </a>
            </li>
            <li style={{ '--menu-i': 4 }}>
              <a href="#chat" onClick={handleMenuChatClick} className="menu-link menu-link-chat">
                AI Assistant ✦
              </a>
            </li>
          </ul>
        </nav>

        <div className="menu-contact" style={{ '--menu-i': 5 }}>
          <span className="menu-contact-label">Direct Communication</span>
          <a href="mailto:raoraza5417@gmail.com" className="menu-contact-email">
            raoraza5417@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}
