import React, { useState } from 'react';
import RevealText from '@/components/ipro/RevealText';
import { Briefcase, Target, Bot, ArrowUpRight } from 'lucide-react';

const pillars = [
  {
    icon: Briefcase,
    emoji: '💼',
    title: 'Pendampingan Pajak & Pembukuan',
    tagline: 'Keuangan Rapi, Bisnis Tenang & Patuh Hukum.',
    description: 'Layanan penyusunan laporan keuangan harian, rekonsiliasi bank, perhitungan dan pelaporan SPT Pajak bulanan/tahunan (PPh & PPN), serta asistensi kepatuhan pajak untuk badan usaha (PT/CV) maupun perorangan di Bali.',
    price: 'Mulai dari Rp 1.000.000 / bulan',
    note: 'Disesuaikan dengan volume transaksi & omset',
    color: '#1a3a6b',
    lightBg: 'rgba(26,58,107,0.06)',
  },
  {
    icon: Target,
    emoji: '🎯',
    title: 'Digital Marketing, Website & Jasa SEO',
    tagline: 'Dominasi Pasar Digital & Lipatgandakan Penjualan.',
    description: 'Jasa pembuatan website profesional yang ultra-cepat, responsif, dan ramah SEO. Dikombinasikan dengan manajemen iklan digital (Google Ads & Social Media Ads) serta optimasi SEO lokal untuk mendatangkan pelanggan siap beli ke bisnis kuliner, pariwisata, kontraktor, dan real estate Anda.',
    price: 'Mulai dari Rp 1.500.000',
    note: 'Paket landing page instan s.d optimasi iklan berkala',
    color: '#f5b731',
    lightBg: 'rgba(245,183,49,0.08)',
  },
  {
    icon: Bot,
    emoji: '🤖',
    title: 'Software House, AI Agent & Otomatisasi',
    tagline: 'Modernisasi Operasional dengan Teknologi Masa Depan.',
    description: 'Pengembangan aplikasi berbasis web dan mobile (iOS/Android) kustom sesuai kebutuhan unik alur kerja internal Anda. Kami juga mengintegrasikan sistem kecerdasan buatan (AI Agent & Automation) untuk mengotomatisasi pencatatan data dan layanan pelanggan 24/7 tanpa jeda.',
    price: 'Mulai dari Rp 1.500.000',
    note: 'Berbasis arsitektur sistem dan kompleksitas modul',
    color: '#14b8a6',
    lightBg: 'rgba(20,184,166,0.06)',
  },
];

export default function ServicesSection() {
  const [hovered, setHovered] = useState(null);

  const scrollToAudit = () => {
    const el = document.getElementById('audit');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-10 lg:py-28" style={{ background: '#f5f5f4' }}>
      <div className="mx-auto px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
        <RevealText>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f5b731' }}>Pilar Utama</p>
        </RevealText>
        <RevealText as="h2" className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-900" delay={100}>
          Solusi Spesialisasi Kustom Kami
        </RevealText>
        <RevealText delay={200}>
          <p className="text-base text-gray-500 mt-4 max-w-xl">Pilih salah satu dari tiga pilar pendorong profitabilitas bisnis Anda.</p>
        </RevealText>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mt-10 lg:mt-14">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            const isHovered = hovered === i;
            return (
              <RevealText key={i} delay={250 + i * 100}>
                <div
                  onClick={scrollToAudit}
                  className="rounded-2xl p-5 sm:p-7 lg:p-8 h-full transition-all duration-500 cursor-pointer group relative overflow-hidden ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    background: isHovered ? p.color : '#ffffff',
                    color: isHovered ? '#fff' : '#111',
                    border: `1px solid ${isHovered ? p.color : '#e6e5e2'}`,
                    transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: isHovered
                      ? '0 24px 48px -12px rgba(0,0,0,0.18)'
                      : '0 1px 3px rgba(0,0,0,0.04)',
                    willChange: 'transform',
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: isHovered ? 'rgba(255,255,255,0.15)' : p.lightBg }}>
                      {p.emoji}
                    </div>
                    <ArrowUpRight size={20} className="transition-transform duration-300" style={{ opacity: isHovered ? 1 : 0.3, transform: isHovered ? 'translate(2px, -2px)' : 'none' }} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2">{p.title}</h3>
                  <p className="text-sm font-medium mb-4" style={{ opacity: 0.7 }}>{p.tagline}</p>
                  <p className="text-sm leading-relaxed mb-5" style={{ opacity: 0.6 }}>{p.description}</p>

                  <div className="mt-auto pt-4" style={{ borderTop: `1px solid ${isHovered ? 'rgba(255,255,255,0.2)' : '#e6e5e2'}` }}>
                    <p className="text-sm font-bold">{p.price}</p>
                    <p className="text-xs mt-1" style={{ opacity: 0.5 }}>{p.note}</p>
                  </div>
                </div>
              </RevealText>
            );
          })}
        </div>
      </div>
    </section>
  );
}