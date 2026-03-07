import React from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Heart, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  Microscope, 
  Zap,
  ChevronRight 
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Compassion",
    desc: "We treat every patient like family, ensuring that premium medical care is always delivered with a human touch.",
  },
  {
    icon: Shield,
    title: "Safety & Quality",
    desc: "Adhering to international medical protocols to provide the safest diagnostic and surgical outcomes in Nepal.",
  },
  {
    icon: Zap,
    title: "Modern Innovation",
    desc: "Equipped with Biratnagar's latest 4D Ultrasound and CT technology for fast, pinpoint-accurate results.",
  },
  {
    icon: Award,
    title: "Integrity",
    desc: "Unwavering commitment to ethical medical practices, transparency in treatment, and patient trust.",
  },
];

const About = () => (
  <div className="bg-white text-slate-900 font-sans antialiased">
    
    {/* High-Transparency Glass Hero */}
    <section className="relative py-32 md:py-48 bg-white overflow-hidden text-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: "url('https://i.imgur.com/XOtGHPL.jpg')" }} 
      />
      
      {/* Subtle Neutral Overlay (Matches Dept Page) */}
      <div className="absolute inset-0 bg-black/40 backdrop-brightness-75" />
      
      <div className="relative container mx-auto px-6 z-10">
        {/* Glassmorphism Breadcrumb */}
        <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <nav className="flex items-center gap-2 text-white text-[10px] font-bold tracking-[0.3em] uppercase">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="opacity-70">About Us</span>
          </nav>
        </div>

        <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tight drop-shadow-lg">
          Redefining <span className="font-light ">Healthcare</span>
        </h1>
        
        <p className="text-white/90 text-xl leading-relaxed max-w-2xl mx-auto drop-shadow-md backdrop-blur-[2px] py-2">
          Prime Hospital is a premier multi-specialty institution dedicated to 
          bringing world-class clinical expertise to Biratnagar.
        </p>
      </div>
    </section>

    {/* Story Section: Professional Split Layout */}
    <section className="py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-slate-100 rounded-[2.5rem] -z-10 group-hover:bg-primary/5 transition-colors" />
            <img 
              src="https://i.imgur.com/2Ij1JIQ.jpg" 
              alt="Hospital Interior" 
              className="rounded-[2rem] shadow-2xl object-cover h-[500px] w-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* Floating Stats Card (Glass Style) */}
            <div className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="text-primary h-6 w-6" />
                </div>
                <span className="font-bold text-slate-900 text-lg tracking-tight">ISO Standards</span>
              </div>
              <p className="text-sm text-slate-500 font-medium">Premium Medical Infrastructure</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-primary tracking-[0.3em] uppercase">The Prime Story</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Premium Care. <br /> Proven Expertise.
              </h3>
            </div>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
              <p>
                Founded to serve as a beacon of health in Eastern Nepal, <strong className="text-slate-900 font-bold">Prime Hospital</strong> integrates high-end diagnostic capabilities with a specialized team of 
                consultants.
              </p>
              <p>
                Our facility is uniquely equipped to handle complex cases, featuring 
                <span className="text-slate-900 font-semibold"> 24/7 Emergency Trauma Surgery</span>, a high-precision 
                <span className="text-slate-900 font-semibold"> CT Scan wing</span>, 
                and specialized <span className="text-slate-900 font-semibold">NICU/PICU units</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <Clock className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <span className="font-bold text-slate-800 tracking-tight">24/7 Response</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <Microscope className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <span className="font-bold text-slate-800 tracking-tight">Auto Lab</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Core Values: Minimalist High-Transparency Grid */}
    <section className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-slate-400 tracking-[0.4em] uppercase mb-3">The Prime Promise</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Our Core Values</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="group bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner">
                <v.icon size={26} strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-slate-900 tracking-tight group-hover:text-primary transition-colors">{v.title}</h4>
              <p className="text-slate-500 text-[15px] leading-relaxed font-light">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

  </div>
);

export default About;