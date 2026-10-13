import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MIN_WIDTH = 600;
const CURVE_POINTS = [
  { c1: [0, 0.1], c2: [-0.1, 0.16], end: [-0.08, 0.26] },
  { c1: [-0.06, 0.36], c2: [0.12, 0.34], end: [0.12, 0.47] },
  { c1: [0.12, 0.59], c2: [-0.04, 0.64], end: [0.05, 0.76] },
  { c1: [0.13, 0.88], c2: [0.34, 0.9], end: [0.58, 1.05] },
];
const SHIFT_FACTOR = 0.55;
const FONT_OFFSET = 0.2;
let measureCtx;

function measureIWidth(fontWeight, fontSize, fontFamily) {
  measureCtx ||= document.createElement('canvas').getContext('2d');
  measureCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const m = measureCtx.measureText('I');
  return m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
}

function buildSvgPath(sx, sy, pts) {
  let d = `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  for (const p of pts) {
    d += ` C ${p.c1x.toFixed(1)} ${p.c1y.toFixed(1)}, ${p.c2x.toFixed(1)} ${p.c2y.toFixed(1)}, ${p.ex.toFixed(1)} ${p.ey.toFixed(1)}`;
  }
  return d;
}

export default function ScrollCurve({ regionRef }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const region = regionRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!region || !svg || !path) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx = null;

    const rebuild = () => {
      if (ctx) {
        ctx.revert();
        ctx = null;
      }
      const anchor = region.querySelector('.curve-anchor');
      if (window.innerWidth < MIN_WIDTH || !anchor) {
        svg.style.display = 'none';
        return;
      }
      svg.style.display = '';

      const rRect = region.getBoundingClientRect();
      const rw = rRect.width;
      const rh = rRect.height;
      svg.setAttribute('viewBox', `0 0 ${rw} ${rh}`);

      const aRect = anchor.getBoundingClientRect();
      const aStyle = getComputedStyle(anchor);
      const fontSize = parseFloat(aStyle.fontSize) || aRect.height;
      const sx = aRect.left + aRect.width / 2 - rRect.left;
      const sy = aRect.bottom - rRect.top - fontSize * FONT_OFFSET;

      const strokeW = measureIWidth(aStyle.fontWeight, fontSize, aStyle.fontFamily);
      if (strokeW > 0) {
        path.style.strokeWidth = `${strokeW}px`;
      }

      const pts = CURVE_POINTS.map((p) => ({
        c1x: sx + p.c1[0] * rw,
        c1y: sy + p.c1[1] * rh,
        c2x: sx + p.c2[0] * rw,
        c2y: sy + p.c2[1] * rh,
        ex: sx + p.end[0] * rw,
        ey: sy + p.end[1] * rh,
      }));

      path.setAttribute('pathLength', '1');
      path.setAttribute('d', buildSvgPath(sx, sy, pts));
      path.style.strokeDasharray = '1';
      path.style.strokeDashoffset = reduced ? '0' : '1';

      if (reduced) return;

      const roles = region.querySelector('.roles-section');
      ctx = gsap.context(() => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: anchor,
            start: 'top 20%',
            endTrigger: roles || region,
            end: 'bottom center',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }, region);

      ScrollTrigger.refresh();
    };

    rebuild();
    window.addEventListener('resize', rebuild);
    window.addEventListener('load', rebuild);

    return () => {
      window.removeEventListener('resize', rebuild);
      window.removeEventListener('load', rebuild);
      if (ctx) ctx.revert();
    };
  }, [regionRef]);

  return (
    <svg ref={svgRef} className="scroll-curve" preserveAspectRatio="none" aria-hidden="true">
      <path ref={pathRef} className="scroll-curve-path" fill="none" />
    </svg>
  );
}
