"use client";

import * as React from "react";
import { BookOpen, ChevronRight, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useSession } from "@/services/hooks/auth/useSession";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { useChapitresByMatiere } from "@/services/hooks/chapitres/useChapitres";
import { Skeleton } from "@/components/ui/skeleton";

interface PlanningSubjectsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanningSubjectsDrawer({
  open,
  onOpenChange,
}: PlanningSubjectsDrawerProps) {
  const { user } = useSession();
  const [selectedMatiereId, setSelectedMatiereId] = React.useState<number | null>(null);

  const { data: matieresData, isLoading: isLoadingMatieres } =
    useMatieresByNiveau(user?.niveau?.id || 0);

  const { data: chapitresData, isLoading: isLoadingChapitres } =
    useChapitresByMatiere(selectedMatiereId || 0);

  const handleMatiereClick = (matiereId: number) => {
    setSelectedMatiereId(matiereId);
  };

  const handleBackToMatieres = () => {
    setSelectedMatiereId(null);
  };

  React.useEffect(() => {
    if (!open) {
      setSelectedMatiereId(null);
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedMatiereId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToMatieres}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </Button>
              )}
              <div>
                <DrawerTitle className="text-xl font-bold text-[#2C3E50]">
                  {selectedMatiereId ? "Chapitres" : "Matières disponibles"}
                </DrawerTitle>
                {selectedMatiereId && matieresData && (
                  <p className="text-sm text-gray-600 mt-1">
                    {matieresData.matieres.find(m => m.id === selectedMatiereId)?.libelle}
                  </p>
                )}
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {!selectedMatiereId ? (
            // Affichage des matières
            <div className="space-y-3">
              {isLoadingMatieres ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : matieresData?.matieres.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune matière disponible</p>
                </div>
              ) : (
                matieresData?.matieres.map((matiere) => (
                  <button
                    key={matiere.id}
                    onClick={() => handleMatiereClick(matiere.id)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-[#2C3E50] hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {matiere.libelle}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Cliquez pour voir les chapitres
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#2C3E50] transition-colors" />
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            // Affichage des chapitres
            <div className="space-y-3">
              {isLoadingChapitres ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : chapitresData?.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun chapitre disponible</p>
                </div>
              ) : (
                chapitresData?.map((chapitre) => (
                  <div
                    key={chapitre.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900">
                      {chapitre.libelle}
                    </h4>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}