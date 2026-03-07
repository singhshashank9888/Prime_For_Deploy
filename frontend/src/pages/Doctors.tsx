import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Award, Calendar, ChevronRight } from "lucide-react";

const doctors = [
  {
    name: "Dr. Tek Narayan Yadav",
    specialty: "Senior Laparoscopic & GI Surgeon",
    qualification: "MBBS (BPKIHS), MS (General Surgery) PGIMER, MCh (Surgical GI)",
    image: "https://i.imgur.com/QaeLFUy.jpg",
    available: true,
    experience: "10+ years",
  },
  {
    name: "Dr. Ramesh Chaurasia",
    specialty: "Nephrology",
    qualification: "MD, DM (Nephrology)",
    image: "https://i.imgur.com/oOneoU6.jpg",
    available: true,
    experience: "10 years",
  },
  {
    name: "Dr. Sangeeta Mishra",
    specialty: "Obstetrics & Gynecology",
    qualification: "MBBS, MS (OB-GYN)",
    image: "https://i.imgur.com/Vu3ObhC.jpg",
    available: true,
    experience: "10 years",
  },
  {
    name: "Dr. Ajay Mahato",
    specialty: "Orthopedic Surgery",
    qualification: "MBBS, MS (Ortho) - AIIMS",
    image: "https://i.imgur.com/0PmSuNt.jpg",
    available: true,
    experience: "10 years",
  },
  {
    name: "Dr. Manish Agrawal",
    specialty: "General Surgery",
    qualification: "MBBS, MS (Surgery)",
    image: "https://i.imgur.com/ASdmiN1.jpg",
    available: true,
    experience: "10 years",
  },
  {
    name: "Dr. Ranjeev Yadav",
    specialty: "Radiology",
    qualification: "MBBS, MD (Radiology)",
    image: "https://i.imgur.com/b9KM8o5.jpg",
    available: true,
    experience: "10 years",
  },
  {
    name: "Dr. Shrijana Yadav",
    specialty: "Pathology",
    qualification: "MBBS, MD (Pathology)",
    image: "https://i.imgur.com/sAWlGhC.jpg",
    available: true,
    experience: "10 years",
  },
];

const Doctors = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      
      {/* Hero Section */}
      <section className="relative py-32 flex items-center justify-center text-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.imgur.com/Qn0pz2o.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-6 z-10">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
            <nav className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest">
              <Link to="/" className="hover:opacity-70 transition-opacity">Home</Link>
              <ChevronRight size={10} className="opacity-50" />
              <span className="opacity-70">Doctors</span>
            </nav>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 tracking-tight">
            <span className="font-bold">Our</span> <span className="font-light">Doctors</span>
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto leading-relaxed font-medium">
            Meet our experienced doctors providing premium medical care in Biratnagar.
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {doctors.map((doc) => (
              <div 
                key={doc.name} 
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300 p-6 flex flex-col items-center text-center"
              >
                <div className="relative w-40 h-40 mb-4">
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="w-full h-full object-cover rounded-full shadow-sm"
                  />
                  {doc.available && (
                    <span className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse border border-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">{doc.name}</h3>
                <p className="text-sm text-primary font-medium uppercase tracking-wide mb-3">{doc.specialty}</p>
                <div className="text-xs text-slate-600 space-y-2 mb-4">
                  <div className="flex items-center justify-center gap-1">
                    <GraduationCap size={14} className="opacity-70" />
                    <span className="line-clamp-2">{doc.qualification}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 font-bold text-slate-500 uppercase tracking-widest">
                    <Award size={12} className="opacity-70" /> {doc.experience} Experience
                  </div>
                </div>
                <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
                  <Calendar size={16} /> Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Need a Consultation?</h2>
          <p className="text-slate-500 mb-8 font-light leading-relaxed">
            Our specialists are available for scheduled appointments and emergency trauma care.
          </p>
          <button className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center gap-2 mx-auto">
            <Calendar size={18} /> Schedule Visit
          </button>
        </div>
      </section>
    </div>
  );
};

export default Doctors;