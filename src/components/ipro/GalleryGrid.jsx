import React from 'react';

function GalleryImage({ src, caption, className }) {
  return (
    <div className={`relative overflow-hidden rounded-xl group ${className}`}>
      <img
        src={src}
        alt={caption || ''}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 sm:p-4">
          <p className="text-white text-xs sm:text-sm font-medium leading-snug">{caption}</p>
        </div>
      )}
    </div>
  );
}

export default function GalleryGrid({ images = [] }) {
  const valid = images.filter((img) => img && img.url);
  if (valid.length === 0) return null;

  if (valid.length === 5) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <GalleryImage
          src={valid[0].url}
          caption={valid[0].caption}
          className="col-span-2 lg:col-span-2 lg:row-span-2 aspect-[2/1] lg:aspect-auto lg:h-full"
        />
        {valid.slice(1).map((img, i) => (
          <GalleryImage
            key={i}
            src={img.url}
            caption={img.caption}
            className="aspect-square"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      {valid.map((img, i) => (
        <GalleryImage
          key={i}
          src={img.url}
          caption={img.caption}
          className="aspect-[4/3]"
        />
      ))}
    </div>
  );
}