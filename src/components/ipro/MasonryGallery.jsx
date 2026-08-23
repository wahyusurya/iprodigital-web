import { db } from "@/api/db";

import React, { useState, useEffect, useRef, useCallback } from 'react';

import RevealText from '@/components/ipro/RevealText';
import { Star, TrendingUp, ShieldCheck, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import VideoEmbed from '@/components/ipro/VideoEmbed';

const BURNT_ORANGE = '#cc5500';

export default function MasonryGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const scrollTimer = useRef(null);

  useEffect(() => {
    db.entities.SocialProof
      .list('sort_order', 50)
      .then((data) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const cards = container.querySelectorAll('[data-story-card]');
      if (!cards.length) return;
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - containerCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    }, 60);
  }, []);

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('[data-story-card]');
    const card = cards[index];
    if (!card) return;
    container.scrollTo({
      left: card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2,
      behavior: 'smooth',
    });
  };

  const goPrev = () => {
    const next = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
    scrollToIndex(next);
  };

  const goNext = () => {
    const next = activeIndex >= items.length - 1 ? 0 : activeIndex + 1;
    scrollToIndex(next);
  };

  return (
    <section id="success-stories" className="py-10 lg:py-28" style={{ background: '#f9f9f8' }}>
      <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <RevealText>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: BURNT_ORANGE }}>
              Client Success Stories
            </p>
          </RevealText>
          <RevealText as="h2" className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-900" delay={100}>
            Kisah Sukses Klien Kami
          </RevealText>
          <RevealText delay={200}>
            <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-xl mx-auto">
              Lihat bagaimana bisnis di Bali tumbuh bersama iprodigital.id — dari kepatuhan pajak hingga lonjakan omset digital.
            </p>
          </RevealText>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: BURNT_ORANGE }} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Belum ada kisah sukses. Tambahkan melalui panel admin.
          </div>
        ) : (
          <>
            {/* Carousel */}
            <div className="relative">
              {/* Arrow buttons — desktop only */}
              <button
                onClick={goPrev}
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white border border-gray-200 items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                aria-label="Sebelumnya"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              <button
                onClick={goNext}
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white border border-gray-200 items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                aria-label="Berikutnya"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>

              {/* Scroll container */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth ipro-no-scrollbar touch-pan-x lg:px-[18%] py-6"
              >
                {items.map((item, i) => (
                  <StoryCard key={item.id} item={item} isActive={i === activeIndex} />
                ))}
              </div>

              {/* Pagination dots */}
              <div className="flex justify-center items-center gap-2 mt-6">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === activeIndex ? '28px' : '8px',
                      height: '8px',
                      background: i === activeIndex ? BURNT_ORANGE : '#d1d5db',
                    }}
                    aria-label={`Ke slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Legal trust badge */}
        <RevealText delay={400}>
          <div className="mt-12 lg:mt-16 rounded-2xl p-6 sm:p-8 lg:p-10 text-center" style={{ background: '#ffffff', border: '1px solid #e6e5e2' }}>
            <ShieldCheck size={36} className="mx-auto mb-3" style={{ color: '#1a3a6b' }} />
            <p className="text-base sm:text-lg font-bold text-gray-900">
              Di bawah naungan hukum resmi PT Bersama Tunas Bangsa
            </p>
            <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
              Terdaftar resmi dengan alamat operasional di Kota Denpasar, Bali. Menjamin keamanan data, legalitas mutlak, dan profesionalisme tingkat korporat.
            </p>
          </div>
        </RevealText>
      </div>
    </section>
  );
}

function StoryCard({ item, isActive }) {
  return (
    <div
      data-story-card
      className="snap-center shrink-0 w-[82%] sm:w-[55%] lg:w-[30%]"
    >
      <div
        className="story-card-inner rounded-2xl p-6 sm:p-8 h-full relative overflow-hidden transition-all duration-[400ms] ease-in-out"
        style={{
          background: isActive ? BURNT_ORANGE : '#ffffff',
          color: isActive ? '#fff' : '#374151',
          border: `1px solid ${isActive ? BURNT_ORANGE : '#e6e5e2'}`,
          transform: isActive ? 'scale(1.05)' : 'scale(1)',
          opacity: isActive ? 1 : 0.6,
          boxShadow: isActive
            ? '0 24px 64px rgba(204,85,0,0.25)'
            : '0 1px 3px rgba(0,0,0,0.04)',
          willChange: 'transform, opacity',
        }}
      >
        {/* Quote icon */}
        <Quote
          size={40}
          className="absolute top-5 left-5 transition-all duration-[400ms] ease-in-out"
          style={{
            opacity: isActive ? 0.25 : 0.08,
            color: isActive ? '#fff' : '#000',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Rating */}
          {item.rating > 0 && (
            <div className="flex gap-0.5 mb-4 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < item.rating ? (isActive ? '#fff' : '#f5b731') : 'none'}
                  stroke={
                    i < item.rating
                      ? (isActive ? '#fff' : '#f5b731')
                      : (isActive ? 'rgba(255,255,255,0.3)' : '#d1d5db')
                  }
                />
              ))}
            </div>
          )}

          {/* Testimonial */}
          {item.testimonial && (
            <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ opacity: 0.9 }}>
              {item.testimonial}
            </p>
          )}

          {/* Video Testimoni */}
          {item.video_url && (
            <div className="mb-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : '#e6e5e2'}` }}>
              <VideoEmbed url={item.video_url} />
            </div>
          )}

          {/* Client info */}
          <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : '#e6e5e2'}` }}>
            {item.logo_url ? (
              <img src={item.logo_url} alt={item.company || ''} className="w-10 h-10 rounded-lg object-cover shrink-0" />
            ) : (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-[400ms] ease-in-out"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#1a3a6b',
                  color: '#fff',
                }}
              >
                {item.client_name?.[0] || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{item.client_name}</p>
              {item.company && <p className="text-xs truncate" style={{ opacity: 0.7 }}>{item.company}</p>}
            </div>
          </div>

          {/* Outcome */}
          {item.outcome && (
            <div className="flex items-center gap-2 mt-3" >
              <TrendingUp size={14} style={{ color: isActive ? '#fff' : BURNT_ORANGE }} />
              <span className="text-xs font-semibold" style={{ color: isActive ? '#fff' : BURNT_ORANGE }}>
                {item.outcome}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}