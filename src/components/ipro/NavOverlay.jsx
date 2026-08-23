import React from 'react';
import { Link } from 'react-router-dom';
import { X, MessageCircle, Instagram, Youtube, Facebook, MapPin } from 'lucide-react';
import { NAV_ITEMS } from '@/components/ipro/Header';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import TikTokIcon from '@/components/ipro/TikTokIcon';

export default function NavOverlay({ open, onClose }) {
  const settings = useSiteSettings();
  const s = settings || {};
  const scrollTo = (id) => {
    onClose();
    setTimeout(() => {
      if (window.location.pathname !== '/') {
        window.location.href = `/#${id}`;
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      }
    }, 400);
  };

  let animIndex = 0;
  const animStyle = () => ({
    transitionDelay: open ? `${animIndex++ * 60}ms` : '0ms',
    transform: open ? 'translateY(0)' : 'translateY(2rem)',
    opacity: open ? 1 : 0,
  });

  const socials = [
    { key: 'wa', href: s.whatsapp_number ? `https://wa.me/${s.whatsapp_number.replace(/[^0-9]/g, '')}` : null, Icon: MessageCircle },
    { key: 'ig', href: s.instagram_url, Icon: Instagram },
    { key: 'tt', href: s.tiktok_url, Icon: TikTokIcon },
    { key: 'yt', href: s.youtube_url, Icon: Youtube },
    { key: 'gmaps', href: s.gmaps_url, Icon: MapPin },
    { key: 'fb', href: s.facebook_url, Icon: Facebook },
  ].filter((item) => item.href);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-500 overflow-y-auto py-16"
      style={{
        background: 'rgba(10, 25, 55, 0.97)',
        backdropFilter: 'blur(20px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X size={20} className="text-white" />
      </button>

      <nav className="flex flex-col items-center gap-5">
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            return (
              <div key={item.label} className="flex flex-col items-center gap-2.5 mb-1">
                <span
                  className="text-[11px] font-semibold tracking-widest uppercase text-yellow-400/60 transition-all duration-300"
                  style={animStyle()}
                >
                  {item.label}
                </span>
                <div className="flex flex-col items-center gap-2.5">
                  {item.children.map((child) => {
                    const style = animStyle();
                    return child.path ? (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={onClose}
                        className="text-2xl md:text-3xl font-bold text-white/80 hover:text-yellow-400 transition-all duration-300 tracking-tight"
                        style={style}
                      >
                        {child.label}
                      </Link>
                    ) : (
                      <button
                        key={child.id}
                        onClick={() => scrollTo(child.id)}
                        className="text-2xl md:text-3xl font-bold text-white/80 hover:text-yellow-400 transition-all duration-300 tracking-tight"
                        style={style}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
          const style = animStyle();
          return item.path ? (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="text-3xl md:text-5xl font-bold text-white/80 hover:text-yellow-400 transition-all duration-300 tracking-tight"
              style={style}
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-3xl md:text-5xl font-bold text-white/80 hover:text-yellow-400 transition-all duration-300 tracking-tight"
              style={style}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-10 text-center">
        <p className="text-white/40 text-sm">PT Bersama Tunas Bangsa</p>
        {s.footer_location && (
          <p className="text-white/30 text-xs mt-1">{s.footer_location}</p>
        )}
        {socials.length > 0 && (
          <div className="flex justify-center items-center gap-3 mt-4">
            {socials.map((item) => {
              const Icon = item.Icon;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}