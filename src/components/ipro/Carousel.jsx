import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({ children, dark = false, center = false }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.querySelector('[data-carousel-item]');
    const cardWidth = card ? card.offsetWidth : 320;
    const gap = 24;
    container.scrollBy({ left: dir * (cardWidth + gap), behavior: 'smooth' });
  };

  const arrowClass = dark
    ? 'w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center hover:bg-white/15 hover:scale-110 transition-all duration-300 text-white shadow-lg'
    : 'w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 text-gray-700 shadow-md';

  return (
    <div className="relative">
      <div className="hidden lg:flex items-center gap-2 absolute -top-14 right-0">
        <button onClick={() => scroll(-1)} className={arrowClass} aria-label="Sebelumnya">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => scroll(1)} className={arrowClass} aria-label="Berikutnya">
          <ChevronRight size={18} />
        </button>
      </div>
      <div
        ref={scrollRef}
        className={`flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth ipro-no-scrollbar pb-2 touch-pan-x ${center ? 'lg:justify-center' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}