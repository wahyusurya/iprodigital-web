import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const DEFAULT_WA = '6281999899802';
const DEFAULT_MSG = 'Halo iprodigital! Saya ingin konsultasi gratis.';

export default function FloatingWhatsApp() {
  const settings = useSiteSettings();
  const waNumber = (settings?.whatsapp_number || DEFAULT_WA).replace(/[^0-9]/g, '');
  const href = `https://wa.me/${waNumber}?text=${encodeURIComponent(DEFAULT_MSG)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex items-center gap-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background: '#25D366',
        color: '#fff',
        padding: '0.75rem',
        boxShadow: '0 8px 30px rgba(37,211,102,0.4)',
      }}
      aria-label="Chat WhatsApp"
    >
      <MessageCircle size={22} fill="#fff" stroke="#25D366" strokeWidth={2} />
      <span className="text-sm font-semibold hidden sm:inline">
        Konsultasi Gratis
      </span>
    </a>
  );
}