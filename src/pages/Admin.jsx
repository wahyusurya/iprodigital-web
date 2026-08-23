
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminEntityManager from '@/components/admin/AdminEntityManager';
import { Briefcase, Star, Box, Newspaper, CalendarDays, Users, ArrowLeft, Settings, Images } from 'lucide-react';
import AboutContentEditor from '@/components/admin/AboutContentEditor';
import SiteSettingsEditor from '@/components/admin/SiteSettingsEditor';
import GalleryEditor from '@/components/admin/GalleryEditor';

const LOGO_URL =
  '/brand/iproid-logo.png';

const TABS = [
  {
    id: 'portfolio',
    label: 'Portofolio',
    icon: Briefcase,
    entity: 'Portfolio',
    title: 'Manajemen Portofolio',
    subtitle: 'Kelola proyek dan karya klien',
    itemLabel: 'Proyek',
    fields: [
      { name: 'title', label: 'Judul Proyek', type: 'text', required: true, list: true },
      { name: 'client_name', label: 'Nama Klien', type: 'text', list: true },
      {
        name: 'category',
        label: 'Kategori',
        type: 'select',
        options: ['Website', 'SEO', 'Pajak & Pembukuan', 'Aplikasi Mobile', 'AI & Otomatisasi', 'Digital Marketing'],
        list: true,
      },
      { name: 'description', label: 'Deskripsi', type: 'textarea' },
      { name: 'outcome', label: 'Hasil / Capaian', type: 'text', list: true },
      { name: 'image_url', label: 'Gambar Proyek', type: 'image' },
      { name: 'client_logo_url', label: 'Logo Klien', type: 'image' },
      { name: 'project_url', label: 'URL Proyek', type: 'text' },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', default: 0 },
    ],
  },
  {
    id: 'social',
    label: 'Bukti Sosial',
    icon: Star,
    entity: 'SocialProof',
    title: 'Manajemen Bukti Sosial',
    subtitle: 'Testimoni & kisah sukses klien',
    itemLabel: 'Testimoni',
    fields: [
      { name: 'client_name', label: 'Nama Klien', type: 'text', required: true, list: true },
      { name: 'company', label: 'Nama Perusahaan', type: 'text', list: true },
      { name: 'testimonial', label: 'Testimoni / Cerita Sukses', type: 'textarea', rows: 5 },
      { name: 'rating', label: 'Rating (1-5)', type: 'number', default: 5 },
      {
        name: 'story_type',
        label: 'Tipe',
        type: 'select',
        options: ['testimonial', 'success_story'],
        default: 'testimonial',
        list: true,
      },
      { name: 'outcome', label: 'Hasil / Capaian', type: 'text', list: true },
      { name: 'logo_url', label: 'Logo Perusahaan', type: 'image' },
      { name: 'image_url', label: 'Gambar Pendukung', type: 'image' },
      { name: 'video_url', label: 'URL Video Testimoni (YouTube/Vimeo/MP4)', type: 'text' },
      { name: 'is_featured', label: 'Unggulan (kartu gelap)', type: 'boolean', default: false },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', default: 0 },
    ],
  },
  {
    id: 'saas',
    label: 'Produk SaaS',
    icon: Box,
    entity: 'SaaSProduct',
    title: 'Manajemen Produk SaaS',
    subtitle: 'Kelola produk huniku, Kasirku, dan lainnya',
    itemLabel: 'Produk',
    fields: [
      { name: 'name', label: 'Nama Produk', type: 'text', required: true, list: true },
      { name: 'tagline', label: 'Tagline', type: 'text', list: true },
      { name: 'description', label: 'Deskripsi', type: 'textarea', rows: 5 },
      { name: 'features', label: 'Fitur (pisahkan dengan koma)', type: 'textarea', rows: 3 },
      { name: 'image_url', label: 'Gambar Produk', type: 'image' },
      { name: 'cta_label', label: 'Label Tombol', type: 'text', default: 'Pelajari Lebih Lanjut' },
      { name: 'cta_link', label: 'Link Tombol', type: 'text' },
      { name: 'badge', label: 'Badge (contoh: Early Bird)', type: 'text', list: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ['active', 'coming_soon'],
        default: 'active',
        list: true,
      },
      { name: 'accent_color', label: 'Warna Aksen (hex)', type: 'text', default: '#1a3a6b' },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', default: 0 },
    ],
  },
  {
    id: 'news',
    label: 'Berita & Kegiatan',
    icon: Newspaper,
    entity: 'News',
    title: 'Manajemen Berita & Kegiatan',
    subtitle: 'Publikasikan kabar terbaru perusahaan',
    itemLabel: 'Berita',
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true, list: true },
      { name: 'slug', label: 'Slug', type: 'text', autoSlugFrom: 'title', hidden: true },
      {
        name: 'category',
        label: 'Kategori',
        type: 'select',
        options: ['Berita', 'Kegiatan', 'Pengumuman', 'Event'],
        default: 'Berita',
        list: true,
      },
      { name: 'date', label: 'Tanggal', type: 'date', list: true },
      { name: 'excerpt', label: 'Ringkasan', type: 'textarea', rows: 2 },
      { name: 'content', label: 'Konten Lengkap', type: 'richtext' },
      { name: 'image_url', label: 'Gambar', type: 'image' },
      { name: 'is_published', label: 'Publikasikan', type: 'boolean', default: true },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', default: 0 },
    ],
  },
  {
    id: 'events',
    label: 'Kalender Acara',
    icon: CalendarDays,
    entity: 'Event',
    title: 'Manajemen Kalender Acara',
    subtitle: 'Kelola webinar & workshop edukasi digital',
    itemLabel: 'Acara',
    fields: [
      { name: 'title', label: 'Judul Acara', type: 'text', required: true, list: true },
      {
        name: 'event_type',
        label: 'Tipe Acara',
        type: 'select',
        options: ['Webinar', 'Workshop', 'Seminar', 'Bootcamp'],
        default: 'Webinar',
        list: true,
      },
      { name: 'date', label: 'Tanggal', type: 'date', list: true },
      { name: 'start_time', label: 'Jam Mulai', type: 'text', list: true },
      { name: 'end_time', label: 'Jam Selesai', type: 'text' },
      { name: 'price', label: 'Harga', type: 'text', default: 'Gratis', list: true },
      { name: 'location', label: 'Lokasi / Platform', type: 'text', list: true },
      { name: 'is_online', label: 'Acara Online', type: 'boolean', default: true },
      { name: 'excerpt', label: 'Ringkasan', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Deskripsi Lengkap', type: 'richtext' },
      { name: 'image_url', label: 'Gambar', type: 'image' },
      { name: 'registration_link', label: 'Link Pendaftaran', type: 'text' },
      { name: 'capacity', label: 'Kapasitas Peserta', type: 'number' },
      { name: 'is_published', label: 'Publikasikan', type: 'boolean', default: true },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', default: 0 },
    ],
  },
  {
    id: 'about',
    label: 'Tentang Kami',
    icon: Users,
    entity: 'TeamMember',
    title: 'Manajemen Tim Ahli',
    subtitle: 'Kelola profil tim di halaman Tentang Kami',
    itemLabel: 'Anggota',
    fields: [
      { name: 'name', label: 'Nama Lengkap', type: 'text', required: true, list: true },
      { name: 'role', label: 'Jabatan / Peran', type: 'text', list: true },
      {
        name: 'department',
        label: 'Divisi',
        type: 'select',
        options: ['Leadership', 'Pajak & Pembukuan', 'Digital Marketing', 'Software & AI', 'Operasional'],
        list: true,
      },
      { name: 'bio', label: 'Biografi Singkat (kartu)', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Deskripsi Lengkap (modal detail)', type: 'textarea', rows: 6 },
      { name: 'image_url', label: 'Foto', type: 'image' },
      { name: 'linkedin_url', label: 'URL LinkedIn', type: 'text' },
      { name: 'instagram_url', label: 'URL Instagram', type: 'text' },
      { name: 'facebook_url', label: 'URL Facebook', type: 'text' },
      { name: 'whatsapp_number', label: 'Nomor WhatsApp', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', default: 0 },
    ],
  },
  {
    id: 'gallery',
    label: 'Galeri Foto',
    icon: Images,
    title: 'Galeri Foto',
    subtitle: 'Kelola galeri foto untuk halaman Tentang Kami & Acara',
  },
  {
    id: 'settings',
    label: 'Pengaturan Situs',
    icon: Settings,
    title: 'Pengaturan Situs',
    subtitle: 'Kelola deskripsi, kontak, dan media sosial header & footer',
  },
];

export default function Admin() {
  const [active, setActive] = useState('portfolio');
  const tab = TABS.find((t) => t.id === active);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14"
          style={{ maxWidth: '88rem' }}
        >
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="iprodigital.id" className="h-7 w-auto" />
            <span className="font-bold text-sm text-gray-900 hidden sm:inline">
              Admin Panel
            </span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Situs
          </Link>
        </div>
      </header>

      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-6"
        style={{ maxWidth: '88rem' }}
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          {tab.id === 'about' && <AboutContentEditor />}
          {tab.id === 'gallery' ? (
            <GalleryEditor />
          ) : tab.id === 'settings' ? (
            <SiteSettingsEditor />
          ) : (
            <AdminEntityManager
              key={tab.id}
              entityName={tab.entity}
              fields={tab.fields}
              title={tab.title}
              subtitle={tab.subtitle}
              itemLabel={tab.itemLabel}
            />
          )}
        </div>
      </div>
    </div>
  );
}