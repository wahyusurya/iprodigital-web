import { db } from "@/api/db";

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import RevealText from '@/components/ipro/RevealText';
import Carousel from '@/components/ipro/Carousel';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';

const ITEM_CLASS =
  'snap-start shrink-0 w-[78%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3rem)/3)]';

const CATEGORY_COLORS = {
  Berita: '#1a3a6b',
  Kegiatan: '#f5b731',
  Pengumuman: '#14b8a6',
  Event: '#e0457b',
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function NewsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    db.entities.News
      .list('-date', 10)
      .then((data) => setItems(data.filter((n) => n.is_published)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (n) =>
        n.title?.toLowerCase().includes(q) ||
        n.excerpt?.toLowerCase().includes(q) ||
        n.category?.toLowerCase().includes(q)
    );
  }, [items, search]);

  if (!loading && items.length === 0) return null;

  return (
    <section id="news" className="py-10 lg:py-28" style={{ background: '#fff' }}>
      <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <RevealText>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#1a3a6b' }}>
                Berita & Kegiatan
              </p>
            </RevealText>
            <RevealText
              as="h2"
              className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-900"
              delay={100}
            >
              Kabar Terbaru iprodigital.id
            </RevealText>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-gray-300" size={28} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            Tidak ada berita untuk &ldquo;{search}&rdquo;
          </div>
        ) : (
          <Carousel>
            {filtered.map((item) => {
              const color = CATEGORY_COLORS[item.category] || '#1a3a6b';
              const slug = item.slug || slugify(item.title);
              return (
                <Link
                  key={item.id}
                  to={`/berita/${slug}`}
                  data-carousel-item
                  className={`${ITEM_CLASS} block`}
                >
                  <article
                    className="rounded-2xl overflow-hidden h-full flex flex-col group cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{ background: '#f9f9f8', border: '1px solid #e6e5e2' }}
                  >
                    {item.image_url && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          style={{ transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}
                        />
                      </div>
                    )}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                          style={{ background: `${color}15`, color }}
                        >
                          {item.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={11} />
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                        {item.excerpt}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                        Baca selengkapnya{' '}
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </Carousel>
        )}
      </div>
    </section>
  );
}