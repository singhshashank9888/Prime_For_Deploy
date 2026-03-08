import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Stethoscope,
  Baby,
  Brain,
  Bone,
  Eye,
  Clock,
  Award,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Slider from "react-slick";

// Hero images
const heroImages = [
  "https://i.imgur.com/XOtGHPL.jpg",
  "https://i.imgur.com/2Ij1JIQ.jpg",
  "https://i.imgur.com/RaWuN9i.jpg",
  "https://i.imgur.com/UAtihd2.jpg",
  "https://i.imgur.com/UkVdNir.jpg",
];

const departments = [
  { name: "Cardiology", icon: Heart, desc: "Heart & cardiovascular care" },
  { name: "General Medicine", icon: Stethoscope, desc: "Primary healthcare services" },
  { name: "Pediatrics", icon: Baby, desc: "Children's healthcare" },
  { name: "Neurology", icon: Brain, desc: "Brain & nervous system" },
  { name: "Orthopedics", icon: Bone, desc: "Bone & joint care" },
  { name: "Ophthalmology", icon: Eye, desc: "Eye care & surgery" },
];

const stats = [
  { value: "1+", label: "Year of Service", icon: Clock },
  { value: "10+", label: "Expert Doctors", icon: Users },
  { value: "15+", label: "Departments", icon: Award },
  { value: "1000+", label: "Patients Served", icon: Heart },
];

// Restored & Modernized Custom Arrows
const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 hidden lg:flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all active:scale-90"
    >
      <ChevronLeft size={24} />
    </button>
  );
};

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 hidden lg:flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all active:scale-90"
    >
      <ChevronRight size={24} />
    </button>
  );
};

const sliderSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
  fade: true,
  swipe: true,
  touchMove: true,
  dotsClass: "slick-dots custom-dots",
};

const Index = () => {
  return (
    <div className="bg-white font-sans antialiased text-slate-900">

      {/* --- 1. HERO SLIDER SECTION --- */}
      <section className="relative h-[95vh] min-h-[700px] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 w-full h-full z-0">
          <Slider {...sliderSettings} className="h-full w-full">
            {heroImages.map((img, idx) => (
              <div key={idx} className="relative h-[95vh] min-h-[700px]">
                <img
                  src={img}
                  alt={`Hero ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5000ms] scale-110"
                />
                <div className="absolute inset-0 bg-black/45 backdrop-brightness-95" />
              </div>
            ))}
          </Slider>
        </div>

        <div className="relative z-10 container mx-auto px-6 h-full flex items-center pointer-events-none">
          <div className="max-w-4xl text-center md:text-left w-full pointer-events-auto">
            <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <p className="text-white text-[10px] font-bold tracking-[0.3em] uppercase">
                Premium Multi-Specialty Institution
              </p>
            </div>

            {/* Title: No Italics, Bold/Light Mix */}
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 tracking-tight drop-shadow-lg leading-[1.1]">
              <span className="font-light">In the</span> <span className="font-bold">Heart</span><br />
              <span className="font-light">of</span> <span className="font-bold">Biratnagar</span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-medium drop-shadow-md backdrop-blur-[2px] py-2">
              Prime Hospital integrates world-class clinical expertise with
              state-of-the-art diagnostic technology for our community.
            </p>

            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
              <Link to="/appointments">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200 font-bold px-10 h-16 rounded-full shadow-2xl transition-all active:scale-95">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/departments">
                <Button size="lg" className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 font-bold px-10 h-16 rounded-full transition-all">
                  Our Departments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. STATS SECTION --- */}
      <section className="relative -mt-16 z-20 container mx-auto px-6">
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl border border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((s) => (
              <div key={s.label} className="group flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-2 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                  <s.icon size={24} />
                </div>
                <span className="text-4xl font-bold tracking-tighter">{s.value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. DEPARTMENTS PREVIEW --- */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mb-4">Specialties</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">
              <span className="font-bold text-slate-900">Our</span> <span className="font-light opacity-90">Departments</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {departments.map((d) => (
              <Link
                key={d.name}
                to={`/departments/${d.name.toLowerCase().replace(/\s+/g, "-")}`} // Converts name to slug
                className="group p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:bg-slate-50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 block"
              >
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner">
                  <d.icon size={26} strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">
                  {d.name}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-light">{d.desc}</p>
                <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-900 gap-2 uppercase tracking-widest mt-4">
                  View Department <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}

            {/* View All Departments Card */}
            <Link
              to="/departments"
              className="group p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:bg-slate-50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center justify-center text-center"
            >
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner">
                <ArrowRight size={26} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">View All Departments</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Explore all our specialized medical services in detail
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* --- 4. DOCTORS CALLOUT --- */}
      <section className="py-24 container mx-auto px-6">
        <div
          className="relative rounded-[3rem] overflow-hidden min-h-[500px] flex items-center group shadow-2xl"
          style={{ backgroundImage: "url('https://i.imgur.com/Qn0pz2o.jpg')", backgroundPosition: "center 25%", backgroundSize: "cover" }}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-all duration-700" />

          <div className="relative z-10 w-full p-12 md:p-24 text-center md:text-left text-white">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
                Meet <span className="font-light opacity-90">Our</span> <br />
                <span className="font-bold">Medical Experts</span>
              </h2>
              <p className="text-white/80 text-lg mb-10 font-light leading-relaxed">
                Experienced and compassionate professionals dedicated to
                providing world-class clinical care to Biratnagar.
              </p>
              <Link to="/doctors">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200 rounded-full font-bold px-12 h-16 shadow-xl active:scale-95 transition-transform">
                  View All Doctors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;