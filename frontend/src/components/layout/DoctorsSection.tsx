import { Badge } from "@/components/ui/badge";

const doctors = [
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
  {
    name: "Dr. Tek Narayan Yadav",
    specialty: "Senior Laparoscopic and GI Surgeon",
    qualification:
      "MBBS (BPKIHS), MS (General Surgery) PGIMER, MCh (Surgical Gastroenterology) BPKIHS",
    image: "https://i.imgur.com/QaeLFUy.jpg",
    available: true,
    experience: "10 years",
  },
];

const DoctorsSection = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      
      {/* Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">
          Meet Our Team
        </p>

        <h2 className="font-display text-4xl font-bold text-foreground">
          Our Doctors
        </h2>

        <p className="text-muted-foreground mt-4">
          Experienced, qualified, and compassionate — our medical team is
          dedicated to your well-being.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {doctors.map((doc) => (
          <div
            key={doc.name}
            className="bg-card border border-border rounded-[var(--radius)] p-8 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image */}
            <div className="flex justify-center mb-5">
              <img
                src={doc.image}
                alt={doc.name}
                loading="lazy"
                className="w-24 h-24 object-cover rounded-full border-4 border-primary"
              />
            </div>

            {/* Name */}
            <h3 className="font-display text-lg font-semibold text-card-foreground">
              {doc.name}
            </h3>

            {/* Specialty */}
            <Badge className="mt-3 bg-secondary text-secondary-foreground">
              {doc.specialty}
            </Badge>

            {/* Qualification */}
            <p className="text-sm text-muted-foreground mt-4">
              {doc.qualification}
            </p>

            {/* Experience */}
            <p className="text-sm text-muted-foreground">
              {doc.experience} experience
            </p>

            {/* Availability */}
            <p
              className={`text-sm font-medium mt-4 ${
                doc.available
                  ? "text-primary"
                  : "text-destructive"
              }`}
            >
              {doc.available ? "Available Today" : "Not Available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DoctorsSection;