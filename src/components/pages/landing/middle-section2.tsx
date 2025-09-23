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
      "Vous disposez d’une interface conviviale et d’un tableau de bord détaillé qui vous donne une vue complète des activités de vos enfants, leurs révisions, quiz, groupes et progression sur l’année scolaire.",
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
    title: "Suivi de la progression",
    description:
      "Suivez les notes, les résultats des quiz et la courbe de progression de votre enfant pour identifier ses points forts et les domaines à améliorer, tout cela en temps réel.",
  },
  {
    id: 2,
    icon: (
      <svg
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
      </svg>
    ),
    title: "Communication facile",
    description:
      "Communiquez directement avec les professeurs et les répétiteurs de votre enfant via la messagerie intégrée pour un suivi collaboratif et efficace.",
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
    title: "Gestion des cours",
    description:
      "Accédez aux supports de cours, aux devoirs et aux plannings de révision de votre enfant pour l'accompagner au quotidien dans son apprentissage.",
  },
];

const SLIDE_DURATION = 5000;

export default function MiddleSection2() {
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
      className="relative min-h-screen flex items-center justify-center bg-center overflow-hidden"
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      <div className="absolute inset-0 bg-red-200 opacity-60 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8 text-center lg:text-left order-1 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#7E57C2] text-balance">
                Parent,
                <br />
                avec aladin, vous encadrez
                <br />
                sereinement vos enfants.
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
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      {currentSlide.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#000000] mb-3">
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
                  <div className="flex- ml-4">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`desc-${activeSlide}`}
                        className="text-[#000000] leading-relaxed font-sans text-[1.4rem]"
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

          <motion.div
            className="relative flex justify-center lg:justify-end order-2 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-lg">
              <img
                src="/femme_learning.png"
                alt="Dame avec dictionnaire A-Z"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
