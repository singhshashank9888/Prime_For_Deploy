import Layout from "@/components/layout/Layout";
import CoverSection from "@/components/layout/CoverSection";
import DoctorsSection from "@/components/layout/DoctorsSection";

const DoctorsPage = () => {
  return (
    <Layout>
      {/* Optional cover/banner for Doctors */}
      <CoverSection
        imageSrc="https://i.imgur.com/ChqIN7t.jpg"
        title="Meet Our Doctors"
        subtitle="Experienced, qualified, and compassionate medical professionals"
      />

      {/* Doctors Grid */}
      <DoctorsSection />
    </Layout>
  );
};

export default DoctorsPage;