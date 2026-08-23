import { db } from "@/api/db";

import React, { useState, useEffect } from 'react';

import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

const SECTIONS = [
  { value: 'about', label: 'Tentang Kami' },
  { value: 'acara', label: 'Kalender Acara' },
];

export default function GalleryEditor() {
  const [section, setSection] = useState('about');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    db.entities.Gallery
      .filter({ section })
      .then((items) => {
        setData(items.length > 0 ? items[0] : { section });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [section]);

  const update = (key, val) => setData((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await db.entities.Gallery.update(data.id, data);
        setData(updated);
      } else {
        const created = await db.entities.Gallery.create({ ...data, section });
        setData(created);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-gray-300" size={24} />
      </div>
    );
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg text-sm border border-gray-200 outline-none focus:border-gray-900 transition-colors';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Galeri Foto</h3>
          <p className="text-xs text-gray-500 mt-0.5">Unggah hingga 5 foto. Hanya foto yang diisi yang akan tampil di halaman.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: saved ? '#14b8a6' : '#1a3a6b' }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan'}
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {SECTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => setSection(s.value)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              section === s.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div>
          <label className={labelClass}>Judul Galeri</label>
          <input
            type="text"
            className={inputClass}
            value={data.heading || ''}
            onChange={(e) => update('heading', e.target.value)}
            placeholder="contoh: Momen Bersama Tim & Klien"
          />
        </div>
        <div>
          <label className={labelClass}>Subjudul Galeri</label>
          <input
            type="text"
            className={inputClass}
            value={data.subtitle || ''}
            onChange={(e) => update('subtitle', e.target.value)}
            placeholder="contoh: Sekilas kegiatan dan kolaborasi kami"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n}>
            <ImageUpload
              label={`Foto ${n}`}
              value={data[`image${n}_url`] || ''}
              onChange={(val) => update(`image${n}_url`, val)}
            />
            <input
              type="text"
              className={`${inputClass} mt-2`}
              value={data[`image${n}_caption`] || ''}
              onChange={(e) => update(`image${n}_caption`, e.target.value)}
              placeholder="Keterangan (opsional)"
            />
          </div>
        ))}
      </div>
    </div>
  );
}