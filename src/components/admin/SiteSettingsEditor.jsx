import { db } from "@/api/db";

import React, { useState, useEffect } from 'react';

import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { clearSiteSettingsCache } from '@/hooks/useSiteSettings';

const SECTIONS = [
  {
    label: 'Header',
    fields: [
      { name: 'header_tagline', label: 'Tagline Header (tampil di samping logo, kosongkan jika tidak perlu)', type: 'text', full: true },
    ],
  },
  {
    label: 'Footer',
    fields: [
      { name: 'footer_description', label: 'Deskripsi Footer', type: 'textarea', rows: 4, full: true },
      { name: 'footer_location', label: 'Teks Lokasi (contoh: Denpasar, Bali, Indonesia)', type: 'text', full: true },
    ],
  },
  {
    label: 'WhatsApp',
    fields: [
      { name: 'whatsapp_number', label: 'No. WA Utama (format: 628xxx)', type: 'text' },
      { name: 'whatsapp_label', label: 'Label Tampil Utama (contoh: 0819-9989-9802)', type: 'text' },
      { name: 'whatsapp_role', label: 'Role Utama (contoh: Admin - Utama)', type: 'text' },
      { name: 'whatsapp_number_2', label: 'No. WA Sekunder', type: 'text' },
      { name: 'whatsapp_label_2', label: 'Label Tampil Sekunder', type: 'text' },
      { name: 'whatsapp_role_2', label: 'Role Sekunder', type: 'text' },
    ],
  },
  {
    label: 'Media Sosial (kosongkan jika tidak digunakan)',
    fields: [
      { name: 'instagram_url', label: 'URL Instagram', type: 'text' },
      { name: 'tiktok_url', label: 'URL TikTok', type: 'text' },
      { name: 'youtube_url', label: 'URL YouTube', type: 'text' },
      { name: 'gmaps_url', label: 'URL Google Maps', type: 'text' },
      { name: 'facebook_url', label: 'URL Facebook', type: 'text' },
    ],
  },
];

export default function SiteSettingsEditor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    db.entities.SiteSettings
      .list(1)
      .then((items) => {
        if (items.length > 0) {
          setData(items[0]);
        } else {
          setData({});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const update = (key, val) => setData((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await db.entities.SiteSettings.update(data.id, data);
        setData(updated);
      } else {
        const created = await db.entities.SiteSettings.create(data);
        setData(created);
      }
      clearSiteSettingsCache();
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
          <h3 className="font-bold text-gray-900 text-sm">Pengaturan Situs</h3>
          <p className="text-xs text-gray-500 mt-0.5">Kelola deskripsi, kontak, dan media sosial. Field yang kosong tidak akan tampil.</p>
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

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">{section.label}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.fields.map((f) => (
                <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
                  <label className={labelClass}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      className={inputClass}
                      rows={f.rows || 3}
                      value={data[f.name] || ''}
                      onChange={(e) => update(f.name, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className={inputClass}
                      value={data[f.name] || ''}
                      onChange={(e) => update(f.name, e.target.value)}
                      placeholder="—"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}