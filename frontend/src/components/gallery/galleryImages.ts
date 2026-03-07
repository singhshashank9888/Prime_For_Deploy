// src/components/gallery/galleryImages.ts
export const galleryImages = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  src: `/gallery/${i + 1}.webp`,
  alt: `Hospital ${i + 1}`,
  caption: `Image ${i + 1} - Our hospital facilities`,
}));