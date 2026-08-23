import React from 'react';

function getYouTubeId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

function getVimeoId(url) {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export default function VideoEmbed({ url, className = '' }) {
  if (!url) return null;

  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <div className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: '16/9' }}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          title="Video Testimoni"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return (
      <div className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: '16/9' }}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title="Video Testimoni"
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
  if (isDirectVideo) {
    return (
      <video
        controls
        playsInline
        className={`w-full ${className}`}
        style={{ aspectRatio: '16/9', objectFit: 'cover' }}
      >
        <source src={url} />
      </video>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-medium underline"
    >
      Tonton Video
    </a>
  );
}