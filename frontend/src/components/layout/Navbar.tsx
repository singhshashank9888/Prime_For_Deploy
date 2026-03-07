import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const departmentLinks = [
  { name: "General & Laparoscopic", path: "/departments/general-laparoscopic" },
  { name: "Pediatrics (NICU/PICU)", path: "/departments/pediatrics" },
  { name: "Cardiology", path: "/departments/cardiology" },
  { name: "Radiology & Imaging", path: "/departments/radiology" },
  { name: "Pathology Lab", path: "/departments/pathology" },
  { name: "Internal Medicine", path: "/departments/internal-medicine" },
  { name: "Orthopedics", path: "/departments/orthopedics" },
  { name: "Ophthalmology", path: "/departments/ophthalmology" },
  { name: "Emergency & Trauma", path: "/departments/emergency" },
  { name: "ENT & Dental", path: "/departments/ent-dental" },
  { name: "Pharmacy", path: "/departments/pharmacy" },
  { name: "Obs & Gynae", path: "/departments/obs-gynae" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [mobileDeptOpen, setMobileDeptOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Prevent background scrolling when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Doctors", path: "/doctors" },
    { name: "Appointments", path: "/appointments" },
    { name: "My Reports", path: "/view-reports" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-white py-3 shadow-lg border-b border-slate-100"
          : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-3 group relative z-[110]">
          <img
            src="/logo.jpg"
            alt="Prime Hospital Logo"
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-700 group-hover:rotate-[360deg]"
          />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl md:text-2xl tracking-tighter text-slate-950">
              <span className="font-light">PRIME</span>{" "}
              <span className="font-black">HOSPITAL</span>
            </span>
            <span className="text-[8px] font-bold tracking-[0.5em] text-slate-400 mt-1 uppercase">
              Biratnagar
            </span>
          </div>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.slice(0, 2).map((link) => (
            <NavLink key={link.path} to={link.path} className="nav-link-style">
              {({ isActive }) => (
                <span className="flex flex-col items-center group text-[11px] uppercase tracking-widest font-bold text-slate-500 hover:text-black">
                  {link.name}
                  <span className={`h-[2px] bg-black transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </span>
              )}
            </NavLink>
          ))}

          {/* DEPARTMENTS DROPDOWN */}
          <div className="relative" onMouseEnter={() => setDeptOpen(true)} onMouseLeave={() => setDeptOpen(false)}>
            <button className="text-[11px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-1">
              Departments <ChevronDown size={12} />
            </button>
            <div className={`absolute top-full left-0 bg-white shadow-2xl rounded-xl p-6 w-72 border border-slate-100 transition-all ${deptOpen ? "opacity-100 visible translate-y-2" : "opacity-0 invisible"}`}>
              <Link to="/departments" className="block text-[11px] font-black border-b pb-2 mb-2">VIEW ALL</Link>
              <div className="grid gap-2">
                {departmentLinks.map((dept) => (
                  <Link key={dept.path} to={dept.path} className="text-[11px] text-slate-500 hover:text-black transition-colors">{dept.name}</Link>
                ))}
              </div>
            </div>
          </div>

          {navLinks.slice(2).map((link) => (
            <NavLink key={link.path} to={link.path} className="nav-link-style">
               {({ isActive }) => (
                <span className="flex flex-col items-center group text-[11px] uppercase tracking-widest font-bold text-slate-500 hover:text-black">
                  {link.name}
                  <span className={`h-[2px] bg-black transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </span>
              )}
            </NavLink>
          ))}

          <Link to="/admin/dashboard" className="bg-slate-950 text-white px-5 py-2 rounded-lg text-[11px] font-bold tracking-widest hover:bg-slate-800 transition-all">
            ADMIN
          </Link>
        </div>

        {/* --- MOBILE BUTTON --- */}
        <button
          className="lg:hidden relative z-[110] text-slate-950 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* --- MOBILE MENU OVERLAY --- */}
        <div
          className={`fixed inset-0 bg-white z-[100] flex flex-col pt-24 px-8 transition-transform duration-500 ease-in-out lg:hidden overflow-y-auto ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col space-y-6 pb-12">
            {navLinks.slice(0, 2).map((link) => (
              <NavLink key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="text-3xl font-serif border-b border-slate-50 pb-2">
                {link.name}
              </NavLink>
            ))}

            {/* Mobile Dept Accordion */}
            <div>
              <button 
                onClick={() => setMobileDeptOpen(!mobileDeptOpen)}
                className="text-3xl font-serif flex justify-between items-center w-full border-b border-slate-50 pb-2"
              >
                Departments <ChevronDown className={mobileDeptOpen ? "rotate-180" : ""} />
              </button>
              {mobileDeptOpen && (
                <div className="bg-slate-50 rounded-xl p-4 mt-2 grid gap-4">
                  <Link to="/departments" onClick={() => setIsOpen(false)} className="font-bold text-slate-900">View All</Link>
                  {departmentLinks.map(dept => (
                    <Link key={dept.path} to={dept.path} onClick={() => setIsOpen(false)} className="text-slate-600">{dept.name}</Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <NavLink key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="text-3xl font-serif border-b border-slate-50 pb-2">
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="bg-slate-950 text-white text-center py-4 rounded-xl font-bold tracking-widest"
            >
              ADMIN ACCESS
            </Link>

            <div className="mt-8 p-6 bg-red-50 rounded-2xl">
              <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-1">Emergency</p>
              <a href="tel:021517777" className="text-2xl font-black text-red-600">021-517777</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;