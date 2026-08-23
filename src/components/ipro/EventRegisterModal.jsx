import React, { useState, useEffect } from 'react';
import { X, Send, Calendar, Clock, MapPin } from 'lucide-react';

const ADMIN_WA = '6281999899802';

function formatDateFull(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function EventRegisterModal({ event, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', instansi: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!event) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [event, onClose]);

  if (!event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const message =
      `Halo iprodigital! Saya ingin mendaftar acara berikut:\n\n` +
      `*Nama Acara:* ${event.title}\n` +
      `*Tanggal:* ${formatDateFull(event.date)}\n` +
      `*Jam:* ${event.start_time}${event.end_time ? ' - ' + event.end_time : ''} WITA\n` +
      `*Lokasi:* ${event.location || (event.is_online ? 'Online' : 'TBD')}\n\n` +
      `*Data Diri:*\n` +
      `Nama: ${form.name}\n` +
      `No HP: ${form.phone}\n` +
      `Asal Instansi: ${form.instansi}`;
    window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(message)}`, '_blank');
    setSubmitting(true);
    setTimeout(onClose, 1200);
  };

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  const inputClass = 'w-full px-4 py-3 rounded-xl text-sm bg-white border border-gray-200 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all duration-300 placeholder:text-gray-400';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(10,25,55,0.85)', backdropFilter: 'blur(8px)' }} />
      <div
        className="relative w-full max-w-md rounded-2xl bg-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
          style={{ background: '#f3f4f6' }}
        >
          <X size={18} className="text-gray-600" />
        </button>

        {/* Header */}
        <div className="p-6 pb-5" style={{ background: '#0f1f3a' }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#f5b731' }}>
            Pendaftaran Acara
          </p>
          <h3 className="text-lg font-bold text-white leading-tight pr-8">{event.title}</h3>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Calendar size={12} /> {formatDateFull(event.date)}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Clock size={12} /> {event.start_time}{event.end_time ? ` - ${event.end_time}` : ''} WITA
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <MapPin size={12} /> {event.location || (event.is_online ? 'Online' : 'TBD')}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Contoh: Budi Wijaya"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Nomor WhatsApp / HP</label>
            <input
              type="tel"
              className={inputClass}
              placeholder="Contoh: 0812XXXXXXXX"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Asal Instansi / Perusahaan</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Contoh: Ubud Eco Resort"
              value={form.instansi}
              onChange={(e) => update('instansi', e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-2"
            style={{ background: '#1a3a6b', color: '#fff' }}
          >
            {submitting ? 'Mengalihkan ke WhatsApp...' : (<><Send size={15} /> Daftar via WhatsApp</>)}
          </button>
          <p className="text-center text-xs text-gray-400">Data Anda akan dikirim langsung ke admin via WhatsApp.</p>
        </form>
      </div>
    </div>
  );
}