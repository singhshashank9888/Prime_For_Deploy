import React from "react";
import { galleryImages } from "./galleryImages";

const Gallery = () => {
  return (
    <div className="bg-white font-sans antialiased text-slate-900">
      
      {/* --- COMPACT BLURRED BANNER --- */}
      <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 bg-slate-950/80" />
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-white/5 border border-white/10">
            <p className="text-white/60 text-[9px] font-bold tracking-[0.4em] uppercase">
              Visual Tour
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">
            <span className="font-light">Hospital</span> <span className="font-bold">Gallery</span>
          </h1>
        </div>
      </section>

      {/* --- GALLERY GRID SECTION --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mb-4">Our Facilities</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight leading-tight">
              <span className="font-bold">Inside</span> <span className="font-light opacity-80">Prime Hospital</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {galleryImages.map((img) => (
              <figure
                key={img.id}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                {/* Image Aspect Ratio Container */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover:scale-110"
                  />
                </div>

                {/* Refined Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <figcaption className="w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="inline-block px-3 py-1 mb-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                      <p className="text-white text-[9px] font-bold tracking-widest uppercase">Prime Gallery</p>
                    </div>
                    <p className="text-white text-lg font-serif font-light leading-snug">
                      {img.caption || img.alt}
                    </p>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Gallery;