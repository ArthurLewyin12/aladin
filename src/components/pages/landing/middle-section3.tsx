"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";

interface SlideContent {
  id: number;
  icon: React.JSX.Element;
  title: string;
  description: string;
}

const SLIDES_DATA: SlideContent[] = [
  {
    id: 0,
    icon: (
      <svg
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z" />
      </svg>
    ),
    title: "Tableau de bord détaillé",
    description:
      "Aladin vous permet d'enregistrer vos classes, d'y faire des révisions de cours, de planifier et exécuter des quiz à distance ou en présentiel, et de les accompagner efficacement.",
  },
  {
    id: 1,
    icon: (
      <svg
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
    title: "Gestion des classes",
    description:
      "Organisez vos classes, ajoutez vos élèves et gérez les groupes d'étude en quelques clics pour une administration simplifiée et centralisée.",
  },
  {
    id: 2,
    icon: (
      <svg
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
      </svg>
    ),
    title: "Création de quiz sur-mesure",
    description:
      "Générez des quiz personnalisés grâce à l'IA, ajustez le niveau de difficulté et partagez-les avec vos classes pour des évaluations formatives pertinentes.",
  },
  {
    id: 3,
    icon: (
      <svg
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 8H6v9h11v-2H8V8zm10-4H4v9h11V4zm-2 7H6V6h10v5z" />
      </svg>
    ),
    title: "Suivi des performances",
    description:
      "Analysez les résultats de vos élèves, suivez leur progression individuelle et collective, et identifiez les notions à renforcer pour un enseignement plus ciblé.",
  },
];

const SLIDE_DURATION = 5000;

export default function MiddleSection3() {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES_DATA.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleSlideChange = useCallback((slideIndex: number) => {
    setActiveSlide(slideIndex);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), SLIDE_DURATION);
  }, []);

  const currentSlide = SLIDES_DATA[activeSlide];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-center overflow-hidden "
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      <div className="absolute inset-0  bg-white opacity-60 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-lg">
              <img
                src="/meet.gif"
                alt="Animation de discussion en ligne"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#136C15] text-balance">
                Professeur,
                <br />
                avec aladin, vous suivez
                <br />
                l'évolution de vos élèves
              </h2>
            </div>

            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start flex-col gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`header-${activeSlide}`}
                    className="flex gap-4 items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">
                      {currentSlide.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-[#000000] mb-3">
                      {currentSlide.title}
                    </h3>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col gap-2 mt-2">
                    {SLIDES_DATA.map((_, index) => (
                      <button
                        key={index}
                        className={`w-1.5 h-7 rounded-full transition-all duration-300 ${
                          index === activeSlide
                            ? "bg-slate-800"
                            : "bg-slate-300 hover:bg-slate-400"
                        }`}
                        onClick={() => handleSlideChange(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex- ml-10">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`desc-${activeSlide}`}
                        className="text-[#000000] leading-relaxed text-[1.4rem] font-normal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        {currentSlide.description}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}