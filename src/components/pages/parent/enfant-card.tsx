"use client";

import { cn } from "@/lib/utils";
import {
  Enfant,
  EnfantType,
} from "@/services/controllers/types/common/parent.types";
import { motion } from "motion/react";
import { User, CheckCircle2 } from "lucide-react";

interface EnfantCardProps {
  enfant: Enfant;
  index: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export const EnfantCard = ({
  enfant,
  index,
  isActive = false,
  onClick,
  className,
}: EnfantCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        "relative rounded-[28px] p-8 shadow-sm transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02] duration-300",
        bgColor,
        isActive && "ring-4 ring-purple-400 ring-opacity-50 shadow-xl",
        className,
      )}
    >
      {/* Badge actif */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute -top-3 -right-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full p-2 shadow-xl"
        >
          <CheckCircle2 className="w-5 h-5" />
        </motion.div>
      )}

      {/* Header avec avatar et nom */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-sm">
          <User className="w-8 h-8 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {enfant.prenom} {enfant.nom}
          </h3>
          <p className="text-sm text-gray-500">
            {enfant.type === EnfantType.UTILISATEUR
              ? "Compte élève"
              : "Ajouté manuellement"}
          </p>
        </div>
      </div>

      {/* Informations */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Niveau</span>
          <span className="font-medium text-gray-900">
            {enfant.niveau?.libelle || "Non défini"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Email</span>
          <span className="font-medium text-gray-900 truncate ml-2">
            {enfant.email}
          </span>
        </div>
        {enfant.numero && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Téléphone</span>
            <span className="font-medium text-gray-900">{enfant.numero}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-300">
        <p className="text-xs text-center text-gray-600 font-medium">
          {isActive ? "✨ Enfant sélectionné" : "👆 Cliquez pour sélectionner"}
        </p>
      </div>
    </motion.div>
  );
};
