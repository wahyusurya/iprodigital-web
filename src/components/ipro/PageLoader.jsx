import React, { useState, useEffect, useRef } from 'react';

export default function PageLoader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const startTime = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    startTime.current = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function tick(now) {
      const elapsed = now - startTime.current;
      const duration = 1300;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      const val = Math.round(eased * 100);
      setCount(val);

      if (val < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            document.body.style.overflow = '';
            onComplete?.();
          }, 700);
        }, 200);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const padded = String(count).padStart(3, '0');

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-8 transition-transform duration-700"
      style={{
        zIndex: 120,
        background: '#0f1f3a',
        color: '#fff',
        borderRadius: '0 0 2rem 2rem',
        transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
        transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)',
      }}
    >
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
          <rect x="5" y="5" width="30" height="90" rx="8" fill="#f5b731" />
          <path d="M35 5h35c16.569 0 30 13.431 30 30v0c0 16.569-13.431 30-30 30H55V95h-20V5z" fill="#1a3a6b" />
          <rect x="55" y="35" width="0" height="0" fill="#fff" />
        </svg>
        <span className="text-lg font-semibold tracking-tight">iprodigital.id</span>
      </div>
      <p className="text-sm opacity-60 tracking-wide">Pajak, Marketing & Otomatisasi Terintegrasi.</p>
      <div className="flex flex-col items-center gap-3" style={{ width: 'min(22rem, 72vw)' }}>
        <div className="w-full h-px bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${count}%`, background: '#f5b731' }}
          />
        </div>
        <span className="text-3xl font-bold tracking-widest font-mono">{padded}</span>
      </div>
    </div>
  );
}