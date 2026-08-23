import React, { useRef, useEffect, useState } from 'react';

export default function RevealText({ children, as: Tag = 'div', className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="overflow-hidden" ref={ref}>
      <Tag
        className={className}
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          opacity: visible ? 1 : 0,
          transition: `transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        }}
      >
        {children}
      </Tag>
    </div>
  );
}