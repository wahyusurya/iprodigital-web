import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function EventImageModal({ src, onClose }) {
  useEffect(() => {
    if (!src) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(10,25,55,0.9)', backdropFilter: 'blur(8px)' }} />
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
      >
        <X size={20} className="text-white" />
      </button>
      <div
        className="relative max-w-5xl w-full rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt="Pratinjau acara" className="w-full object-contain" style={{ maxHeight: '85vh' }} />
      </div>
    </div>
  );
}