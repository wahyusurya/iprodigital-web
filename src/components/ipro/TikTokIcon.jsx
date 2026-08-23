import React from 'react';

export default function TikTokIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.89 2.89 0 0 1-5.2 1.738 2.89 2.89 0 0 1 2.31-4.637c.3 0 .593.046.872.132V9.4a6.33 6.33 0 0 0-1.015-.078A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.526V6.79a4.85 4.85 0 0 1-1.041-.104z" />
    </svg>
  );
}