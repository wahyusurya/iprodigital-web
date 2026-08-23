import React from 'react';
import { X, Linkedin, Instagram, Facebook, MessageCircle, Mail } from 'lucide-react';

export default function TeamMemberModal({ member, onClose }) {
  if (!member) return null;

  const socials = [
    { url: member.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: member.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: member.facebook_url, icon: Facebook, label: 'Facebook' },
    {
      url: member.whatsapp_number,
      icon: MessageCircle,
      label: 'WhatsApp',
      href: member.whatsapp_number ? `https://wa.me/${member.whatsapp_number.replace(/[^0-9]/g, '')}` : null,
    },
    { url: member.email, icon: Mail, label: 'Email', href: member.email ? `mailto:${member.email}` : null },
  ].filter((s) => s.url);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(10,25,55,0.85)', backdropFilter: 'blur(8px)' }} />
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-white"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <X size={18} className="text-gray-700" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-5">
          {/* Photo */}
          <div className="sm:col-span-2 aspect-[4/5] sm:aspect-auto overflow-hidden" style={{ background: '#e6e5e2' }}>
            {member.image_url ? (
              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl font-bold text-gray-400">{member.name?.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="sm:col-span-3 p-6 sm:p-8 flex flex-col">
            {member.department && (
              <span
                className="inline-flex self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide mb-3"
                style={{ background: 'rgba(26,58,107,0.1)', color: '#1a3a6b' }}
              >
                {member.department}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{member.name}</h2>
            <p className="text-sm font-semibold mt-1" style={{ color: '#1a3a6b' }}>{member.role}</p>

            {(member.description || member.bio) && (
              <div className="mt-5 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {member.description || member.bio}
              </div>
            )}

            {socials.length > 0 && (
              <div className="mt-auto pt-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Terhubung</p>
                <div className="flex flex-wrap gap-2.5">
                  {socials.map((s) => {
                    const Icon = s.icon;
                    const href = s.href || s.url;
                    return (
                      <a
                        key={s.label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 hover:scale-105"
                        style={{ background: '#f9f9f8', border: '1px solid #e6e5e2', color: '#374151' }}
                      >
                        <Icon size={15} style={{ color: '#1a3a6b' }} />
                        {s.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}