"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDefinirNiveaux } from "@/services/hooks/repetiteur";
import { useNiveau } from "@/services/hooks/niveaux/useNiveau";
import { Spinner } from "@/components/ui/spinner";
import { GraduationCap } from "lucide-react";

interface DefinirNiveauxModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DefinirNiveauxModal({ open, onOpenChange }: DefinirNiveauxModalProps) {
  const [selectedNiveaux, setSelectedNiveaux] = useState<number[]>([]);
  const { data: niveaux, isLoading: isLoadingNiveaux } = useNiveau();
  const { mutate: definirNiveaux, isPending } = useDefinirNiveaux();

  // Empêcher la fermeture du modal si les niveaux ne sont pas définis
  const handleOpenChange = (newOpen: boolean) => {
    // Ne permettre la fermeture que si ce n'est pas le premier paramétrage
    // (On ne peut pas fermer lors de la configuration initiale obligatoire)
    if (!newOpen && open) {
      // Ne pas fermer
      return;
    }
    onOpenChange(newOpen);
  };

  const handleToggleNiveau = (niveauId: number) => {
    setSelectedNiveaux((prev) => {
      if (prev.includes(niveauId)) {
        return prev.filter((id) => id !== niveauId);
      } else {
        // Limiter à 3 niveaux maximum
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, niveauId];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedNiveaux.length === 0) {
      return;
    }
    
    definirNiveaux(
      { niveaux: selectedNiveaux },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedNiveaux([]);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#E3F1D9] rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#548C2F]" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-[#548C2F]">
                Configuration initiale
              </DialogTitle>
              <DialogDescription className="text-base">
                Sélectionnez les niveaux que vous enseignez (maximum 3)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info */}
          <div className="bg-[#F0F7EC] border border-[#C8E0B8] rounded-lg p-4">
            <p className="text-sm text-gray-700">
              📚 Choisissez les <strong>3 niveaux</strong> dans lesquels vous souhaitez
              enseigner. Vous pourrez les modifier plus tard dans vos paramètres.
            </p>
          </div>

          {/* Sélection des niveaux */}
          {isLoadingNiveaux ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Compteur */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  {selectedNiveaux.length} / 3 niveaux sélectionnés
                </p>
              </div>

              {/* Liste des niveaux */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {(niveaux || []).map((niveau: any) => {
                  const isSelected = selectedNiveaux.includes(niveau.id);
                  const isDisabled = !isSelected && selectedNiveaux.length >= 3;

                  return (
                    <label
                      key={niveau.id}
                      className={`
                        flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                        ${
                          isSelected
                            ? "bg-[#E3F1D9] border-[#548C2F] shadow-sm"
                            : isDisabled
                            ? "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                            : "bg-white border-gray-200 hover:border-[#548C2F] hover:bg-[#F0F7EC]"
                        }
                      `}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleNiveau(niveau.id)}
                        disabled={isDisabled}
                        className="data-[state=checked]:bg-[#548C2F] data-[state=checked]:border-[#548C2F]"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {niveau.libelle}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="text-[#548C2F] font-bold">✓</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={selectedNiveaux.length === 0 || isPending}
            className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-6"
          >
            {isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Enregistrement...
              </>
            ) : (
              "Confirmer ma sélection"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

