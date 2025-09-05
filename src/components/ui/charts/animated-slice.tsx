"use client";

import { motion } from "motion/react";

export function AnimatedSlice({
  index = 0,
  children,
}: {
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.25 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.25, delay: index * 0.075 },
        scale: {
          type: "spring",
          duration: 0.25,
          bounce: 0.1,
          delay: index * 0.075,
        },
      }}
    >
      {children}
    </motion.g>
  );
}
