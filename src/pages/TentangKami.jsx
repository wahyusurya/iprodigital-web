import { db } from "@/api/db";

import React, { useState, useEffect } from 'react';

import Header from '@/components/ipro/Header';
import NavOverlay from '@/components/ipro/NavOverlay';
import Footer from '@/components/ipro/Footer';
import FloatingWhatsApp from '@/components/ipro/FloatingWhatsApp';
import RevealText from '@/components/ipro/RevealText';
import { Target, Eye, ArrowRight, Loader2, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import TeamMemberModal from '@/components/ipro/TeamMemberModal';
import GalleryGrid from '@/components/ipro/GalleryGrid';

const ADMIN_WA = '6281999899802';
const CTA_MESSAGE = 'Halo iprodigital! Saya tertarik untuk konsultasi gratis seputar layanan iprodigital.id.';

const DEFAULTS = {
  hero_title: 'Tim Ahli di Balik iprodigital.id',
  hero_subtitle:
    'Sejak 2020, kami berkomitmen menjadi partner pertumbuhan bisnis dari hulu ke hilir—memadukan keahlian di bidang pajak, pemasaran digital, dan teknologi AI untuk mengantarkan UMKM Bali dan Indonesia ke era digital.',
  story_heading: 'Cerita Kami',
  story_title: 'Dari Bali untuk Indonesia, Selaras Hulu ke Hilir',
  story_text:
    'iprodigital.id lahir di bawah naungan PT Bersama Tunas Bangsa, terdaftar resmi di Kota Denpasar, Bali. Kami memulai perjalanan dengan keyakinan sederhana: bisnis tumbuh optimal ketika seluruh prosesnya—dari legalitas pajak hingga pemasaran dan teknologi—berjalan selaras.\nTim kami menyatukan tiga pilar keahlian: konsultasi pajak & pembukuan, digital marketing & SEO, serta pengembangan software & AI agent. Dilengkapi dengan produk SaaS internal seperti huniku dan Kasirku, kami memberikan solusi end-to-end yang terbukti menumbuhkan 50++ klien.\nKini, kami terus berinovasi—menghadirkan otomatisasi cerdas, edukasi digital, dan layanan konsultasi yang dekat dengan kebutuhan pelaku bisnis lokal maupun nasional.',
  stat1_value: '2020',
  stat1_label: 'Tahun Berdiri',
  stat2_value: '50++',
  stat2_label: 'Klien Sukses',
  stat3_value: '3',
  stat3_label: 'Pilar Keahlian Utama',
  stat4_value: '100%',
  stat4_label: 'Terlindungi Hukum',
  vision_text:
    'Menjadi partner terdepan di Bali dan Indonesia yang mengintegrasikan kepatuhan pajak, pemasaran digital, dan teknologi AI dalam satu ekosistem—mengantarkan setiap bisnis tumbuh berkelanjutan dan selaras dari hulu ke hilir.',
  mission_text:
    'Memberikan layanan pajak & pembukuan yang akurat, transparan, dan patuh regulasi.\nMembangun strategi digital marketing berbasis data yang menghasilkan pertumbuhan nyata.\nMenghadirkan solusi software & AI agent yang efisien, kustom, dan terjangkau.\nMemberdayakan pelaku bisnis melalui edukasi digital yang berkesinambungan.',
  value1_title: 'Integritas & Legalitas',
  value1_desc: 'Setiap layanan dijalankan di bawah badan hukum resmi dengan transparansi penuh.',
  value2_title: 'Inovasi Berkelanjutan',
  value2_desc: 'Selalu mengadopsi teknologi terbaru—dari AI hingga otomatisasi—untuk klien.',
  value3_title: 'Solusi End-to-End',
  value3_desc: 'Mencakup seluruh kebutuhan bisnis dari hulu (pajak) hingga hilir (teknologi).',
  team_heading: 'Tim Ahli',
  team_title: 'Orang di Balik iprodigital.id',
  team_subtitle: 'Profesional berpengalaman yang berdedikasi mengantarkan bisnis Anda ke era digital.',
  cta_title: 'Siap Tumbuh Bersama Kami?',
  cta_text: 'Dapatkan audit gratis dan konsultasi langsung dengan tim ahli iprodigital.id.',
};

export default function TentangKami() {
  const [members, setMembers] = useState([]);
  const [content, setContent] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    Promise.all([
      db.entities.TeamMember.list('sort_order', 50),
      db.entities.AboutContent.list(1),
      db.entities.Gallery.filter({ section: 'about' }),
    ])
      .then(([mems, contents, galleries]) => {
        setMembers(mems);
        if (contents.length > 0) setContent(contents[0]);
        if (galleries.length > 0) setGallery(galleries[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const c = { ...DEFAULTS, ...(content || {}) };
  const storyParas = (c.story_text || '').split('\n').filter((p) => p.trim());
  const missionPoints = (c.mission_text || '').split('\n').filter((p) => p.trim());
  const stats = [
    { value: c.stat1_value, label: c.stat1_label, color: '#1a3a6b' },
    { value: c.stat2_value, label: c.stat2_label, color: '#f5b731' },
    { value: c.stat3_value, label: c.stat3_label, color: '#14b8a6' },
    { value: c.stat4_value, label: c.stat4_label, color: '#e0457b' },
  ];
  const values = [
    { icon: ShieldCheck, title: c.value1_title, desc: c.value1_desc, color: '#1a3a6b' },
    { icon: Sparkles, title: c.value2_title, desc: c.value2_desc, color: '#f5b731' },
    { icon: Cpu, title: c.value3_title, desc: c.value3_desc, color: '#14b8a6' },
  ];

  const galleryImages = gallery
    ? [1, 2, 3, 4, 5].map((n) => ({ url: gallery[`image${n}_url`], caption: gallery[`image${n}_caption`] })).filter((img) => img.url)
    : [];

  return (
    <div className="min-h-screen" style={{ background: '#fff', fontFamily: "'Onest', sans-serif" }}>
      <Header visible={true} onMenuOpen={() => setNavOpen(true)} />
      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '60vh', background: '#0f1f3a', borderRadius: '0 0 2rem 2rem' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,31,58,0.95) 0%, rgba(26,58,107,0.88) 100%)' }} />
        <div className="relative z-10 mx-auto px-5 sm:px-6 lg:px-10 pt-32 pb-16 lg:pt-40 lg:pb-20" style={{ maxWidth: '88rem' }}>
          <RevealText>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ background: 'rgba(20,184,166,0.15)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.25)' }}>
              <Sparkles size={13} /> Tentang Kami
            </span>
          </RevealText>
          <RevealText as="h1" className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-tight tracking-tight mt-5" delay={100}>
            {c.hero_title}
          </RevealText>
          <RevealText delay={200}>
            <p className="text-sm sm:text-base text-white/60 max-w-2xl mt-4 leading-relaxed">{c.hero_subtitle}</p>
          </RevealText>
        </div>
      </section>

      {/* Story */}
      <section className="py-10 lg:py-24">
        <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <RevealText>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#1a3a6b' }}>{c.story_heading}</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                {c.story_title}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                {storyParas.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </RevealText>
            <RevealText delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="p-5 sm:p-6 rounded-2xl" style={{ background: '#f9f9f8', border: '1px solid #e6e5e2' }}>
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-2 leading-relaxed">{s.label}</div>
                  </div>
                ))}
              </div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-10 lg:py-20" style={{ background: '#f9f9f8' }}>
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

      {/* Vision & Mission */}
      <section className="py-10 lg:py-24" style={{ background: '#0f1f3a' }}>
        <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <RevealText>
              <div className="rounded-2xl p-7 sm:p-8 lg:p-10 h-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(245,183,49,0.15)' }}>
                  <Eye size={22} style={{ color: '#f5b731' }} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Visi</h3>
                <p className="text-sm text-white/60 leading-relaxed">{c.vision_text}</p>
              </div>
            </RevealText>
            <RevealText delay={150}>
              <div className="rounded-2xl p-7 sm:p-8 lg:p-10 h-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(20,184,166,0.15)' }}>
                  <Target size={22} style={{ color: '#14b8a6' }} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Misi</h3>
                <ul className="space-y-2.5 text-sm text-white/60 leading-relaxed">
                  {missionPoints.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <span style={{ color: '#14b8a6' }}>•</span> {point}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealText>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 lg:mt-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <RevealText key={i} delay={i * 100}>
                  <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Icon size={20} style={{ color: v.color }} className="mb-3" />
                    <h4 className="text-sm font-bold text-white mb-1.5">{v.title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{v.desc}</p>
                  </div>
                </RevealText>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-10 lg:py-24">
        <div className="mx-auto px-5 sm:px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
          <div className="text-center mb-10 lg:mb-14">
            <RevealText>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#1a3a6b' }}>{c.team_heading}</p>
            </RevealText>
            <RevealText as="h2" className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-900" delay={100}>
              {c.team_title}
            </RevealText>
            <RevealText delay={200}>
              <p className="text-sm text-gray-500 max-w-xl mx-auto mt-4">{c.team_subtitle}</p>
            </RevealText>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-gray-300" size={28} />
            </div>
          ) : members.length === 0 ? null : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((m, i) => (
                <RevealText key={m.id} delay={i * 80}>
                  <div
                    onClick={() => setSelectedMember(m)}
                    className="rounded-2xl overflow-hidden h-full group cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{ background: '#f9f9f8', border: '1px solid #e6e5e2' }}
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      {m.image_url ? (
                        <img src={m.image_url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: '#e6e5e2' }}>
                          <span className="text-3xl font-bold text-gray-400">{m.name?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 tracking-tight">{m.name}</h3>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: '#1a3a6b' }}>{m.role}</p>
                      {m.bio && <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3">{m.bio}</p>}
                      <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold transition-colors" style={{ color: '#1a3a6b' }}>
                        Lihat Selengkapnya
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </RevealText>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 lg:py-20" style={{ background: '#f9f9f8' }}>
        <div className="mx-auto px-5 sm:px-6 lg:px-10 text-center" style={{ maxWidth: '52rem' }}>
          <RevealText as="h2" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            {c.cta_title}
          </RevealText>
          <RevealText delay={100}>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">{c.cta_text}</p>
          </RevealText>
          <RevealText delay={200}>
            <a
              href={`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(CTA_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 mt-6"
              style={{ background: '#1a3a6b', color: '#fff' }}
            >
              Konsultasi Gratis <ArrowRight size={16} />
            </a>
          </RevealText>
        </div>
      </section>

      <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}