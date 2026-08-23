import { db } from "@/api/db";

import React, { useState, useRef } from 'react';

import { Loader2, Upload, X } from 'lucide-react';

export default function ImageUpload({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await db.integrations.Core.UploadFile({ file });
      onChange(result.file_url);
    } catch (e) {
      console.error('Upload failed:', e);
      alert('Gagal mengunggah gambar. Coba lagi atau tempel URL manual.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1.5 text-gray-700">{label}</label>}
      {value ? (
        <div className="relative group mb-2">
          <img src={value} alt="" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="text-xs">{uploading ? 'Mengunggah...' : 'Klik untuk upload gambar'}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="atau tempel URL gambar di sini"
        className="w-full mt-2 px-3 py-2 rounded-lg text-xs border border-gray-200 outline-none focus:border-blue-900 transition-colors"
      />
    </div>
  );
}