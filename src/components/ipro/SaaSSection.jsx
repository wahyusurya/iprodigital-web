import { db } from "@/api/db";

import React, { useState, useEffect } from 'react';

import RevealText from '@/components/ipro/RevealText';
import Carousel from '@/components/ipro/Carousel';
import { ArrowRight, Box, Loader2 } from 'lucide-react';

const ITEM_CLASS =
  'snap-start shrink-0 w-[78%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3rem)/3)]';

export default function SaaSSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.SaaSProduct
      .list('sort_order', 20)
      .then((data) => setProducts(data.filter((p) => p.status === 'active')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openLink = (link) => {
    if (link) window.open(link, '_blank');
  };

  return (
    <section
      id="products"
      className="py-10 lg:py-28"
      style={{ background: '#0a0a0a', color: '#fff' }}
    >
      <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
        <RevealText>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#14b8a6' }}>
            Produk SaaS
          </p>
        </RevealText>
        <RevealText
          as="h2"
          className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight"
          delay={100}
        >
          Akselerasi Efisiensi Bisnis dengan Software Modular Kami
        </RevealText>
        <RevealText delay={200}>
          <div
            className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: 'rgba(20,184,166,0.15)',
              color: '#14b8a6',
              border: '1px solid rgba(20,184,166,0.25)',
            }}
          >
            Mulai dari Rp 349.000 / bulan
          </div>
        </RevealText>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-white/30" size={28} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">
            Belum ada produk. Tambahkan melalui panel admin.
          </div>
        ) : (
          <div className="mt-10 lg:mt-14">
            <Carousel dark center={products.length < 3}>
              {products.map((p) => {
                const features = (p.features || '')
                  .split(',')
                  .map((f) => f.trim())
                  .filter(Boolean);
                const accent = p.accent_color || '#1a3a6b';
                return (
                  <div key={p.id} data-carousel-item className={ITEM_CLASS}>
                    <div
                      className="rounded-2xl overflow-hidden h-full transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: '#141414',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {p.image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                            style={{ transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}
                          />
                        </div>
                      )}
                      <div className="p-5 sm:p-7 lg:p-8">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: `${accent}25` }}
                            >
                              <Box size={18} style={{ color: accent }} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-bold truncate">{p.name}</h3>
                              {p.tagline && (
                                <p className="text-xs text-white/40 truncate">{p.tagline}</p>
                              )}
                            </div>
                          </div>
                          {p.badge && (
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0"
                              style={{ background: 'rgba(245,183,49,0.15)', color: '#f5b731' }}
                            >
                              {p.badge}
                            </span>
                          )}
                        </div>
                        {p.description && (
                          <p className="text-sm text-white/50 mb-4 leading-relaxed">
                            {p.description}
                          </p>
                        )}
                        {features.length > 0 && (
                          <ul className="space-y-2.5 my-5">
                            {features.map((f, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-white/70 leading-relaxed flex gap-2"
                              >
                                <span style={{ color: accent }} className="mt-0.5 shrink-0">
                                  ✓
                                </span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                        {p.cta_label && (
                          <button
                            onClick={() => openLink(p.cta_link)}
                            className="w-full px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            style={{ background: '#fff', color: '#0a0a0a' }}
                          >
                            {p.cta_label} <ArrowRight size={16} className="inline ml-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}