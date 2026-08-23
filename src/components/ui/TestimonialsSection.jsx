import React from 'react';
import RevealText from '@/components/ipro/RevealText';
import { Star, ShieldCheck } from 'lucide-react';

const reviews = [
  { name: 'Ikhsan', text: 'Sistem pembukuan dan perpajakan perusahaan kami jadi jauh lebih rapi dan transparan sejak didampingi tim iprodigital.id.' },
  { name: 'Winanta', text: 'Landing page dan SEO lokal untuk bisnis villa kami mendatangkan tamu asing konsisten tanpa boncos iklan.' },
  { name: 'Aisa', text: 'Kasirku ngebantu banget pencatatan cabang butik kuliner kami. Integrasi QRIS-nya instan.' },
  { name: 'Ade Novi', text: 'Otomatisasi WhatsApp billing dari huniku sangat menghemat waktu penagihan operasional kos.' },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} fill="#f5b731" stroke="#f5b731" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32" style={{ background: '#f9f9f8' }}>
      <div className="mx-auto px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
        <RevealText>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f5b731' }}>Bukti Sosial</p>
        </RevealText>
        <RevealText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-14" delay={100}>
          Apa Kata Klien Kami
        </RevealText>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, i) => (
            <RevealText key={i} delay={200 + i * 80}>
              <div className="rounded-2xl p-6 h-full flex flex-col" style={{ background: '#fff', border: '1px solid #e6e5e2' }}>
                <Stars />
                <p className="text-sm text-gray-600 leading-relaxed mt-4 flex-1">"{r.text}"</p>
                <div className="mt-5 pt-4 flex items-center gap-3" style={{ borderTop: '1px solid #e6e5e2' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#1a3a6b' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">Google Review ★★★★★</p>
                  </div>
                </div>
              </div>
            </RevealText>
          ))}
        </div>

        {/* Legal trust badge */}
        <RevealText delay={600}>
          <div className="mt-16 rounded-2xl p-8 lg:p-10 text-center" style={{ background: '#fff', border: '1px solid #e6e5e2' }}>
            <ShieldCheck size={40} className="mx-auto mb-4" style={{ color: '#1a3a6b' }} />
            <p className="text-lg font-bold text-gray-900">Di bawah naungan hukum resmi PT Bersama Tunas Bangsa</p>
            <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
              Terdaftar resmi dengan alamat operasional di Kota Denpasar, Bali. Menjamin keamanan data, legalitas mutlak, dan profesionalisme tingkat korporat.
            </p>
          </div>
        </RevealText>
      </div>
    </section>
  );
}