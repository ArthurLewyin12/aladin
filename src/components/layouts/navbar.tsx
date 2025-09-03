"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

export default function NavBar() {
  const { scrollY } = useScroll();

  const width = useTransform(scrollY, [0, 100], ["100%", "90%"]);
  const borderRadius = useTransform(scrollY, [0, 100], ["0px", "20px"]);
  const top = useTransform(scrollY, [0, 100], ["0px", "40px"]);
  const position = useTransform(scrollY, [0, 100], ["fixed", "sticky"]);

  return (
    <motion.nav
      className="h-16 sm:h-20 border-b flex justify-between items-center gap-2 bg-center left-0 z-50 backdrop-blur-sm mx-auto"
      style={{
        backgroundImage: "url('/bg1.png')",
        backgroundSize: "30%",
        width,
        borderRadius,
        top,
        position: position as any,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Overlay pour l'opacité */}
      <div
        className="absolute inset-0 bg-white/80 z-0"
        style={{ borderRadius: "inherit" }}
      ></div>

      <div className="ml-4 md:ml-24 relative z-10">
        <Image
          height={40}
          width={40}
          src="/logo.png"
          alt="Logo du site"
          className="sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px]"
        />
      </div>

      <div className="mr-4 md:mr-24 flex gap-2 sm:gap-4 md:gap-8 relative z-10">
        <Button
          className="bg-inherit hover:bg-gray-100/20 transition-colors cursor-pointer text-xs sm:text-sm md:text-base px-2 sm:px-4"
          aria-label="Se connecter à votre compte"
        >
          <span className="text-black font-medium text-[1.3rem]">
            Se connecter
          </span>
        </Button>

        <Button
          className="px-3 sm:px-6 md:px-10 py-2 sm:py-3 md:py-5 bg-[#111D4A] hover:bg-[#0d1640] rounded-sm text-white cursor-pointer transition-colors text-[1.3rem] sm:text-sm md:text-base font-medium"
          aria-label="Créer un nouveau compte"
        >
          S'inscrire
        </Button>
      </div>
    </motion.nav>
  );
}
