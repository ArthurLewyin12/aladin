"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-center overflow-hidden"
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      {/* Overlay bleu pâle */}
      <div className="absolute inset-0 bg-blue-100/80 z-0"></div>

      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Côté gauche - Texte */}
          <motion.div
            className="space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
                <span className="text-orange-500">Élèves,</span>
                <br />
                <span className="text-slate-800">des Cours,</span>
                <br />
                <span className="text-slate-800">des Quiz,</span>
                <br />
                <span className="text-slate-800">des Résultats...</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-slate-700 max-w-md mx-auto lg:mx-0 text-pretty">
              aladin t'aide à réussir brillamment ton année scolaire.
            </p>

            <div className="pt-4">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-semibold rounded-md transition-colors"
              >
                VOIR PLUS!
              </Button>
            </div>

            <div className="flex gap-2 pt-4 justify-center lg:justify-start">
              <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
              <div className="w-8 h-1 bg-slate-300 rounded-full"></div>
              <div className="w-8 h-1 bg-slate-300 rounded-full"></div>
              <div className="w-8 h-1 bg-slate-300 rounded-full"></div>
            </div>
          </motion.div>

          {/* Côté droit - Illustration */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-lg">
              {/* Image principale d'illustration éducative */}
              <img
                src="/modern-educational-illustration-with-diverse-stude.jpg"
                alt="Illustration d'étudiants avec des livres et un globe terrestre"
                className="w-full h-auto"
              />

              {/* Éléments décoratifs flottants */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center animate-bounce">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                </svg>
              </div>

              <div className="absolute bottom-8 left-4 w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Texte secondaire en haut à droite */}
      <motion.div
        className="absolute top-8 right-8 hidden lg:block"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p className="text-orange-500 font-medium text-lg text-balance max-w-xs text-right">
          aladin, ton assistant iA pour réussir l'année scolaire 2025-26
        </p>
      </motion.div>
    </section>
  );
}
