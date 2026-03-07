import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <span className="font-serif text-2xl tracking-tight">
                <span className="font-light">Prime</span> <span className="font-bold">Hospital</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-light max-w-xs">
              Redefining healthcare in Biratnagar through world-class clinical excellence and a compassionate, patient-first approach.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">Navigation</h4>
            <ul className="space-y-4">
              {["About", "Departments", "Doctors", "Appointments", "Gallery"].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="group flex items-center text-sm font-light text-slate-300 hover:text-white transition-colors"
                  >
                    {item}
                    <ArrowUpRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">Contact</h4>
            <ul className="space-y-5 text-sm font-light text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-slate-500 mt-0.5" />
                <span>Biratnagar-4, Morang, Nepal</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone size={16} className="text-slate-500" />
                <a href="tel:021517777">021-517777</a>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail size={16} className="text-slate-500" />
                <a href="mailto:info@primehospital.com.np">info@primehospital.com.np</a>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <Facebook size={16} className="text-slate-500" />
                <a href="https://facebook.com/primehospitalbrt" target="_blank" rel="noreferrer">Facebook Page</a>
              </li>
            </ul>
          </div>

          {/* Operations */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">Operations</h4>
            <ul className="space-y-4 text-sm font-light text-slate-300">
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-slate-500" />
                <span>OPD: Sun–Fri (8AM–5PM)</span>
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Emergency: 24/7 Available</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-slate-500" />
                <span>Pharmacy: 24/7 Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-slate-600">
            © {currentYear} Prime Hospital Biratnagar. Professional Care.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-slate-600">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;