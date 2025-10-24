"use client";

import { cn } from "@/lib/utils";
import {
  Eleve,
  EleveType,
} from "@/services/controllers/types/common/repetiteur.types";
import { motion } from "motion/react";
import { User, CheckCircle2 } from "lucide-react";

interface EleveCardProps {
  eleve: Eleve;
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

export const EleveCard = ({
  eleve,
  index,
  isActive = false,
  onClick,
  className,
}: EleveCardProps) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        "relative rounded-3xl p-8 shadow-sm transition-all cursor-pointer hover:shadow-md",
        bgColor,
        isActive && "ring-2 ring-[#548C2F] shadow-md",
        className,
      )}
    >
      {/* Badge actif */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute -top-2 -right-2 bg-[#548C2F] text-white rounded-full p-1.5 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4" />
        </motion.div>
      )}

      {/* Header avec avatar et nom */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-[#E3F1D9] rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-7 h-7 text-[#548C2F]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {eleve.prenom} {eleve.nom}
          </h3>
          <p className="text-sm text-gray-500">
            {eleve.type === EleveType.UTILISATEUR
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
            {eleve.niveau?.libelle || "Non défini"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Email</span>
          <span className="font-medium text-gray-900 truncate ml-2">
            {eleve.email}
          </span>
        </div>
        {eleve.numero && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Téléphone</span>
            <span className="font-medium text-gray-900">{eleve.numero}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          {isActive ? "✓ Élève sélectionné" : "Cliquez pour voir les détails"}
        </p>
      </div>
    </motion.div>
  );
};

