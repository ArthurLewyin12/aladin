"use client";
import { motion, Variants } from "motion/react";
import React from "react";
import TestimonialCard from "@/components/ui/testimonial-card";
import { useMediaQuery } from "@/services/hooks/use-media-query";

interface Testimonial {
  quoteText: string;
  mainText: string;
  name: string;
  location: string;
  subText: string;
  quoteColor: string;
  separatorColor: string;
  size: "small" | "medium" | "large";
}

const testimonials: Testimonial[] = [
  {
    quoteText: "Avant, je révisais un peu dans le désordre.",
    mainText:
      "Maintenant, tout est clair. Je fais des quiz tous les soirs, et je vois mes progrès. J'adore aussi réviser avec mes copines dans notre groupe d'étude",
    name: "Aminata",
    location: "Dakar, Sénégal",
    subText: "Élève en Terminale S",
    quoteColor: "#A855F7", // Violet
    separatorColor: "#3B82F6", // Bleu
    size: "medium",
  },
  {
    quoteText: "Les quiz m'ont vraiment aidé à progresser.",
    mainText:
      "Je peux maintenant suivre mes notes en temps réel et voir où je dois m'améliorer. C'est motivant de voir la courbe monter !",
    name: "Ousmane",
    location: "Abidjan, Côte d'Ivoire",
    subText: "Élève en Première",
    quoteColor: "#F97316", // Orange
    separatorColor: "#10B981", // Vert
    size: "medium",
  },
  {
    quoteText: "Mes parents sont ravis de suivre ma progression.",
    mainText:
      "Ils peuvent voir mes résultats et m'encourager. Le tableau de bord est très clair et facile à comprendre pour tout le monde.",
    name: "Fatoumata",
    location: "Bamako, Mali",
    subText: "Élève en Seconde",
    quoteColor: "#EC4899", // Rose
    separatorColor: "#F59E0B", // Jaune
    size: "medium",
  },
  {
    quoteText: "Un vrai outil pour réussir !",
    mainText:
      "Les révisions sont devenues plus simples et efficaces. J'ai gagné en confiance grâce aux statistiques qui me montrent mes points forts et mes faiblesses.",
    name: "Ibrahima",
    location: "Lomé, Togo",
    subText: "Élève en Terminale L",
    quoteColor: "#8B5CF6", // Violet
    separatorColor: "#F97316", // Orange
    size: "large",
  },
  {
    quoteText: "L'interface est super intuitive.",
    mainText:
      "Même ma petite sœur qui est en 6ème arrive à utiliser l'application sans problème. C'est fluide et agréable à utiliser tous les jours.",
    name: "Mariam",
    location: "Ouagadougou, Burkina Faso",
    subText: "Élève en Première ES",
    quoteColor: "#10B981", // Vert
    separatorColor: "#EC4899", // Rose
    size: "medium",
  },
];

const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

export default function TestimonialCarousel() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const carouselVariants: Variants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        ease: "linear",
        duration: isMobile ? 80 : isTablet ? 65 : 50,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return (
    <section
      className="relative w-full min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen flex flex-col items-center justify-center bg-center overflow-hidden py-8 sm:py-12 lg:py-16"
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      {/* Gradient overlays améliorés */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/80 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.06),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 text-center w-full">
        {/* En-tête amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#136C15] mb-3 sm:mb-4">
            Ils en parlent mieux que nous...
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Découvrez comment Aladin transforme l'apprentissage de milliers d'élèves à travers l'Afrique
          </p>
        </motion.div>

        {/* Carrousel responsive */}
        <div className="relative overflow-hidden w-full py-4">
          {/* Gradients de fade améliorés */}
          <div className="absolute inset-y-0 left-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none"></div>

          <motion.div
            className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6"
            variants={carouselVariants}
            animate="animate"
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="min-w-[260px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[350px] flex-shrink-0"
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
