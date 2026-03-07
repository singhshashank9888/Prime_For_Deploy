interface CoverSectionProps {
  imageSrc: string;
  title?: string;
  subtitle?: string;
}

const CoverSection: React.FC<CoverSectionProps> = ({ imageSrc, title, subtitle }) => (
  <section
    className="relative w-full min-h-[110vh] bg-center bg-cover bg-no-repeat flex items-start justify-center"
    style={{ backgroundImage: `url(${imageSrc})` }}
  >
    {/* Light overlay for readability */}
    <div className="absolute inset-0 bg-black/20"></div>

    {/* Text overlay at top */}
    {(title || subtitle) && (
      <div className="relative text-center text-white px-4 mt-20 max-w-3xl">
        {title && (
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-lg md:text-2xl drop-shadow-md">{subtitle}</p>
        )}
      </div>
    )}
  </section>
);

export default CoverSection;