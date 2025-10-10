import React from "react";

type CardSize = "small" | "medium" | "large";

interface TestimonialCardProps {
  quoteText: string;
  mainText: string;
  name: string;
  location: string;
  subText: string;
  quoteColor: string;
  separatorColor: string;
  size: CardSize;
}

const sizeClasses: Record<CardSize, string> = {
  small: "max-w-xs p-6 sm:p-8 text-sm",
  medium: "max-w-sm p-8 sm:p-10 text-base",
  large: "max-w-md p-10 sm:p-14 text-lg",
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quoteText,
  mainText,
  name,
  location,
  subText,
  quoteColor,
  separatorColor,
  size,
}) => {
  return (
    <div
      className={`relative bg-[#F5F2ED] rounded-2xl shadow-lg overflow-hidden ${sizeClasses[size]} text-[1.8rem] font-medium transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl`}
    >
      {/* Guillemet d'ouverture stylisé */}
      <span
        className="absolute top-2 sm:top-4 left-2 sm:left-4 text-[6rem] sm:text-[8rem] md:text-[10rem] font-bold leading-none"
        style={{ color: quoteColor, opacity: 0.08 }}
      >
        "
      </span>

      {/* Contenu principal */}
      <div className="relative z-10 pt-8 sm:pt-12 px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Première partie du texte */}
        <p className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">{quoteText}</p>

        {/* Deuxième partie du texte */}
        <p className="text-gray-800 mb-4 sm:mb-6 text-sm sm:text-base">{mainText}</p>

        {/* Nom et localisation */}
        <p className="font-semibold text-gray-900 text-sm sm:text-base">
          {name}, {location}
        </p>

        {/* Texte descriptif en petit */}
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{subText}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
