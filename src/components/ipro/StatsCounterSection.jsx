import React, { useRef, useEffect, useState } from 'react';
import RevealText from '@/components/ipro/RevealText';
import { TrendingUp, Users, Rocket, Award } from 'lucide-react';

const metrics = [
  { icon: Users, value: 120, suffix: '+', label: 'Klien Terlayani', sublabel: 'UMKM hingga korporat' },
  { icon: TrendingUp, value: 340, suffix: '%', label: 'Rata-rata Pertumbuhan Trafik', sublabel: 'Dalam 6 bulan pertama' },
  { icon: Rocket, value: 50, suffix: '+', label: 'Proyek Digital Selesai', sublabel: 'Website, app & otomatisasi' },
  { icon: Award, value: 8, suffix: '', label: 'Tahun Pengalaman', sublabel: 'Ekosistem digital Bali' },
];

function useCountUp(target, start, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo for a natural deceleration
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return count;
}

function MetricCard({ metric, start, index }) {
  const count = useCountUp(metric.value, start);
  const Icon = metric.icon;

  return (
    <RevealText delay={index * 120}>
      <div
        className="rounded-2xl p-5 sm:p-6 lg:p-8 h-full text-center"
        style={{ background: '#fff', border: '1px solid #e6e5e2' }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(26,58,107,0.08)' }}
        >
          <Icon size={22} style={{ color: '#1a3a6b' }} />
        </div>
        <div className="flex items-baseline justify-center gap-0.5">
          <span
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: '#1a3a6b' }}
          >
            {count}
          </span>
          <span
            className="text-xl sm:text-2xl lg:text-3xl font-bold"
            style={{ color: '#f5b731' }}
          >
            {metric.suffix}
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-900">{metric.label}</p>
        <p className="mt-1 text-xs text-gray-400">{metric.sublabel}</p>
      </div>
    </RevealText>
  );
}

export default function StatsCounterSection() {
  const ref = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-10 lg:py-28"
      style={{ background: '#f9f9f8' }}
    >
      <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
        <RevealText>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: '#f5b731' }}
          >
            Hasil Berbicara
          </p>
        </RevealText>
        <RevealText
          as="h2"
          className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 max-w-3xl"
          delay={100}
        >
          Pertumbuhan Nyata yang Kami Hasilkan untuk Klien
        </RevealText>
        <RevealText delay={200}>
          <p className="text-sm sm:text-base text-gray-500 mt-4 max-w-2xl">
            Bukan janji, melainkan angka. Inilah dampak kolaborasi iprodigital.id
            dalam membantu bisnis tumbuh secara digital.
          </p>
        </RevealText>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-10 lg:mt-14">
          {metrics.map((m, i) => (
            <MetricCard key={i} metric={m} start={start} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}