import { db } from "@/api/db";

import React, { useState, useEffect, useMemo } from 'react';

import RevealText from '@/components/ipro/RevealText';
import Carousel from '@/components/ipro/Carousel';
import { ArrowUpRight, Loader2, Search, X } from 'lucide-react';

const ITEM_CLASS =
  'snap-start shrink-0 w-[78%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3rem)/3)]';

export default function PortfolioSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    db.entities.Portfolio
      .list('sort_order', 50)
      .then((data) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setItems(shuffled);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (w) =>
        w.title?.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q) ||
        w.category?.toLowerCase().includes(q) ||
        w.client_name?.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <section id="works" className="py-10 lg:py-28" style={{ background: '#fff' }}>
      <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
        <RevealText>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#1a3a6b' }}>
            Portofolio
          </p>
        </RevealText>
        <RevealText
          as="h2"
          className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-900"
          delay={100}
        >
          Bukti Nyata Hasil Kolaborasi Kami
        </RevealText>

        <RevealText delay={200}>
          <div className="relative mt-6 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari proyek, kategori, atau klien..."
              className="w-full pl-11 pr-10 py-3 rounded-full text-sm bg-white border border-gray-200 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all duration-300 placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Hapus pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </RevealText>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-gray-300" size={28} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada portofolio. Tambahkan melalui panel admin.'}
          </div>
        ) : (
          <div className="mt-10 lg:mt-14">
            <Carousel>
              {filtered.map((w) => (
                <div key={w.id} data-carousel-item className={ITEM_CLASS}>
                  <div
                    className="rounded-2xl overflow-hidden group cursor-pointer h-full transition-all duration-300 hover:shadow-lg"
                    style={{ background: '#f9f9f8', border: '1px solid #e6e5e2' }}
                  >
                    {w.image_url && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={w.image_url}
                          alt={w.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          style={{ transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}
                        />
                      </div>
                    )}
                    <div className="p-5 sm:p-6">
                      {w.category && (
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                          style={{ background: 'rgba(26,58,107,0.08)', color: '#1a3a6b' }}
                        >
                          {w.category}
                        </span>
                      )}
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 mb-1 group-hover:text-blue-900 transition-colors">
                        {w.title}
                        <ArrowUpRight
                          size={16}
                          className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </h3>
                      {w.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{w.description}</p>
                      )}
                      {w.outcome && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-semibold" style={{ color: '#f5b731' }}>
                            {w.outcome}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}