"use client";

import { motion } from "motion/react";

export default function MiddleSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-center overflow-hidden opacity-60"
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      {/* <div className="absolute inset-0 bg-blue-100/80 z-0"></div> */}

      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Côté gauche - Illustration */}
          <motion.div
            className="relative flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-lg">
              {/* Image de la dame au dictionnaire */}
              <img
                src="/dictionnary.gif"
                alt="Dame avec dictionnaire A-Z"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Côté droit - Texte */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B278E] text-balance">
                Élève,
                <br />
                avec aladin, tu apprends
                <br />
                vite et mieux!
              </h2>
            </div>

            {/* Section Révise les cours */}
            <motion.div
              className=""
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                {/* Icône livre jaune */}
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z" />
                  </svg>
                </div>

                <div className="flex items-start gap-4 flex-1">
                  {/* Indicateurs verticaux */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="w-1 h-6 bg-slate-800 rounded-full"></div>
                    <div className="w-1 h-6 bg-slate-300 rounded-full"></div>
                    <div className="w-1 h-6 bg-slate-300 rounded-full"></div>
                    <div className="w-1 h-6 bg-slate-300 rounded-full"></div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#000000] mb-3">
                      Révise les cours...
                    </h3>
                    <p className="text-[#000000] leading-relaxed">
                      À tout moment, tu as accès à tous tes cours organisés par
                      matières et chapitres. Tu peux réviser à ton rythme, sans
                      rien oublier des cours du Prof!
                    </p>
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
