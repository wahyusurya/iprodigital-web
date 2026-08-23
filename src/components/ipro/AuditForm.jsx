import React, { useState } from 'react';
import RevealText from '@/components/ipro/RevealText';
import { Send } from 'lucide-react';

const solutions = [
  'Pajak & Pembukuan',
  'Digital Marketing & SEO',
  'Software House & AI Agent',
  'Demo SaaS huniku / Kasirku',
];

export default function AuditForm() {
  const [form, setForm] = useState({ name: '', business: '', whatsapp: '', solution: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `Halo iprodigital! Saya ingin konsultasi gratis.\n\nNama: ${form.name}\nBisnis: ${form.business}\nWhatsApp: ${form.whatsapp}\nSolusi yang Dibutuhkan: ${form.solution}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6281999899802?text=${encoded}`, '_blank');
  };

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const inputClass = "w-full px-5 py-3.5 rounded-xl text-sm bg-white border border-gray-200 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all duration-300 placeholder:text-gray-400";

  return (
    <section id="audit" className="py-10 lg:py-28" style={{ background: '#fff' }}>
      <div className="mx-auto px-6 lg:px-10" style={{ maxWidth: '88rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          <div>
            <RevealText>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#14b8a6' }}>Audit & Konsultasi</p>
            </RevealText>
            <RevealText as="h2" className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-gray-900" delay={100}>
              Dapatkan Audit SEO & Konsultasi Finansial <span style={{ color: '#f5b731' }}>Gratis!</span>
            </RevealText>
            <RevealText delay={200}>
              <p className="text-sm sm:text-base text-gray-500 mt-4 leading-relaxed">
                Isi formulir di samping dan tim ahli kami akan menghubungi Anda langsung melalui WhatsApp untuk sesi konsultasi awal tanpa biaya.
              </p>
            </RevealText>
            <RevealText delay={300}>
              <div className="mt-6 lg:mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#1a3a6b' }}>✓</span>
                  Respons cepat dalam 1x24 jam
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#1a3a6b' }}>✓</span>
                  Analisis mendalam tanpa biaya
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#1a3a6b' }}>✓</span>
                  Rekomendasi solusi yang tepat sasaran
                </div>
              </div>
            </RevealText>
          </div>

          <RevealText delay={250}>
            <form onSubmit={handleSubmit} className="rounded-2xl p-5 sm:p-7 lg:p-8 flex flex-col gap-4" style={{ background: '#f9f9f8', border: '1px solid #e6e5e2' }}>
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
                <label className="block text-xs font-semibold text-gray-700 mb-2">Nama Bisnis / Usaha</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Contoh: Ubud Eco Resort & Spa"
                  value={form.business}
                  onChange={(e) => update('business', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Nomor WhatsApp Aktif</label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="Contoh: 0812XXXXXXXX"
                  value={form.whatsapp}
                  onChange={(e) => update('whatsapp', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Pilihan Solusi Utama</label>
                <select
                  className={`${inputClass} appearance-none`}
                  value={form.solution}
                  onChange={(e) => update('solution', e.target.value)}
                  required
                >
                  <option value="">Pilih solusi yang dibutuhkan...</option>
                  {solutions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ background: '#1a3a6b', color: '#fff', minHeight: '48px' }}
                >
                  <Send size={16} />
                  Kirim Form & Hubungi Admin via WhatsApp
                </button>
              </div>
            </form>
          </RevealText>
        </div>
      </div>
    </section>
  );
}