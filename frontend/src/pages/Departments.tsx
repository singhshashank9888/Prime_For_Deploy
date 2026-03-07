import React from "react";
import {
  Heart,
  Stethoscope,
  Baby,
  Bone,
  Eye,
  Pill,
  Scissors,
  Activity,
  Microscope,
  Ear,
  Zap,
  Users,
  ChevronRight,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const departments = [
  { name: "General & Laparoscopic", slug: "general-laparoscopic", icon: Scissors, desc: "Advanced minimally invasive and trauma surgical care." },
  { name: "Pediatrics (NICU/PICU)", slug: "pediatrics", icon: Baby, desc: "Specialized intensive care for newborns and children." },
  { name: "Cardiology", slug: "cardiology", icon: Heart, desc: "Comprehensive heart and vascular care services." },
  { name: "Radiology & Imaging", slug: "radiology", icon: Zap, desc: "CT Scan, Ultrasound, and advanced diagnostic imaging." },
  { name: "Pathology Lab", slug: "pathology", icon: Microscope, desc: "Fully automated diagnostic laboratory services." },
  { name: "Internal Medicine", slug: "internal-medicine", icon: Stethoscope, desc: "Expert chronic disease and specialty clinic management." },
  { name: "Orthopedics", slug: "orthopedics", icon: Bone, desc: "Advanced bone, joint, and trauma treatment." },
  { name: "Ophthalmology", slug: "ophthalmology", icon: Eye, desc: "Comprehensive eye care and micro-surgery." },
  { name: "Emergency & Trauma", slug: "emergency", icon: Activity, desc: "24/7 emergency response and critical care." },
  { name: "ENT & Dental", slug: "ent-dental", icon: Ear, desc: "Ear, Nose, Throat and dental services." },
  { name: "Pharmacy", slug: "pharmacy", icon: Pill, desc: "24-hour in-house pharmaceutical service." },
  { name: "Obs & Gynae", slug: "obs-gynae", icon: Users, desc: "Comprehensive maternity and women’s healthcare." },
];

const Departments = () => {
  return (
    <div className="bg-white min-h-screen text-slate-900">

      {/* HERO */}
      <section className="relative py-40 bg-slate-900 text-center text-white">
        <div className="container mx-auto px-6">
          <nav className="flex justify-center items-center gap-2 text-xs uppercase tracking-widest mb-6">
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <span>Departments</span>
          </nav>

          <h1 className="text-6xl font-bold tracking-tight">
            Our Departments
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-slate-300 text-lg">
            Premium multi-specialty healthcare services in Biratnagar.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((d) => (
              <Link
                key={d.slug}
                to={`/departments/${d.slug}`}
                className="group p-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 block"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                  <d.icon size={26} strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">
                  {d.name}
                </h3>

                <p className="text-slate-500 leading-relaxed mb-8 text-[15px]">
                  {d.desc}
                </p>

                <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-900 gap-2 uppercase tracking-widest">
                  View Department
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-slate-900 rounded-[3rem] p-16 text-center text-white shadow-2xl">
            <Clock className="mx-auto mb-6 text-white/40" size={28} />
            <h2 className="text-4xl font-bold mb-4">
              24/7 Emergency Response
            </h2>
            <p className="text-slate-400 mb-10">
              Critical care units operational every minute of every day.
            </p>
            <Button asChild size="lg" className="rounded-full px-12 h-14 bg-white text-slate-900 hover:bg-slate-200">
              <Link to="/contact">Emergency Helpline</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Departments;