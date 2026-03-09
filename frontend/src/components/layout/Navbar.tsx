import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import gsap from "gsap";

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

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Prevent background scrolling when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // GSAP Animation for Mobile Menu
      gsap.fromTo(menuRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.5, ease: "power4.out" }
      );
      gsap.fromTo(".mobile-link",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, delay: 0.2, duration: 0.4 }
      );
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

  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${scrolled || isOpen
          ? "bg-white/90 backdrop-blur-md py-3 shadow-lg border-b border-slate-100"
          : "bg-white py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* --- LOGO --- */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 md:gap-3 group relative z-[110]">
          <img
            src="/logo.jpg"
            alt="Prime Hospital Logo"
            className="h-9 md:h-12 w-auto object-contain transition-transform duration-700 group-hover:rotate-[360deg]"
          />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg md:text-2xl tracking-tighter text-slate-950">
              <span className="font-light">PRIME</span>{" "}
              <span className="font-black">HOSPITAL</span>
            </span>
            <span className="text-[7px] md:text-[8px] font-bold tracking-[0.4em] md:tracking-[0.5em] text-slate-400 mt-0.5 md:mt-1 uppercase">
              Biratnagar
            </span>
          </div>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.slice(0, 2).map((link) => (
            <NavLink key={link.path} to={link.path} className="nav-link-style">
              {({ isActive }) => (
                <span className="flex flex-col items-center group text-[10px] xl:text-[11px] uppercase tracking-widest font-bold text-slate-500 hover:text-black transition-colors">
                  {link.name}
                  <span className={`h-[2px] bg-black transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </span>
              )}
            </NavLink>
          ))}

          {/* DEPARTMENTS DROPDOWN */}
          <div className="relative" onMouseEnter={() => setDeptOpen(true)} onMouseLeave={() => setDeptOpen(false)}>
            <button className="text-[10px] xl:text-[11px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-1 hover:text-black transition-colors">
              Departments <ChevronDown size={12} className={`transition-transform duration-300 ${deptOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-xl p-6 w-80 border border-slate-100 transition-all duration-300 ${deptOpen ? "opacity-100 visible translate-y-4" : "opacity-0 invisible translate-y-2"}`}>
              <Link to="/departments" className="block text-[11px] font-black border-b border-slate-100 pb-2 mb-3 hover:text-primary transition-colors">VIEW ALL DEPARTMENTS</Link>
              <div className="grid grid-cols-1 gap-2">
                {departmentLinks.slice(0, 10).map((dept) => (
                  <Link key={dept.path} to={dept.path} className="text-[11px] text-slate-500 hover:text-black hover:translate-x-1 transition-all">{dept.name}</Link>
                ))}
                {departmentLinks.length > 10 && (
                  <Link to="/departments" className="text-[10px] text-primary font-bold italic mt-1">+ More Specialities</Link>
                )}
              </div>
            </div>
          </div>

          {navLinks.slice(2).map((link) => (
            <NavLink key={link.path} to={link.path} className="nav-link-style">
              {({ isActive }) => (
                <span className="flex flex-col items-center group text-[10px] xl:text-[11px] uppercase tracking-widest font-bold text-slate-500 hover:text-black transition-colors">
                  {link.name}
                  <span className={`h-[2px] bg-black transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </span>
              )}
            </NavLink>
          ))}

          <Link to="/admin/dashboard" className="bg-slate-950 text-white px-5 py-2.5 rounded-full text-[10px] xl:text-[11px] font-bold tracking-widest hover:bg-primary transition-all shadow-lg hover:shadow-primary/20">
            ADMIN
          </Link>
        </div>

        {/* --- MOBILE BUTTON --- */}
        <div className="flex items-center gap-4 lg:hidden">
          <a href="tel:021517777" className="p-2 bg-red-50 text-red-600 rounded-full md:hidden" aria-label="Call Emergency">
            <Phone size={18} />
          </a>
          <button
            className="relative z-[110] text-slate-950 p-2 hover:bg-slate-50 rounded-full transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* --- MOBILE MENU OVERLAY --- */}
        <div
          ref={menuRef}
          className={`fixed inset-0 bg-white z-[100] flex flex-col pt-24 px-6 md:px-12 transition-all duration-500 ease-in-out lg:hidden overflow-y-auto ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-full"
            }`}
        >
          <div className="flex flex-col space-y-4 md:space-y-6 pb-12">
            {navLinks.slice(0, 2).map((link) => (
              <NavLink key={link.path} to={link.path} onClick={closeMenu} className="mobile-link text-3xl md:text-4xl font-serif border-b border-slate-50 pb-3 hover:text-primary transition-colors">
                {link.name}
              </NavLink>
            ))}

            {/* Mobile Dept Accordion */}
            <div className="mobile-link">
              <button
                onClick={() => setMobileDeptOpen(!mobileDeptOpen)}
                className="text-3xl md:text-4xl font-serif flex justify-between items-center w-full border-b border-slate-50 pb-3 hover:text-primary transition-colors"
              >
                Departments <ChevronDown className={`transition-transform duration-300 ${mobileDeptOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${mobileDeptOpen ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="bg-slate-50 rounded-2xl p-5 grid gap-4">
                  <Link to="/departments" onClick={closeMenu} className="font-bold text-slate-900 border-b border-slate-200 pb-2">View All Specialities</Link>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {departmentLinks.map(dept => (
                      <Link key={dept.path} to={dept.path} onClick={closeMenu} className="text-slate-600 text-sm hover:text-black transition-colors">{dept.name}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {navLinks.slice(2).map((link) => (
              <NavLink key={link.path} to={link.path} onClick={closeMenu} className="mobile-link text-3xl md:text-4xl font-serif border-b border-slate-50 pb-3 hover:text-primary transition-colors">
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/admin/dashboard"
              onClick={closeMenu}
              className="mobile-link bg-slate-950 text-white text-center py-5 rounded-2xl font-bold tracking-widest text-lg shadow-xl shadow-slate-200 mt-4 active:scale-95 transition-transform"
            >
              ADMIN ACCESS
            </Link>

            <div className="mobile-link mt-8 p-8 bg-red-50 rounded-[2rem] border border-red-100 flex flex-col items-center text-center">
              <p className="text-[10px] font-bold text-red-400 tracking-[0.3em] uppercase mb-2">Emergency Helpline</p>
              <a href="tel:021517777" className="text-3xl md:text-4xl font-black text-red-600 tracking-tighter hover:scale-105 transition-transform inline-flex items-center gap-3">
                <Phone size={28} />
                021-517777
              </a>
              <p className="text-[10px] text-red-300 mt-3 italic font-medium">Available 24/7 for critical care</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;