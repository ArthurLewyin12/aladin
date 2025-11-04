
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, User, Mail, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import { AddStudentModal } from "./add-student-modal";
import { GetClasseResponse } from "@/services/controllers/types/common/professeur.types";
import { useDeactivateMember } from "@/services/hooks/professeur/useDeactivateMember";
import { useReactivateMember } from "@/services/hooks/professeur/useReactivateMember";
import { toast } from "@/lib/toast";
import { createQueryKey } from "@/lib/request";
import { useQueryClient } from "@tanstack/react-query";
import { StudentCard } from "./student-card";

interface StudentSectionProps {
  classeDetails: GetClasseResponse;
}

export const StudentSection = ({ classeDetails }: StudentSectionProps) => {
  const router = useRouter();
  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);

  const { members = [], niveau } = classeDetails;

  const queryClient = useQueryClient();
  const { mutate: deactivateMember } = useDeactivateMember();
  const { mutate: reactivateMember } = useReactivateMember();

  const handleDeactivateMember = (memberId: number) => {
    deactivateMember(
      { classeId: classeDetails.id, memberId },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            message: "Élève désactivé avec succès.",
          });
          queryClient.invalidateQueries({
            queryKey: createQueryKey("professeur", "classe", classeDetails.id),
          });
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            message: error.message || "Échec de la désactivation de l'élève.",
          });
        },
      },
    );
  };

  const handleReactivateMember = (memberId: number) => {
    reactivateMember(
      { classeId: classeDetails.id, memberId },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            message: "Élève réactivé avec succès.",
          });
          queryClient.invalidateQueries({
            queryKey: createQueryKey("professeur", "classe", classeDetails.id),
          });
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            message: error.message || "Échec de la réactivation de l'élève.",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête Membres avec titre et bouton */}
      {members.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Élèves de la classe
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {members.length} élève{members.length > 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={() => setAddStudentModalOpen(true)}
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 md:px-6 py-3 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap flex items-center justify-center"
          >
            <PlusIcon className="w-4 sm:w-5 h-5 mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">Ajouter un élève</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>
      )}

      {/* Contenu principal */}
      {members.length === 0 ? (
        /* État vide - Pas d'élèves */
        <div className="px-4 sm:px-0">
          <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
            <div className="relative w-full max-w-2xl">
              <EmptyState
                title="Aucun élève pour le moment"
                description="Ajoute ton premier élève pour commencer à gérer ta classe !"
                icons={[
                  <User key="1" size={20} />,
                  <Users key="2" size={20} />,
                  <GraduationCap key="3" size={20} />,
                ]}
                size="default"
                theme="light"
                variant="default"
                className="mx-auto max-w-[50rem]"
              />
            </div>

            <div className="text-center px-4">
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
                Clique ci-dessous pour ajouter ton premier élève !
              </p>

              <Button
                size="lg"
                onClick={() => setAddStudentModalOpen(true)}
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
              >
                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Ajouter un élève
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <StudentCard
              key={member.id}
              member={member}
              niveau={niveau}
              onDeactivate={handleDeactivateMember}
              onReactivate={handleReactivateMember}
            />
          ))}
        </div>
      )}

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setAddStudentModalOpen(false)}
        classeId={classeDetails.id}
        classeName={classeDetails.nom}
      />
    </div>
  );
};
