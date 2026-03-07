import React from "react";
import { useParams, Link } from "react-router-dom";
import {
    ChevronRight, Clock, Award, Activity,
    ShieldCheck, PhoneCall, Stethoscope, Heart,
    Baby, Syringe, Biohazard, Eye, Zap,
    Settings, Pill, Microscope, Ear, Smile, Scissors,
    User
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";

// Color Constant for easy maintenance
const BRAND_COLOR = "rgba(15, 23, 42, 1)";

const departmentBanners = {
    cardiology: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=2000",
    pediatrics: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=2000",
    radiology: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=2000",
    emergency: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=2000",
    "general-laparoscopic": "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2000",
    pathology: "https://images.unsplash.com/photo-1579152276506-5d5ef2693ae8?auto=format&fit=crop&q=80&w=2000",
    orthopedics: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000",
    ophthalology: "https://images.unsplash.com/photo-1582719201913-342b4cd501b1?auto=format&fit=crop&q=80&w=2000",
    "obs-gynae": "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=2000",
    "ent-dental": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2000",
    pharmacy: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=2000",
    "internal-medicine": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=2000",
};

const departmentContent = {
    cardiology: {
        title: "Cardiology",
        tagline: "Precision Heart Care",
        icon: <Heart />,
        longDescription: "Our Cardiology department is a center of excellence for heart health. We combine world-class expertise with the latest interventional technologies to treat complex cardiovascular conditions.",
        services: ["24/7 Primary PCI (Angioplasty)", "Advanced Cath Lab Procedures", "Echocardiography & TMT", "Permanent Pacemaker Implantation"],
        highlights: ["98% Success Rate", "10k+ Procedures", "Interventional Specialists"],
    },
    pediatrics: {
        title: "Pediatrics & NICU",
        tagline: "Specialized Care for Little Heroes",
        icon: <Baby />,
        longDescription: "Equipped with a Level III NICU and PICU, our pediatric department provides a nurturing environment for newborns and children with 24/7 specialist coverage.",
        services: ["Level III NICU/PICU", "Pediatric Emergency Care", "Vaccination & Immunization", "Growth & Nutrition Clinics"],
        highlights: ["24/7 Neonatologist", "Advanced Life Support", "Child-Friendly Ward"],
    },
    "general-laparoscopic": {
        title: "Laparoscopic Surgery",
        tagline: "Minimally Invasive. Maximum Recovery.",
        icon: <Scissors />,
        longDescription: "Specializing in 'keyhole' surgeries that ensure minimal scarring and faster recovery times for abdominal and trauma procedures.",
        services: ["Laparoscopic Cholecystectomy", "Hernia & Appendix Repair", "Colorectal Surgery", "Trauma & Emergency Surgery"],
        highlights: ["Minimal Scarring", "Quick Discharge", "Modular OT Suites"],
    },
    radiology: {
        title: "Radiology & Imaging",
        tagline: "Crystal Clear Diagnostics",
        icon: <Settings />,
        longDescription: "High-resolution imaging including 128-Slice CT and MRI scanners to provide detailed insights for precise surgical planning.",
        services: ["128-Slice CT Scan", "High-Res Ultrasound & Doppler", "Digital X-Ray (DR System)", "Guided Biopsies"],
        highlights: ["Low Radiation", "Instant Digital Reports", "Open 24/7"],
    },
    pathology: {
        title: "Pathology Lab",
        tagline: "Accuracy in Every Result",
        icon: <Microscope />,
        longDescription: "A fully automated laboratory providing a range of tests from routine hematology to advanced molecular histopathology.",
        services: ["Automated Biochemistry", "Advanced Histopathology", "Microbiology & Culture", "Home Sample Collection"],
        highlights: ["NABL Standards", "Fully Automated", "Rapid Turnaround"],
    },
    "obs-gynae": {
        title: "Obs & Gynae",
        tagline: "Compassion in Every Step",
        icon: <Syringe />,
        longDescription: "Comprehensive maternity and women's health. We offer painless delivery, high-risk pregnancy management, and infertility support.",
        services: ["Painless Delivery", "High-Risk Pregnancy Care", "Laparoscopic Gynae Surgery", "Infertility & IVF Support"],
        highlights: ["Private Labor Suites", "Expert Midwifery", "Postnatal Support"],
    },
    orthopedics: {
        title: "Orthopedics",
        tagline: "Restoring Your Mobility",
        icon: <Activity />,
        longDescription: "Specializing in joint replacements, arthroscopic sports surgery, and complex fracture management using the latest technology.",
        services: ["Joint Replacement (Knee/Hip)", "Arthroscopic Surgery", "Complex Fracture Management", "Spine Surgery"],
        highlights: ["99% Mobility Success", "Latest Implants", "Expert Physiotherapy"],
    },
    ophthalmology: {
        title: "Ophthalmology",
        tagline: "Vision for a Better Future",
        icon: <Eye />,
        longDescription: "Advanced eye care ranging from routine exams to complex cataract surgeries using Phaco-emulsification technology.",
        services: ["Phaco Cataract Surgery", "Glaucoma Management", "Retina Consultation", "Refractive Correction"],
        highlights: ["Painless Surgery", "Same-Day Discharge", "Premium Lenses"],
    },
    emergency: {
        title: "Emergency & Trauma",
        tagline: "Ready for Any Crisis",
        icon: <Biohazard />,
        longDescription: "Rapid response trauma unit with ACLS-certified staff. We specialize in cardiac emergencies and acute stroke management.",
        services: ["24/7 Trauma Care", "Cardiac Emergency Response", "ACLS Ambulance", "Acute Stroke Management"],
        highlights: ["Immediate Response", "Golden Hour Care", "24/7 Specialists"],
    },
    "ent-dental": {
        title: "ENT & Dental",
        tagline: "Head & Neck Specialization",
        icon: <Ear />,
        longDescription: "Integrated care for ear, nose, throat, and oral health, including microscopic surgeries and cosmetic dentistry.",
        services: ["Microscopic ENT Surgery", "Hearing & Balance Center", "Cosmetic Dentistry", "Oral Surgery"],
        highlights: ["Multidisciplinary", "Modern Dental Lab", "Advanced ENT Scope"],
    },
    pharmacy: {
        title: "Pharmacy",
        tagline: "Authentic Care, 24/7",
        icon: <Pill />,
        longDescription: "Fully stocked in-house pharmacy with refrigerated storage and door-step delivery for life-saving medications.",
        services: ["24/7 Availability", "Authentic Medicines", "Refrigerated Storage", "Home Delivery"],
        highlights: ["100% Genuine", "Full Stocked", "Expert Pharmacists"],
    },
    "internal-medicine": {
        title: "Internal Medicine",
        tagline: "Comprehensive Adult Health",
        icon: <User style={{ color: BRAND_COLOR }} />,
        longDescription: "Managing chronic conditions like diabetes, hypertension, and infectious diseases with a holistic approach.",
        services: ["Diabetes & HTN Care", "Infectious Disease", "Geriatric Medicine", "Preventive Health"],
        highlights: ["Holistic Approach", "Chronic Disease Experts", "Personalized Plans"],
    },
};

const allDoctors = [
    { name: "Dr. Ramesh Chaurasia", specialty: "Nephrology", deptKey: "internal-medicine", qualification: "MD, DM (Nephrology)", image: "https://i.imgur.com/oOneoU6.jpg", available: true, experience: "10 years" },
    { name: "Dr. Sangeeta Mishra", specialty: "Obstetrics & Gynecology", deptKey: "obs-gynae", qualification: "MBBS, MS (OB-GYN)", image: "https://i.imgur.com/Vu3ObhC.jpg", available: true, experience: "10 years" },
    { name: "Dr. Ajay Mahato", specialty: "Orthopedic Surgery", deptKey: "orthopedics", qualification: "MBBS, MS (Ortho) - AIIMS", image: "https://i.imgur.com/0PmSuNt.jpg", available: true, experience: "10 years" },
    { name: "Dr. Manish Agrawal", specialty: "General Surgery", deptKey: "general-laparoscopic", qualification: "MBBS, MS (Surgery)", image: "https://i.imgur.com/ASdmiN1.jpg", available: true, experience: "10 years" },
    { name: "Dr. Ranjeev Yadav", specialty: "Radiology", deptKey: "radiology", qualification: "MBBS, MD (Radiology)", image: "https://i.imgur.com/b9KM8o5.jpg", available: true, experience: "10 years" },
    { name: "Dr. Shrijana Yadav", specialty: "Pathology", deptKey: "pathology", qualification: "MBBS, MD (Pathology)", image: "https://i.imgur.com/sAWlGhC.jpg", available: true, experience: "10 years" },
    { name: "Dr. Tek Narayan Yadav", specialty: "Laparoscopic Surgeon", deptKey: "general-laparoscopic", qualification: "MBBS, MS, MCh", image: "https://i.imgur.com/QaeLFUy.jpg", available: true, experience: "10 years" },
];

const DepartmentDetail = () => {
    const { slug } = useParams();
    const dept = departmentContent[slug];
    const banner = departmentBanners[slug] || departmentBanners.emergency;

    const filteredDoctors = allDoctors.filter(doc => doc.deptKey === slug);

    if (!dept) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <h2 className="text-3xl font-bold">Department Not Found</h2>
            <Link to="/departments" className="mt-4 font-bold hover:underline" style={{ color: BRAND_COLOR }}>Explore All Departments</Link>
        </div>
    );

    return (
        <div className="bg-background font-sans text-foreground min-h-screen">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative h-[55vh] flex items-center overflow-hidden">
                <img src={banner} alt={dept.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 container mx-auto px-6">
                    <nav className="flex items-center gap-2 text-xs uppercase tracking-widest mb-6 text-white/60">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/departments" className="hover:text-white transition-colors">Departments</Link>
                    </nav>
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-full shadow-lg" style={{ backgroundColor: BRAND_COLOR, color: '#fff' }}>
                                {React.cloneElement(dept.icon, { size: 28 })}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                                {dept.title}
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-white font-medium italic max-w-xl">
                            "{dept.tagline}"
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <div className="container mx-auto px-6 -mt-16 relative z-20 pb-24">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* MAIN COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-card p-8 md:p-12 rounded-[var(--radius)] shadow-2xl border border-border">
                            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-3">
                                <ShieldCheck style={{ color: BRAND_COLOR }} size={24} />
                                About the Department
                            </h2>

                            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
                                {dept.longDescription}
                            </p>

                            <h3 className="text-xl font-bold mb-6 text-card-foreground border-l-4 pl-4 uppercase tracking-wide" style={{ borderColor: BRAND_COLOR }}>
                                Key Services
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-12">
                                {dept.services.map((service, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 rounded-xl bg-secondary/20 border border-border hover:border-slate-800 transition-all group">
                                        <div className="p-2 rounded-lg transition-all group-hover:bg-slate-900 group-hover:text-white" style={{ backgroundColor: 'rgba(15, 23, 42, 0.1)', color: BRAND_COLOR }}>
                                            <Stethoscope size={18} />
                                        </div>
                                        <span className="font-semibold text-card-foreground">{service}</span>
                                    </div>
                                ))}
                            </div>

                            {/* HIGHLIGHTS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {dept.highlights.map((h, i) => (
                                    <div key={i} style={{ backgroundColor: BRAND_COLOR }} className="text-center p-6 rounded-2xl text-white shadow-lg transition-transform hover:-translate-y-1">
                                        <Activity className="mx-auto mb-2 opacity-50" size={20} />
                                        <span className="font-bold text-xs uppercase tracking-widest block">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DYNAMIC DOCTORS SECTION */}
                        {filteredDoctors.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-foreground px-2">Meet Our Specialists</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {filteredDoctors.map((doc) => (
                                        <div key={doc.name} className="bg-card border border-border rounded-[var(--radius)] p-6 flex items-center gap-5 hover:shadow-xl transition-all border-l-4" style={{ borderLeftColor: BRAND_COLOR }}>
                                            <img src={doc.image} alt={doc.name} className="w-20 h-20 rounded-full object-cover border-2 border-secondary" />
                                            <div>
                                                <h4 className="font-bold text-card-foreground leading-tight">{doc.name}</h4>
                                                <p className="text-xs font-bold mb-1 uppercase tracking-tighter" style={{ color: BRAND_COLOR }}>{doc.specialty}</p>
                                                <p className="text-[10px] text-muted-foreground mb-3">{doc.qualification}</p>
                                                <Badge variant="secondary" className="text-[10px]">
                                                    {doc.experience} Experience
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        <div style={{ backgroundColor: BRAND_COLOR }} className="p-10 rounded-[var(--radius)] text-white shadow-2xl relative overflow-hidden group">
                            <Award className="text-white/40 mb-6" size={48} />
                            <h3 className="text-2xl font-bold mb-4">Patient-First Care</h3>
                            <p className="text-white/80 leading-relaxed mb-8">
                                Book your session with our specialists and experience the highest medical standards.
                            </p>
                            <Link to="/appointments" className="block text-center bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-100 transition-all shadow-lg uppercase text-sm tracking-widest">
                                Book Appointment
                            </Link>
                        </div>

                        <div className="bg-card p-8 rounded-[var(--radius)] border border-border text-center shadow-lg">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="text-destructive" size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-foreground">Emergency Support</h4>
                            <p className="text-muted-foreground text-sm mb-6 font-medium">Immediate care available 24/7</p>
                            <a href="tel:021-XXXXXX" className="block border-2 border-destructive text-destructive font-bold py-3 rounded-xl hover:bg-destructive hover:text-white transition-all shadow-md">
                                Call Emergency
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetail;