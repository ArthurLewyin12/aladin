"use client";
import { motion } from "motion/react";

export default function MiddleSection4() {
  return (
    <section
      className="relative py-22 pb-8  flex flex-col justify-center bg-center overflow-hidden "
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      <div className="absolute inset-0 bg-blue-200 opacity-60 z-0"></div>

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
            <h2 className="  text-3xl md:text-4xl lg:text-5xl font-bold text-[#FF6B47] text-balance">
              Répétiteurs,
              <br />
              avec aladin, vous gagnez
              <br />
              en productivité.
            </h2>
          </motion.div>

          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-lg">
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
          <div className="">
            <div className="flex flex-col items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#FF6B47] rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold  flex flex-col mb-4">
                  <span>Générez des révisions selon vos </span>
                  <span> besoins</span>
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6 flex flex-col">
                  <span>
                    Vous pouvez générer via l'IA des révisions de cours dans
                  </span>
                  <span>
                    toutes les matières suivies par vos élèves. Vous pouvez
                  </span>
                  <span>
                    également télécharger vos propres supports de cours.
                  </span>
                </p>

                {/* Mini carousel */}
                <div className="flex gap-2">
                  <div className="w-8 h-1.5 bg-gray-800 rounded-full"></div>
                  <div className="w-8 h-1.5 bg-gray-300 rounded-full"></div>
                  <div className="w-8 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Quiz */}
          <div className="">
            <div className="flex flex-col items-start gap-4 ">
              <div className="flex-shrink-0 w-12 h-12 bg-[#FF6B47] rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Créez des Quiz adaptés à
                  <br />
                  chaque enfant
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Vous pouvez créer via l'IA des quiz adaptés au niveau de
                  <br />
                  difficulté de chaque enfant.
                  <br />
                  Vous avez accès à des corrections instantanées et la
                  <br />
                  possibilité d'approfondir les réponses.
                </p>

                {/* Mini carousel */}
                <div className="flex gap-2">
                  <div className="w-8 h-1.5 bg-gray-300 rounded-full"></div>
                  <div className="w-8 h-1.5 bg-gray-800 rounded-full"></div>
                  <div className="w-8 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
