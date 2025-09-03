import React from "react";

type CardSize = "small" | "medium" | "large";

interface TestimonialCardProps {
  quoteText: string; // Texte de la première partie de la citation (avant le séparateur)
  mainText: string; // Texte principal après le séparateur (avec les points si nécessaire)
  name: string; // Nom de la personne
  location: string; // Localisation
  subText: string; // Texte descriptif en petit en bas
  quoteColor: string; // Couleur du guillemet d'ouverture (l'élément en forme de "6" ou guillemet stylisé)
  separatorColor: string; // Couleur de la ligne séparatrice (le deuxième élément, potentiellement)
  size: CardSize; // Taille de la card : small, medium, large
}

const sizeClasses: Record<CardSize, string> = {
  small: "max-w-xs p-8 text-sm",
  medium: "max-w-sm p-10 text-base",
  large: "max-w-md p-14 text-lg",
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
      className={`relative bg-[#F5F2ED] rounded-2xl shadow-md overflow-hidden ${sizeClasses[size]}`}
    >
      {/* Guillemet d'ouverture stylisé (élément en forme de "6" ou guillemet, positionné en haut à gauche) */}
      <span
        className="absolute top-4 left-4 text-6xl font-bold"
        style={{ color: quoteColor }}
      >
        “
      </span>

      {/* Contenu principal */}
      <div className="relative z-10 pt-12 px-6 pb-6">
        {/* Première partie du texte */}
        <p className="text-gray-800 mb-4">{quoteText}</p>

        {/* Ligne séparatrice (deuxième élément customizable) */}
        <hr
          className="border-t-2 mb-4"
          style={{ borderColor: separatorColor }}
        />

        {/* Deuxième partie du texte (avec des • si inclus dans mainText) */}
        <p className="text-gray-800 mb-6">{mainText}</p>

        {/* Nom et localisation */}
        <p className="font-semibold text-gray-900">
          {name}, {location}
        </p>

        {/* Texte descriptif en petit */}
        <p className="text-sm text-gray-500 mt-1">{subText}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
