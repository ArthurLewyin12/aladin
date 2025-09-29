"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface SlideContent {
  id: number;
  title: string[];
  description: string[];
}

const REVISIONS_SLIDES: SlideContent[] = [
  {
    id: 0,
    title: ["Générez des révisions selon vos besoins"],
    description: [
      "Vous pouvez générer via l'IA des révisions de cours dans",
      "toutes les matières suivies par vos élèves. Vous pouvez",
      "également télécharger vos propres supports de cours.",
    ],
  },
  {
    id: 1,
    title: ["Personnalisez le contenu"],
    description: [
      "Adaptez les révisions générées pour correspondre parfaitement",
      "à votre méthodologie et aux besoins spécifiques de chaque élève.",
    ],
  },
  {
    id: 2,
    title: ["Suivez les progrès"],
    description: [
      "Visualisez quels élèves ont terminé leurs révisions",
      "et identifiez les points de blocage pour mieux les accompagner.",
    ],
  },
];

const QUIZ_SLIDES: SlideContent[] = [
  {
    id: 0,
    title: ["Créez des Quiz adaptés à chaque enfant"],
    description: [
      "Vous pouvez créer via l'IA des quiz adaptés au niveau de",
      "difficulté de chaque enfant. Vous avez accès à des corrections",
      "instantanées et la possibilité d'approfondir les réponses.",
    ],
  },
  {
    id: 1,
    title: ["Analysez les résultats en détail"],
    description: [
      "Obtenez des statistiques précises sur les performances de chaque",
      "élève pour comprendre leurs forces et faiblesses.",
    ],
  },
  {
    id: 2,
    title: ["Planifiez des évaluations"],
    description: [
      "Programmez des quiz à l'avance pour évaluer régulièrement",
      "la compréhension de vos élèves et maintenir leur engagement.",
    ],
  },
];

interface FeatureCarouselProps {
  slides: SlideContent[];
}

function FeatureCarousel({ slides }: FeatureCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (slideIndex: number) => {
    setActiveSlide(slideIndex);
  };

  const currentSlide = slides[activeSlide];

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <h3 className="text-2xl font-bold flex flex-col mb-4 min-h-[4rem]">
            {currentSlide.title.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 flex flex-col min-h-[6rem]">
            {currentSlide.description.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
              index === activeSlide
                ? "bg-gray-800"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function MiddleSection4() {
  return (
    <section
      className="relative py-22 pb-8 flex flex-col justify-center bg-center overflow-hidden "
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      <div className="absolute inset-0 bg-green-200 opacity-60 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 space-y-16 pb-0">
        {/* Première section - Titre + Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FF6B47] text-balance">
              Répétiteurs,
              <br />
              avec aladin, vous gagnez
              <br />
              en productivité.
            </h2>
          </motion.div>

          <motion.div
            className="relative flex justify-center lg:justify-end lg:mr-16"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-xl">
              <img
                src="/mathematics-pana.png"
                alt="Enseignant au tableau"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>

        {/* Deuxième section - Features */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-start"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Feature 1 - Révisions */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-[#FF6B47] rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z" />
              </svg>
            </div>
            <FeatureCarousel slides={REVISIONS_SLIDES} />
          </div>

          {/* Feature 2 - Quiz */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-[#FF6B47] rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
              </svg>
            </div>
            <FeatureCarousel slides={QUIZ_SLIDES} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
