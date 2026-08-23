
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Instagram, Youtube, Facebook, MessageCircle, Lock } from 'lucide-react';
import TikTokIcon from '@/components/ipro/TikTokIcon';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const quickLinks = [
  { label: 'Beranda', id: 'home' },
  { label: 'Layanan Jasa', id: 'services' },
  { label: 'Produk SaaS', id: 'products' },
  { label: 'Portofolio', id: 'works' },
  { label: 'Kalender Acara', path: '/acara' },
  { label: 'Tentang Kami', path: '/tentang-kami' },
  { label: 'Audit & Kontak', id: 'audit' },
];

const productLinks = [
  { label: 'huniku — Property Management', id: 'products' },
  { label: 'Kasirku — POS & CRM', id: 'products' },
];

export default function Footer() {
  const settings = useSiteSettings();
  const s = settings || {};

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
  };

  const socialLinks = [
    { key: 'wa', href: s.whatsapp_number ? `https://wa.me/${s.whatsapp_number.replace(/[^0-9]/g, '')}` : null, Icon: MessageCircle },
    { key: 'ig', href: s.instagram_url, Icon: Instagram },
    { key: 'tt', href: s.tiktok_url, Icon: TikTokIcon },
    { key: 'yt', href: s.youtube_url, Icon: Youtube },
    { key: 'gmaps', href: s.gmaps_url, Icon: MapPin },
    { key: 'fb', href: s.facebook_url, Icon: Facebook },
  ].filter((item) => item.href);

  const waContacts = [
    s.whatsapp_number && s.whatsapp_label ? { number: s.whatsapp_number, label: s.whatsapp_label, role: s.whatsapp_role } : null,
    s.whatsapp_number_2 && s.whatsapp_label_2 ? { number: s.whatsapp_number_2, label: s.whatsapp_label_2, role: s.whatsapp_role_2 } : null,
  ].filter(Boolean);

  return (
    <footer style={{ background: '#0a0a0a', color: '#fff' }}>
      <div className="mx-auto px-6 lg:px-10 py-16 lg:py-20" style={{ maxWidth: '88rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <img
                src="/brand/iproid-logo.png"
                alt="iprodigital.id logo"
                className="h-[30px] sm:h-9 w-auto"
              />
              <span className="font-bold text-lg tracking-tight">iprodigital.id</span>
            </div>
            {s.footer_description && (
              <p className="text-sm text-white/50 leading-relaxed max-w-md">{s.footer_description}</p>
            )}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-5">
                {socialLinks.map((item) => {
                  const Icon = item.Icon;
                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide mb-5" style={{ color: '#f5b731' }}>Navigasi</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.id || l.path}>
                  {l.path ? (
                    <Link to={l.path} className="text-sm text-white/50 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  ) : (
                    <button onClick={() => scrollTo(l.id)} className="text-sm text-white/50 hover:text-white transition-colors">
                      {l.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide mb-5" style={{ color: '#14b8a6' }}>Produk</h4>
            <ul className="space-y-3">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <button onClick={() => scrollTo(l.id)} className="text-sm text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact bar */}
        {(s.footer_location || waContacts.length > 0) && (
          <div className="mt-12 lg:mt-14 pt-8 border-t border-white/10">
            <div className="flex flex-col gap-4">
              {s.footer_location && (
                <span className="flex items-center gap-2 text-sm text-white/50">
                  <MapPin size={14} className="text-white/30 shrink-0" />
                  {s.footer_location}
                </span>
              )}
              {waContacts.length > 0 && (
                <div className="flex flex-col gap-2.5 pl-6">
                  {waContacts.map((wa, i) => (
                    <a key={i} href={`https://wa.me/${wa.number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                      <Phone size={14} className="text-white/30 shrink-0" />
                      <span>{wa.label}</span>
                      {wa.role && <span className="text-xs text-white/30">({wa.role})</span>}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} PT Bersama Tunas Bangsa. Seluruh hak cipta dilindungi undang-undang. iprodigital.id, huniku, dan Kasirku adalah merek dagang terdaftar.
          </p>
          <Link to="/admin" className="flex items-center gap-1.5 text-xs text-white/20 hover:text-white/50 transition-colors shrink-0">
            <Lock size={11} /> Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}