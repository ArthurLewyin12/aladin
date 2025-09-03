"use client";
import { motion } from "motion/react";
import React, { useRef, useState, useEffect } from "react";
import TestimonialCard from "@/components/ui/testimonial-card";

interface Testimonial {
  quoteText: string;
  mainText: string;
  name: string;
  location: string;
  subText: string;
  quoteColor: string;
  separatorColor: string;
  size: "small" | "medium" | "large";
}

const testimonials: Testimonial[] = [
  {
    quoteText: "Avant, je révisais un peu dans le désordre.",
    mainText:
      "Maintenant, tout est clair. Je fais des quiz tous les soirs, et je vois mes progrès. J'adore aussi réviser avec mes copines dans notre groupe d'étude",
    name: "Peter",
    location: "Belgium",
    subText: "on what he learned when sitting with himself",
    quoteColor: "#A855F7", // Violet
    separatorColor: "#3B82F6", // Bleu
    size: "medium",
  },
  {
    quoteText: "Avant, je révisais un peu dans le désordre.",
    mainText:
      "Maintenant, tout est clair. Je fais des quiz tous les soirs, et je vois mes progrès.",
    name: "Peter",
    location: "Belgium",
    subText: "on what he learned when sitting with himself",
    quoteColor: "#F97316", // Orange
    separatorColor: "#3B82F6", // Bleu
    size: "medium",
  },
  {
    quoteText: "Avant, je révisais un peu dans le désordre.",
    mainText:
      "Maintenant, tout est clair. Je fais des quiz tous les soirs, et je vois mes progrès. J'adore aussi réviser avec mes copines dans notre groupe d'étude",
    name: "Peter",
    location: "Belgium",
    subText: "on what he learned when sitting with himself",
    quoteColor: "#A855F7", // Violet
    separatorColor: "#3B82F6", // Bleu
    size: "medium",
  },
  {
    quoteText: "Avant, je révisais un peu dans le désordre.",
    mainText:
      "Maintenant, tout est clair. Je fais des quiz tous les soirs, et je vois mes progrès. J'adore aussi réviser avec mes copines dans notre groupe d'étude",
    name: "Peter",
    location: "Belgium",
    subText: "on what he learned when sitting with himself",
    quoteColor: "#A855F7", // Violet
    separatorColor: "#3B82F6", // Bleu
    size: "large",
  },

  {
    quoteText: "Avant, je révisais un peu dans le désordre.",
    mainText:
      "Maintenant, tout est clair. Je fais des quiz tous les soirs, et je vois mes progrès. J'adore aussi réviser avec mes copines dans notre groupe d'étude",
    name: "Peter",
    location: "Belgium",
    subText: "on what he learned when sitting with himself",
    quoteColor: "#A855F7", // Violet
    separatorColor: "#3B82F6", // Bleu
    size: "medium",
  },
];

export default function TestimonialCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth,
      );
    }
  }, []);

  return (
    <section
      className="relative w-screen  min-h-screen flex flex-col items-center justify-center bg-center overflow-y-hidden"
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      <div className="absolute inset-0 bg-white opacity-60 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#136C15] mb-12">
          Ils en parlent mieux que nous...
        </h2>

        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

          <motion.div
            ref={carouselRef}
            className="flex cursor-grab active:cursor-grabbing"
            whileTap={{ cursor: "grabbing" }}
          >
            <motion.div
              className="flex gap-6"
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} className="min-w-[300px] flex-shrink-0">
                  <TestimonialCard {...testimonial} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
