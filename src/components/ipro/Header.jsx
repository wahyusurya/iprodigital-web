
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const NAV_ITEMS = [
  { label: 'Beranda', id: 'home' },
  { label: 'Tentang Kami', path: '/tentang-kami' },
  {
    label: 'Layanan & Karya',
    children: [
      { label: 'Layanan Jasa', id: 'services' },
      { label: 'Produk SaaS', id: 'products' },
      { label: 'Portofolio', id: 'works' },
    ],
  },
  {
    label: 'Kisah & Acara',
    children: [
      { label: 'Kisah Sukses', id: 'success-stories' },
      { label: 'Berita', id: 'news' },
      { label: 'Acara', path: '/acara' },
    ],
  },
  { label: 'Audit & Kontak', id: 'audit' },
];

function BaliClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Makassar' }));
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const meridiem = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      setTime(`${hour12}:${m} ${meridiem}`);
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
      setDate(`${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    }
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <span className="text-xs opacity-70 hidden lg:inline whitespace-nowrap">
      Denpasar UTC+8 • {time} • {date}
    </span>
  );
}

export default function Header({ visible, onMenuOpen }) {
  const settings = useSiteSettings();
  const scrollTo = (id) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    }
  };

  const renderChild = (child) => {
    const cls = 'block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-blue-900 hover:bg-gray-50 transition-colors';
    return child.path ? (
      <Link key={child.path} to={child.path} className={cls}>
        {child.label}
      </Link>
    ) : (
      <button key={child.id} onClick={() => scrollTo(child.id)} className={cls}>
        {child.label}
      </button>
    );
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)',
      }}
    >
      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4" style={{ maxWidth: '88rem' }}>
        <button onClick={() => scrollTo('home')} className="flex items-center gap-2 group">
          <img
            src="/brand/iproid-logo.png"
            alt="iprodigital.id logo"
            className="h-[30px] sm:h-9 w-auto"
          />
          <span className="font-bold text-sm tracking-tight text-white group-hover:text-yellow-400 transition-colors hidden sm:inline">
            iprodigital<span style={{ color: '#cc5500' }}>.id</span>
          </span>
          {settings?.header_tagline && (
            <span className="hidden lg:inline text-[10px] text-white/40 font-normal tracking-wide border-l border-white/15 pl-2.5">
              {settings.header_tagline}
            </span>
          )}
        </button>

        <nav className="hidden xl:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <div key={item.label} className="relative group">
                  <button className="flex items-center gap-1 text-sm text-white/80 hover:text-yellow-400 transition-colors tracking-wide">
                    {item.label}
                    <ChevronDown size={13} className="transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  <div
                    className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    style={{ transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}
                  >
                    <div
                      className="rounded-xl py-2 min-w-[180px]"
                      style={{ background: '#fff', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid #e6e5e2' }}
                    >
                      {item.children.map(renderChild)}
                    </div>
                  </div>
                </div>
              );
            }
            if (item.path) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm text-white/80 hover:text-yellow-400 transition-colors tracking-wide"
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm text-white/80 hover:text-yellow-400 transition-colors tracking-wide"
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <BaliClock />
          <button
            onClick={onMenuOpen}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Menu size={18} className="text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}

export { NAV_ITEMS };