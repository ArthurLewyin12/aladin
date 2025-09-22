"use client";
import { motion } from "motion/react";

export default function MiddleSection2() {
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#000000] mb-3 flex flex-col">
                    <span>Une interface clair et un tableau de </span>
                    <span>bord détaillé</span>
                  </h3>
                </div>

                <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col gap-2 mt-10">
                    <div className="w-1.5 h-7 bg-slate-800 rounded-full"></div>
                    <div className="w-1.5 h-7 bg-slate-300 rounded-full"></div>
                    <div className="w-1.5 h-7 bg-slate-300 rounded-full"></div>
                    <div className="w-1.5 h-7 bg-slate-300 rounded-full"></div>
                  </div>
                  <div className="flex- ml-10">
                    <p className="text-[#000000] leading-relaxed flex flex-col font-sans text-[1.4rem]">
                      <span>Vous disposez d’une interface conviviale et</span>
                      <span>d’un tableau de bord détaillé qui vous donne</span>
                      <span> une vue complète des activités de vos</span>
                      <span>enfants, leurs révisions, quiz, groupes et</span>
                      <span>progression sur l’année scolaire.</span>
                    </p>
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
