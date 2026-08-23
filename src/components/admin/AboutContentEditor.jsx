import { db } from "@/api/db";

import React, { useState, useEffect } from 'react';

import { Save, Loader2, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
  {
    label: 'Hero',
    fields: [
      { name: 'hero_title', label: 'Judul Hero', type: 'text' },
      { name: 'hero_subtitle', label: 'Subjudul Hero', type: 'textarea', rows: 2, full: true },
    ],
  },
  {
    label: 'Cerita Kami',
    fields: [
      { name: 'story_heading', label: 'Label Cerita', type: 'text' },
      { name: 'story_title', label: 'Judul Cerita', type: 'text' },
      { name: 'story_text', label: 'Teks Cerita (satu paragraf per baris)', type: 'textarea', rows: 6, full: true },
      { name: 'stat1_value', label: 'Stat 1 Nilai', type: 'text' },
      { name: 'stat1_label', label: 'Stat 1 Label', type: 'text' },
      { name: 'stat2_value', label: 'Stat 2 Nilai', type: 'text' },
      { name: 'stat2_label', label: 'Stat 2 Label', type: 'text' },
      { name: 'stat3_value', label: 'Stat 3 Nilai', type: 'text' },
      { name: 'stat3_label', label: 'Stat 3 Label', type: 'text' },
      { name: 'stat4_value', label: 'Stat 4 Nilai', type: 'text' },
      { name: 'stat4_label', label: 'Stat 4 Label', type: 'text' },
    ],
  },
  {
    label: 'Visi & Misi',
    fields: [
      { name: 'vision_text', label: 'Teks Visi', type: 'textarea', rows: 4, full: true },
      { name: 'mission_text', label: 'Teks Misi (satu poin per baris)', type: 'textarea', rows: 5, full: true },
    ],
  },
  {
    label: 'Nilai Inti',
    fields: [
      { name: 'value1_title', label: 'Nilai 1 Judul', type: 'text' },
      { name: 'value1_desc', label: 'Nilai 1 Deskripsi', type: 'text' },
      { name: 'value2_title', label: 'Nilai 2 Judul', type: 'text' },
      { name: 'value2_desc', label: 'Nilai 2 Deskripsi', type: 'text' },
      { name: 'value3_title', label: 'Nilai 3 Judul', type: 'text' },
      { name: 'value3_desc', label: 'Nilai 3 Deskripsi', type: 'text' },
    ],
  },
  {
    label: 'Tim & CTA',
    fields: [
      { name: 'team_heading', label: 'Label Tim', type: 'text' },
      { name: 'team_title', label: 'Judul Tim', type: 'text' },
      { name: 'team_subtitle', label: 'Subjudul Tim', type: 'textarea', rows: 2, full: true },
      { name: 'cta_title', label: 'Judul CTA', type: 'text' },
      { name: 'cta_text', label: 'Teks CTA', type: 'textarea', rows: 2, full: true },
    ],
  },
];

export default function AboutContentEditor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    db.entities.AboutContent
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
        const updated = await db.entities.AboutContent.update(data.id, data);
        setData(updated);
      } else {
        const created = await db.entities.AboutContent.create(data);
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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Konten Halaman Tentang Kami</h3>
          <p className="text-xs text-gray-500 mt-0.5">Edit cerita, visi, misi, statistik, nilai, dan CTA</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: saved ? '#14b8a6' : '#1a3a6b' }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Konten'}
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