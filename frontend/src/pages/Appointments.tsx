import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CalendarCheck, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck 
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const CustomBadge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${className}`}>
    {children}
  </div>
);

const departments = [
  "Cardiology", "General Medicine", "Pediatrics", "Neurology", "Orthopedics",
  "Ophthalmology", "General Surgery", "ENT", "Dental", "Emergency Medicine",
];

const Appointments = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    department: "",
    appointmentDate: "",
    timeSlot: "",
    reason: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Appointment request submitted! Check your email for confirmation.");
        setFormData({
          patientName: "",
          email: "",
          phone: "",
          department: "",
          appointmentDate: "",
          timeSlot: "",
          reason: "",
        });
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-32 md:py-48 flex items-center justify-center text-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: "url('https://i.imgur.com/6VTBj3j.jpg')",
            backgroundPosition: "center 30%" 
          }} 
        />
        <div className="absolute inset-0 bg-black/45 backdrop-brightness-90" />

        <div className="relative container mx-auto px-6 z-10">
          {/* Glass Breadcrumb Pill */}
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <nav className="flex items-center gap-2 text-white text-[10px] font-bold tracking-[0.3em] uppercase">
              <Link to="/" className="hover:opacity-70 transition-opacity text-white">Home</Link>
              <ChevronRight size={10} className="opacity-50 text-white" />
              <span className="opacity-70 text-white">Appointments</span>
            </nav>
          </div>

          {/* Bold/Light Serif Heading */}
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 tracking-tight drop-shadow-lg">
            <span className="font-bold">Book</span> <span className="font-light opacity-90">Appointment</span>
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md backdrop-blur-[2px] py-2">
            Experience premium medical services driven by 
            advanced technology in the heart of Biratnagar.
          </p>
        </div>
      </section>

      {/* --- ENHANCED FORM SECTION --- */}
      <section className="py-24 bg-slate-50/50 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
            
            {/* Left Column: Contact & Stats */}
            <div className="lg:w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-between">
              <div>
                <CustomBadge className="bg-white/10 text-white border-white/20 mb-6">
                  Direct Contact
                </CustomBadge>
                <h3 className="text-3xl font-bold mb-6 font-serif">
                  Get <span className="font-light">in touch</span>
                </h3>
                <p className="text-white/70 leading-relaxed mb-8 font-light">
                  Our dedicated team is ready to help you book your appointment and answer any questions.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-white/60 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 mb-1">Phone</p>
                      <p className="text-sm font-medium text-white">021-517777</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-white/60 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 mb-1">Email</p>
                      <p className="text-sm font-medium text-white">info@primehospital.com.np</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 text-green-400 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Front Desk Active</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Clock size={14} />
                    <span className="text-xs">Response time: ~15 mins</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <ShieldCheck size={14} />
                    <span className="text-xs">100% Secure Booking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:w-2/3 p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Schedule Your <span className="font-light opacity-70">Visit</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="+977-1-XXXXXXX"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Time Slot *
                    </label>
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">Select time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Reason for Visit (Optional)
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Describe your symptoms or reason for visit..."
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CalendarCheck size={20} />
                  {loading ? "Booking..." : "Book Appointment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointments;