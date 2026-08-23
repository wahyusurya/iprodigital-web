
import React from 'react';
import RevealText from '@/components/ipro/RevealText';
import { ArrowRight } from 'lucide-react';

const HERO_BG = '/brand/hero-bg.png';

const stats = [
  { value: '2020', label: 'Melangkah Bersama Mitra' },
  { value: '50++', label: 'Klien Sukses Mengembangkan Bisnis' },
  { value: '100%', label: 'Terlindungi Hukum di bawah PT Bersama Tunas Bangsa' },
];

export default function HeroSection({ ready }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        borderRadius: '0 0 2rem 2rem',
        background: '#0f1f3a',
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,31,58,0.92) 0%, rgba(26,58,107,0.85) 50%, rgba(15,31,58,0.95) 100%)' }} />
      </div>

      {/* IPRO watermark */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none font-bold tracking-tighter"
        style={{ fontSize: 'clamp(6rem, 15vw, 14rem)', color: 'rgba(255,255,255,0.03)', lineHeight: 1 }}
      >
        IPRO
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto px-5 sm:px-6 lg:px-10 pt-28 pb-16 sm:pb-20 lg:pt-40 lg:pb-28 flex flex-col gap-8 lg:gap-10" style={{ maxWidth: '88rem', minHeight: '100vh', justifyContent: 'center' }}>
        <RevealText delay={200}>
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium tracking-wide" style={{ background: 'rgba(245,183,49,0.15)', color: '#f5b731', border: '1px solid rgba(245,183,49,0.25)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Partner Ahli Pertumbuhan Bisnis Selaras Hulu ke Hilir
          </span>
        </RevealText>

        <div className="max-w-4xl">
          <RevealText as="h1" className="text-[clamp(2rem,6vw,4.5rem)] font-bold text-white leading-tight tracking-tight" delay={300}>
            Integrasi Pajak, Pemasaran Digital
          </RevealText>
          <RevealText as="h1" className="text-[clamp(2rem,6vw,4.5rem)] font-bold leading-tight tracking-tight" delay={400}>
            <span className="text-white">& Teknologi </span>
            <span style={{ color: '#f5b731' }}>AI di Bali.</span>
          </RevealText>
        </div>

        <RevealText delay={500}>
          <p className="text-sm sm:text-base lg:text-lg text-white/60 max-w-2xl leading-relaxed">
            Kami membantu jalannya operasional bisnis Anda dari hulu ke hilir—mulai dari legalitas pembukuan, mendatangkan pelanggan lewat digital marketing, hingga efisiensi sistem kerja dengan AI dan aplikasi kustom.
          </p>
        </RevealText>

        <RevealText delay={600}>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <button
              onClick={() => scrollTo('audit')}
              className="px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: '#f5b731', color: '#0f1f3a' }}
            >
              Konsultasi Gratis Sekarang
              <ArrowRight size={16} className="inline ml-2" />
            </button>
            <button
              onClick={() => scrollTo('services')}
              className="px-7 py-3.5 rounded-full text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Eksplorasi Layanan
            </button>
          </div>
        </RevealText>

        <RevealText delay={700}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {stats.map((s, i) => (
              <div key={i} className="p-4 sm:p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">{s.value}</div>
                <div className="text-xs text-white/50 mt-2 leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </RevealText>
      </div>
    </section>
  );
}