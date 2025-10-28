"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useEnfants } from "@/services/hooks/parent";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import { EnfantCard } from "@/components/pages/parent/enfant-card";

export function ParentNotesParEnfantTab() {
  const router = useRouter();
  const { data: enfantsData, isLoading: enfantsLoading } = useEnfants();

  const enfants = useMemo(() => {
    return enfantsData?.enfants || [];
  }, [enfantsData]);

  const handleSelectEnfant = (enfantId: number) => {
    router.push(`/parent/notes/${enfantId}`);
  };

  if (enfantsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!enfants || enfants.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        <EmptyState
          title="Aucun enfant trouvé"
          description="Vous n'avez pas encore d'enfants enregistrés sur la plateforme."
          icons={[<Users key="1" size={20} />]}
          size="default"
          theme="light"
          variant="default"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Titre et description */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mes enfants</h2>
        <p className="text-gray-600">Sélectionnez un enfant pour consulter ses notes de classe</p>
      </div>

      {/* Grille des enfants avec design EnfantCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {enfants.map((enfant, index) => (
          <EnfantCard
            key={enfant.id}
            enfant={enfant}
            index={index}
            isActive={false}
            onClick={() => handleSelectEnfant(typeof enfant.id === 'string' ? parseInt(enfant.id) : enfant.id)}
          />
        ))}
      </div>
    </div>
  );
}
