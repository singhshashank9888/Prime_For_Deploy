import { Phone } from "lucide-react";

const EmergencyBanner = () => (
  <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-500 text-white shadow-md">
    <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base font-semibold tracking-wide">

      {/* Emergency Badge */}
      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/25 shadow-sm">
        <Phone className="h-5 w-5 text-white animate-pulse" />
        <span className="uppercase text-xs sm:text-sm tracking-wider">24/7 Emergency</span>
      </div>

      {/* Phone Numbers */}
      <div className="flex items-center gap-4">
        <a 
          href="tel:021517777" 
          className="hover:scale-105 transition-transform duration-200 underline underline-offset-4"
        >
          021-517777
        </a>

        <span className="opacity-70 hidden sm:inline">|</span>

        <a 
          href="tel:9705300777" 
          className="hover:scale-105 transition-transform duration-200 underline underline-offset-4"
        >
          9705300777
        </a>
      </div>

    </div>
  </div>
);

export default EmergencyBanner;