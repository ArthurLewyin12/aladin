"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";

interface SlideContent {
  id: number;
  title: {
    highlight: string;
    lines: string[];
  };
  description: string;
}

const SLIDES_DATA: SlideContent[] = [
  {
    id: 0,
    title: {
      highlight: "Élèves,",
      lines: ["des Cours,", "des Quiz,", "des Résultats..."],
    },
    description: "aladin t'aide à réussir brillamment ton année scolaire.",
  },
  {
    id: 1,
    title: {
      highlight: "Parents,",
      lines: ["vous n'êtes plus", "seuls pour encadrer", "vos enfants..."],
    },
    description:
      "aladin simplifie l'encadrement et le suivi de vos enfants pour garantir leur réussite scolaire.",
  },
  {
    id: 2,
    title: {
      highlight: "Professeurs,",
      lines: [
        "votre pédagogie boostée",
        "par l'Intelligence",
        "Artificielle...",
      ],
    },
    description:
      "aladin vous aide à gérer vos classes, vos cours et vos évaluations avec fluidité.",
  },
  {
    id: 3,
    title: {
      highlight: "Répétiteurs,",
      lines: [
        "chaque élève est unique.",
        "Votre méthodologie",
        "l'est aussi...",
      ],
    },
    description:
      "aladin vous aide à mieux organiser vos séances pour garantir le succès de vos élèves.",
  },
];

const SLIDE_DURATION = 1000;

export default function HeroSection(): React.JSX.Element {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-advance slides
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

    // Resume auto-advance after user interaction
    setTimeout(() => setIsPaused(false), SLIDE_DURATION);
  }, []);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  const currentSlide = SLIDES_DATA[activeSlide];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-center overflow-hidden"
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-blue-100/80 z-0" />

      <div className="relative bottom-6 z-10 container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-16 items-center">
          <motion.div
            className="space-y-6 text-center lg:text-left"
            key={activeSlide}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`title-${activeSlide}`}
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-balance">
                  <span className="text-orange-500">
                    {currentSlide.title.highlight}
                  </span>
                  <br />
                  {currentSlide.title.lines.map((line, index) => (
                    <span key={index}>
                      <span className="text-slate-800">{line}</span>
                      {index < currentSlide.title.lines.length - 1 && <br />}
                    </span>
                  ))}
                </h1>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${activeSlide}`}
                className="text-lg md:text-xl lg:text-2xl text-slate-700 max-w-md mx-auto lg:mx-0 text-pretty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              >
                {currentSlide.description}
              </motion.p>
            </AnimatePresence>

            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            >
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-base font-semibold rounded-md transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label={`En savoir plus sur les services pour ${currentSlide.title.highlight.replace(",", "")}`}
              >
                VOIR PLUS!
              </Button>
            </motion.div>

            {/* Carousel Indicators */}
            <div
              className="flex gap-2 pt-4 justify-center lg:justify-start"
              role="tablist"
              aria-label="Navigation du carousel"
            >
              {SLIDES_DATA.map((_, index) => (
                <button
                  key={index}
                  className={`w-8 h-1 rounded-full transition-all duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    index === activeSlide
                      ? "bg-slate-800"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  onClick={() => handleSlideChange(index)}
                  role="tab"
                  aria-selected={index === activeSlide}
                  aria-label={`Aller au slide ${index + 1}: ${SLIDES_DATA[index].title.highlight}`}
                  type="button"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-none lg:max-w-2xl xl:max-w-3xl">
              <img
                src="/image_1_accueil.png"
                alt="Illustration d'étudiants avec des livres et un globe terrestre"
                className="w-full h-auto scale-110 lg:scale-125 xl:scale-150 transform origin-center"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute top-16 right-8 xl:right-16 hidden lg:block"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p className="flex flex-col text-orange-500 font-medium text-2xl xl:text-3xl 2xl:text-4xl text-balance">
          <span className="text-center">aladin, ton assistant IA pour</span>
          <span className="text-center">réussir l'année scolaire 2025-26</span>
        </p>
      </motion.div>
    </section>
  );
}
