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
    title: "Consulte ton tableau de bord...",
    description:
      "Reste concentré! Toutes tes révisions, tes quiz, tes notes, tes groupes et ta courbe de progression sont affichés dans ton tableau de bord de pilotage. Ta réussite est à portée de main!",
  },
  {
    id: 1,
    icon: (
      <svg
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
      </svg>
    ),
    title: "Passe des quiz...",
    description:
      "Choisis une matière, un niveau de difficulté et évalue toi sans pression! Reçois les résultats instantanés et des explications détaillées pour approfondir tes connaissances.",
  },
  {
    id: 2,
    icon: (
      <svg
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M16,4C16.88,4 17.67,4.84 17.67,5.75C17.67,6.66 16.88,7.5 16,7.5C15.12,7.5 14.33,6.66 14.33,5.75C14.33,4.84 15.12,4 16,4M13,10.5H19V12H13V10.5M13,6H19V7.5H13V6M13,15H19V16.5H13V15M11,10.5V12H7.5C7.5,10.62 8.62,9.5 10,9.5C10.34,9.5 10.67,9.59 10.95,9.71L11,10.5M10,8A4,4 0 0,0 6,12A4,4 0 0,0 10,16A4,4 0 0,0 14,12C14,11.96 14,11.93 14,11.89L13.24,11.13C13.09,10.36 12.7,9.66 12.12,9.12C11.58,8.5 10.85,8.15 10,8M10,14A2,2 0 0,1 8,12A2,2 0 0,1 10,10A2,2 0 0,1 12,12A2,2 0 0,1 10,14Z" />
      </svg>
    ),
    title: "Progresse en groupe...",
    description:
      "Apprends en groupe et progresse mieux et vite. Crée des groupes, invite tes amis et camarades de classe pour réviser ensemble, passer des quiz et discuter sur des sujets d'études.",
  },
];

const SLIDE_DURATION = 1000; // 4 seconds auto-advance

export default function MiddleSection(): React.JSX.Element {
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
      <div className="absolute inset-0 bg-white opacity-60 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image à gauche */}
          <motion.div
            className="relative flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <img
                src="/dictionnary.gif"
                alt="Dame avec dictionnaire A-Z"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Contenu à droite */}
          <motion.div
            className="space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Titre principal */}
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0B278E] text-balance leading-tight">
                Élève,
                <br />
                avec aladin, tu apprends
                <br />
                vite et mieux!
              </h2>
            </div>

            {/* Section avec icône et contenu */}
            <motion.div
              className="pt-6"
              key={activeSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                {/* En-tête avec icône */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`header-${activeSlide}`}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                      {currentSlide.icon}
                    </div>
                    <h3 className="text-xl font-bold text-black">
                      {currentSlide.title}
                    </h3>
                  </motion.div>
                </AnimatePresence>

                {/* Contenu avec indicateurs */}
                <div className="flex items-start gap-6">
                  {/* Indicateurs verticaux */}
                  <div
                    className="flex flex-col gap-2 pt-2"
                    role="tablist"
                    aria-label="Navigation du carousel vertical"
                  >
                    {SLIDES_DATA.map((_, index) => (
                      <button
                        key={index}
                        className={`w-1 h-6 rounded-full transition-all duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          index === activeSlide
                            ? "bg-slate-800"
                            : "bg-slate-300 hover:bg-slate-400"
                        }`}
                        onClick={() => handleSlideChange(index)}
                        role="tab"
                        aria-selected={index === activeSlide}
                        aria-label={`Aller au slide ${index + 1}: ${SLIDES_DATA[index].title}`}
                        type="button"
                      />
                    ))}
                  </div>

                  {/* Texte descriptif */}
                  <div className="flex-1">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`desc-${activeSlide}`}
                        className="text-black leading-relaxed text-lg lg:text-xl"
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
