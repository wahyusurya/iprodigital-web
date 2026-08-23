import React from 'react';
import RevealText from '@/components/ipro/RevealText';

const pills = ['Pajak & Hukum', 'Digital Marketing', 'SEO Lokal Bali', 'Software House', 'AI Agent & Otomatisasi', 'SaaS Ecosystem'];

export default function AboutSection() {
  const doubled = [...pills, ...pills, ...pills, ...pills];

  return (
    <section className="py-10 lg:py-28 overflow-hidden">
      <div className="mx-auto px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
        <RevealText>
          <p className="text-xl sm:text-2xl lg:text-4xl font-bold leading-relaxed sm:leading-snug tracking-tight text-gray-900 max-w-5xl">
            Membangun bisnis di era modern membutuhkan{' '}
            <span style={{ color: '#1a3a6b' }}>sinkronisasi mutlak</span> antara kepatuhan hukum, visibilitas pasar, dan{' '}
            <span style={{ color: '#f5b731' }}>efisiensi teknologi digital.</span>
          </p>
        </RevealText>
      </div>

      <div className="mt-10 lg:mt-16 relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((p, i) => (
            <React.Fragment key={i}>
              <span className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium mx-1.5 sm:mx-2 whitespace-nowrap" style={{ background: '#f1f0ee', color: '#111' }}>
                {p}
              </span>
              <span className="inline-flex items-center text-base sm:text-xl mx-1.5 sm:mx-2" style={{ color: '#f5b731' }}>✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}