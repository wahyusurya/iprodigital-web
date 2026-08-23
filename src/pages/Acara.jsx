import { db } from "@/api/db";

import React, { useState, useEffect } from 'react';

import Header from '@/components/ipro/Header';
import NavOverlay from '@/components/ipro/NavOverlay';
import Footer from '@/components/ipro/Footer';
import FloatingWhatsApp from '@/components/ipro/FloatingWhatsApp';
import RevealText from '@/components/ipro/RevealText';
import { Calendar, Clock, MapPin, ArrowRight, Loader2, Video, Maximize2 } from 'lucide-react';
import EventImageModal from '@/components/ipro/EventImageModal';
import EventRegisterModal from '@/components/ipro/EventRegisterModal';
import GalleryGrid from '@/components/ipro/GalleryGrid';

const TYPE_COLORS = {
  Webinar: '#1a3a6b',
  Workshop: '#f5b731',
  Seminar: '#14b8a6',
  Bootcamp: '#e0457b',
};

function formatDateFull(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatMonthShort(dateStr) {
  if (!dateStr) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return months[new Date(dateStr).getMonth()];
}

export default function Acara() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(null);
  const [registerEvent, setRegisterEvent] = useState(null);
  const [gallery, setGallery] = useState(null);

  useEffect(() => {
    Promise.all([
      db.entities.Event.list('-date', 50),
      db.entities.Gallery.filter({ section: 'acara' }),
    ])
      .then(([data, galleries]) => {
        setItems(data.filter((e) => e.is_published));
        if (galleries.length > 0) setGallery(galleries[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const galleryImages = gallery
    ? [1, 2, 3, 4, 5].map((n) => ({ url: gallery[`image${n}_url`], caption: gallery[`image${n}_caption`] })).filter((img) => img.url)
    : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = items
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = items
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen" style={{ background: '#fff', fontFamily: "'Onest', sans-serif" }}>
      <Header visible={true} onMenuOpen={() => setNavOpen(true)} />
      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '60vh', background: '#0f1f3a', borderRadius: '0 0 2rem 2rem' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,31,58,0.95) 0%, rgba(26,58,107,0.88) 100%)' }} />
        <div className="relative z-10 mx-auto px-5 sm:px-6 lg:px-10 pt-32 pb-16 lg:pt-40 lg:pb-20" style={{ maxWidth: '88rem' }}>
          <RevealText>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ background: 'rgba(245,183,49,0.15)', color: '#f5b731', border: '1px solid rgba(245,183,49,0.25)' }}>
              <Calendar size={13} /> Kalender Acara
            </span>
          </RevealText>
          <RevealText as="h1" className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-tight tracking-tight mt-5" delay={100}>
            Webinar & Workshop <span style={{ color: '#f5b731' }}>Edukasi Digital</span>
          </RevealText>
          <RevealText delay={200}>
            <p className="text-sm sm:text-base text-white/60 max-w-2xl mt-4 leading-relaxed">
              Ikuti sesi edukasi langsung dari tim ahli iprodigital.id. Dapatkan wawasan praktis seputar pajak, digital marketing, AI, dan transformasi digital untuk mengembangkan bisnis Anda.
            </p>
          </RevealText>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-10 lg:py-20">
        <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
          <RevealText>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Acara Mendatang
            </h2>
            <p className="text-sm text-gray-500 mb-8 lg:mb-12">Jangan lewatkan kesempatan untuk belajar dan berkembang bersama kami.</p>
          </RevealText>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-gray-300" size={28} />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: '#f9f9f8', border: '1px solid #e6e5e2' }}>
              <Calendar size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">Belum ada acara mendatang. Pantau halaman ini secara berkala!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  delay={i * 80}
                  onImageClick={() => setImageZoom(event.image_url)}
                  onRegister={() => setRegisterEvent(event)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {!loading && past.length > 0 && (
        <section className="py-10 lg:py-20" style={{ background: '#f9f9f8' }}>
          <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
            <RevealText>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Acara Sebelumnya
              </h2>
              <p className="text-sm text-gray-500 mb-8 lg:mb-12">Menjelajah kembali rekam jejak edukasi kami.</p>
            </RevealText>
            <div className="space-y-3">
              {past.slice(0, 6).map((event) => {
                const color = TYPE_COLORS[event.event_type] || '#1a3a6b';
                return (
                  <div key={event.id} className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-white" style={{ border: '1px solid #e6e5e2' }}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ background: `${color}15`, color }}>
                      <span className="text-lg sm:text-xl font-bold leading-none">{new Date(event.date).getDate()}</span>
                      <span className="text-[10px] uppercase mt-0.5">{formatMonthShort(event.date)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: `${color}15`, color }}>{event.event_type}</span>
                        {event.is_online && <Video size={12} className="text-gray-400" />}
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{event.title}</h3>
                      <p className="text-xs text-gray-400 truncate">{event.start_time} WITA • {event.location || 'Online'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-10 lg:py-20">
          <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
            <div className="mb-8 lg:mb-12">
              {gallery.heading && (
                <RevealText as="h2" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                  {gallery.heading}
                </RevealText>
              )}
              {gallery.subtitle && (
                <RevealText delay={100}>
                  <p className="text-sm text-gray-500 mt-3">{gallery.subtitle}</p>
                </RevealText>
              )}
            </div>
            <RevealText delay={200}>
              <GalleryGrid images={galleryImages} />
            </RevealText>
          </div>
        </section>
      )}

      <EventImageModal src={imageZoom} onClose={() => setImageZoom(null)} />
      <EventRegisterModal event={registerEvent} onClose={() => setRegisterEvent(null)} />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function EventCard({ event, delay = 0, onImageClick, onRegister }) {
  const color = TYPE_COLORS[event.event_type] || '#1a3a6b';
  const d = event.date ? new Date(event.date) : null;
  const isFree = (event.price || 'Gratis') === 'Gratis';

  return (
    <RevealText delay={delay}>
      <article
        className="rounded-2xl overflow-hidden h-full flex flex-col group"
        style={{ background: '#fff', border: '1px solid #e6e5e2', transition: 'box-shadow 0.3s, transform 0.3s' }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {event.image_url ? (
          <div className="aspect-[16/9] overflow-hidden relative cursor-pointer" onClick={onImageClick}>
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(255,255,255,0.9)' }}>
              <Maximize2 size={15} className="text-gray-800" />
            </div>
            {d && (
              <div className="absolute top-3 left-3 w-14 h-14 rounded-xl flex flex-col items-center justify-center" style={{ background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
                <span className="text-xl font-bold leading-none" style={{ color }}>{d.getDate()}</span>
                <span className="text-[10px] uppercase mt-0.5 text-gray-500">{formatMonthShort(event.date)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[16/9] flex items-center justify-center" style={{ background: `${color}10` }}>
            <Calendar size={40} style={{ color }} />
          </div>
        )}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" style={{ background: `${color}15`, color }}>{event.event_type}</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" style={{ background: isFree ? 'rgba(20,184,166,0.15)' : 'rgba(245,183,49,0.15)', color: isFree ? '#14b8a6' : '#f5b731' }}>
              {event.price || 'Gratis'}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">{event.excerpt}</p>
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar size={12} className="text-gray-400 shrink-0" />
              {formatDateFull(event.date)}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} className="text-gray-400 shrink-0" />
              {event.start_time}{event.end_time ? ` - ${event.end_time}` : ''} WITA
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {event.is_online ? <Video size={12} className="text-gray-400 shrink-0" /> : <MapPin size={12} className="text-gray-400 shrink-0" />}
              {event.location || (event.is_online ? 'Online via Zoom' : 'Lokasi TBD')}
            </div>
          </div>
          <button
            onClick={onRegister}
            className="mt-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full"
            style={{ background: color, color: '#fff' }}
          >
            Daftar Sekarang <ArrowRight size={14} />
          </button>
        </div>
      </article>
    </RevealText>
  );
}