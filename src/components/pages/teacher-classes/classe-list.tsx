"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useClassesWithDetails } from "@/services/hooks/professeur/useClassesWithDetails";
import { useDeactivateClasse } from "@/services/hooks/professeur/useDeactivateClasse";
import { useReactivateClasse } from "@/services/hooks/professeur/useReactivateClasse";
import { ClasseCard } from "./classe-card";
import { AddStudentModal } from "./add-student-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

const ITEMS_PER_PAGE = 6;

const CARD_COLORS = [
  "bg-[#D4F4DD]", // Vert clair
  "bg-[#E8F8E8]", // Vert très clair
  "bg-[#C8E6C9]", // Vert menthe
  "bg-[#DCEDC8]", // Vert lime clair
];

interface ClasseListProps {
  onCreateClasse: () => void;
}

export const ClasseList = ({ onCreateClasse }: ClasseListProps) => {
  const router = useRouter();
  const { data: classes, isLoading, isError } = useClassesWithDetails();
  const { mutate: deactivateClasseMutation } = useDeactivateClasse();
  const { mutate: reactivateClasseMutation } = useReactivateClasse();

  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [selectedClasseId, setSelectedClasseId] = useState<number | null>(null);

  // Pagination et recherche avec nuqs
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const enrichedClasses = useMemo(() => {
    if (!classes) return [];

    // Filtrer les classes sans ID valide et éviter les doublons
    const seenIds = new Set<number>();
    const filtered = classes
      .filter((classe) => {
        if (!classe || classe.id == null) {
          console.warn("Classe sans ID valide ignorée:", classe);
          return false;
        }
        if (seenIds.has(classe.id)) {
          console.warn(`Classe dupliquée avec l'ID ${classe.id} ignorée`);
          return false;
        }
        seenIds.add(classe.id);
        return true;
      })
      .sort((a, b) => b.id - a.id) // Trier par ID décroissant (plus récent en premier)
      // Filtrer par recherche
      .filter((classe) => {
        if (!searchQuery) return true;
        return classe.nom.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map((classe, index) => ({
        ...classe,
        cardColor: CARD_COLORS[index % CARD_COLORS.length],
      }));

    return filtered;
  }, [classes, searchQuery]);

  // Calculer les classes paginées
  const { paginatedClasses, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedClasses: enrichedClasses.slice(startIndex, endIndex),
      totalPages: Math.ceil(enrichedClasses.length / ITEMS_PER_PAGE),
    };
  }, [enrichedClasses, page]);

  const handleViewDetails = (classeId: number) => {
    router.push(`/teacher/classes/${classeId}`);
  };

  const handleOpen = (classeId: number) => {
    router.push(`/teacher/classes/${classeId}`);
  };

  const handleDeactivate = (classeId: number) => {
    deactivateClasseMutation(classeId);
  };

  const handleReactivate = (classeId: number) => {
    reactivateClasseMutation(classeId);
  };

  const handleAddStudent = (classeId: number) => {
    setSelectedClasseId(classeId);
    setAddStudentModalOpen(true);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          Erreur lors du chargement des classes
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton de création */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            Mes Classes
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {enrichedClasses.length} classe
            {enrichedClasses.length > 1 ? "s" : ""}
            {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
          </p>
        </div>
        <Button
          size="lg"
          onClick={onCreateClasse}
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="w-4 sm:w-5 h-5 mr-2 flex-shrink-0" />
          <span className="hidden sm:inline">Nouvelle classe</span>
          <span className="sm:hidden">Créer</span>
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-2">
        <div className="relative flex-1 mx-auto max-w-[500px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher une classe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-2 border-gray-200 rounded-3xl h-12 "
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Grille des classes paginées */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {paginatedClasses.map((classe) => (
          <ClasseCard
            key={`classe-${classe.id}`}
            classe={classe}
            cardColor={classe.cardColor}
            onViewDetails={handleViewDetails}
            onOpen={handleOpen}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivate}
            onAddStudent={handleAddStudent}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={page === 1}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => {
                    setPage(pageNum);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`rounded-full ${
                    pageNum === page
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : ""
                  }`}
                >
                  {pageNum}
                </Button>
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Modal pour ajouter un élève */}
      {selectedClasseId && (
        <AddStudentModal
          classeId={selectedClasseId}
          classeName={
            enrichedClasses.find((c) => c.id === selectedClasseId)?.nom || ""
          }
          classeNiveauId={
            enrichedClasses.find((c) => c.id === selectedClasseId)?.niveau_id
          }
          isOpen={isAddStudentModalOpen}
          onClose={() => setAddStudentModalOpen(false)}
        />
      )}
    </div>
  );
};
