import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Badge } from "./badge";

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
  discount?: boolean;
}

export const Tab = ({
  text,
  selected,
  setSelected,
  discount = false,
}: TabProps) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        "relative w-fit px-6 py-3 text-sm font-medium capitalize transition-all duration-300 ease-in-out",
        "rounded-full backdrop-blur-md",
        selected ? "text-white shadow-lg" : "text-blue-800 hover:text-blue-600",
        discount && "flex items-center justify-center gap-2.5",
      )}
    >
      <span className="relative z-10">{text}</span>
      <motion.span
        layoutId="tab-background"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "absolute inset-0 z-0 rounded-full",
          selected
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 opacity-100"
            : "bg-white/10 opacity-0",
        )}
        style={{
          boxShadow: selected ? "0 4px 20px rgba(0, 0, 255, 0.2)" : "none",
        }}
      />
      {discount && (
        <Badge
          className={cn(
            "relative z-10 ml-2 whitespace-nowrap text-xs font-semibold",
            "transition-all duration-300 ease-in-out",
            selected ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800",
          )}
        >
          -35%
        </Badge>
      )}
    </button>
  );
};
