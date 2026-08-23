import { db } from "@/api/db";

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange }) {
  const imageHandler = function () {
    const quill = this.quill;
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      try {
        const { file_url } = await db.integrations.Core.UploadFile({ file });
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', file_url);
      } catch (e) {
        console.error('Image upload failed:', e);
        alert('Gagal mengunggah gambar');
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder="Tulis isi berita di sini..."
      />
    </div>
  );
}