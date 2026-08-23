import { db } from "@/api/db";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import Header from '@/components/ipro/Header';
import NavOverlay from '@/components/ipro/NavOverlay';
import Footer from '@/components/ipro/Footer';
import FloatingWhatsApp from '@/components/ipro/FloatingWhatsApp';

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

const CATEGORY_COLORS = {
  Berita: '#1a3a6b',
  Kegiatan: '#f5b731',
  Pengumuman: '#14b8a6',
  Event: '#e0457b',
};

export default function BeritaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setItem(null);
    db.entities.News
      .list('-date', 100)
      .then((data) => {
        const found = data.find((n) => n.slug === slug || slugify(n.title) === slug);
        if (found) setItem(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen" style={{ background: '#fff', fontFamily: "'Onest', sans-serif" }}>
      <Header visible={true} onMenuOpen={() => setNavOpen(true)} />
      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} />

      <main className="pt-20 pb-16">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-gray-300" size={28} />
          </div>
        ) : notFound ? (
          <div className="text-center py-24 px-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Berita tidak ditemukan</h1>
            <p className="text-gray-500 text-sm mb-6">
              Artikel yang Anda cari mungkin telah dihapus atau dipindahkan.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#1a3a6b' }}>
              <ArrowLeft size={16} /> Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <article className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '48rem' }}>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
              <ArrowLeft size={16} /> Kembali
            </Link>
            {item.category && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4"
                style={{ background: `${CATEGORY_COLORS[item.category]}15`, color: CATEGORY_COLORS[item.category] }}
              >
                {item.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
              {item.title}
            </h1>
            {item.date && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Calendar size={14} /> {formatDate(item.date)}
              </div>
            )}
            {item.image_url && (
              <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            {item.excerpt && (
              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6 pb-6 border-b border-gray-100">
                {item.excerpt}
              </p>
            )}
            {item.content && (
              <div
                className="text-gray-700 leading-relaxed
                  [&_a]:text-blue-600 [&_a]:underline
                  [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2
                  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
                  [&_p]:mb-4
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                  [&_li]:mb-1
                  [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            )}
          </article>
        )}
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}