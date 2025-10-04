"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";

interface GenerationLoadingOverlayProps {
  isLoading: boolean;
  messages: string[];
}

export const GenerationLoadingOverlay = ({
  isLoading,
  messages,
}: GenerationLoadingOverlayProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading, messages.length]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const dotVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col items-center">
            <div className="flex space-x-2 mb-6">
              <motion.div
                variants={dotVariants}
                initial="initial"
                animate="animate"
                className="w-4 h-4 bg-orange-500 rounded-full"
              />
              <motion.div
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="w-4 h-4 bg-blue-800 rounded-full"
              />
              <motion.div
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
                className="w-4 h-4 bg-purple-500 rounded-full"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-medium text-gray-700"
              >
                {messages[currentTextIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
