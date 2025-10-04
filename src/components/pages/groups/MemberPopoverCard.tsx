"use client";

import { AuthUser } from "@/services/controllers/types/common/user.type";
import { Mail, GraduationCap } from "lucide-react";

interface MemberPopoverCardProps {
  user: AuthUser;
  bgColor: string;
  niveauLabel: string;
}

export const MemberPopoverCard = ({ user, bgColor, niveauLabel }: MemberPopoverCardProps) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white max-w-xs w-full">
      <div className={`h-20 ${bgColor}`} />
      <div className="p-4 relative">
        <div
          className={`w-24 h-24 rounded-full ${bgColor} flex items-center justify-center text-gray-900 font-bold text-3xl absolute -top-12 left-1/2 -translate-x-1/2 border-4 border-white`}
        >
          {user.prenom.charAt(0).toUpperCase()}
          {user.nom.charAt(0).toUpperCase()}
        </div>
        <div className="pt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900">
            {user.prenom} {user.nom}
          </h3>
          <p className="text-sm text-gray-500">Membre du groupe</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            <span>{user.mail}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
            <span>{niveauLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
