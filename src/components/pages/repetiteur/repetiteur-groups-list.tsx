"use client";

import { useMemo } from "react";
import { useEleveGroupes } from "@/services/hooks/repetiteur";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import { Users, BookOpen, FileQuestion, ChevronLeft, ChevronRight, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseAsInteger, useQueryState } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ITEMS_PER_PAGE = 6;

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

interface RepetiteurGroupsListProps {
  eleve: any;
  isEleveReady: boolean;
  onCreateGroup?: () => void;
}

export function RepetiteurGroupsList({ eleve, isEleveReady, onCreateGroup }: RepetiteurGroupsListProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useEleveGroupes(isEleveReady);
  const groupes = data?.groupes || [];

  // Pagination avec nuqs
  const [page, setPage] = useQueryState("groupesPage", parseAsInteger.withDefault(1));

  // Enrichir les groupes avec les couleurs
  const enrichedGroupes = useMemo(() => {
    return groupes.map((groupe, index) => ({
      ...groupe,
      cardColor: CARD_COLORS[index % CARD_COLORS.length],
    }));
  }, [groupes]);

  // Calculer les groupes paginés
  const { paginatedGroupes, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedGroupes: enrichedGroupes.slice(startIndex, endIndex),
      totalPages: Math.ceil(enrichedGroupes.length / ITEMS_PER_PAGE),
    };
  }, [enrichedGroupes, page]);

  const handleViewGroup = (groupId: number) => {
    router.push(`/repetiteur/groups/${groupId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 sm:p-6 text-center max-w-md w-full">
          <p className="text-red-600 text-sm sm:text-base">
            Une erreur est survenue lors du chargement des groupes.
          </p>
        </div>
      </div>
    );
  }

  if (groupes.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        {/* Info élève */}
        <div className="bg-[#F0F7EC] border border-[#C8E0B8] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E3F1D9] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#548C2F]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Groupes de</p>
              <h3 className="text-lg font-semibold text-[#548C2F]">
                {eleve.prenom} {eleve.nom}
              </h3>
            </div>
          </div>
        </div>

        {/* Illustration centrale */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
          <div className="relative w-full max-w-2xl">
            <EmptyState
              title="Aucun groupe"
              description={`${eleve.prenom} n'a pas encore rejoint de groupe d'étude.`}
              icons={[
                <Users key="1" size={20} />,
                <BookOpen key="2" size={20} />,
                <FileQuestion key="3" size={20} />,
              ]}
              size="default"
              theme="light"
              variant="default"
            />
          </div>

          {/* Bouton créer un groupe */}
          {onCreateGroup && (
            <button
              onClick={onCreateGroup}
              className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-6 py-3 text-sm rounded-lg shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Créer un groupe
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Info élève + Titre en haut */}
        <div className="bg-[#F0F7EC] border border-[#C8E0B8] rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E3F1D9] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#548C2F]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Groupes de</p>
                <h3 className="text-lg font-semibold text-[#548C2F]">
                  {eleve.prenom} {eleve.nom}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Groupes rejoints
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {groupes.length} groupe{groupes.length > 1 ? "s" : ""}{" "}
              {totalPages > 1 && `• Page ${page} sur ${totalPages}`}
            </p>
          </div>
          {onCreateGroup && (
            <button
              onClick={onCreateGroup}
              className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-4 py-3 text-sm rounded-lg shadow-lg transition-all hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Nouveau groupe</span>
              <span className="sm:hidden">Créer</span>
            </button>
          )}
        </div>

        {/* Grille des groupes paginés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedGroupes.map((groupe) => (
            <Card
              key={groupe.id}
              className={`${groupe.cardColor} rounded-[24px] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] duration-300 cursor-pointer border-0`}
              onClick={() => handleViewGroup(groupe.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
                  {groupe.nom}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupe.description && (
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {groupe.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{groupe.nombre_membres || 0} membre{(groupe.nombre_membres || 0) > 1 ? "s" : ""}</span>
                </div>

                {groupe.niveau && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{groupe.niveau.libelle}</span>
                  </div>
                )}

                <button
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewGroup(groupe.id);
                  }}
                >
                  Voir les détails
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const showPage =
                  pageNum <= 2 ||
                  pageNum >= totalPages - 1 ||
                  (pageNum >= page - 1 && pageNum <= page + 1);

                const showEllipsisBefore = pageNum === 3 && page > 4;
                const showEllipsisAfter =
                  pageNum === totalPages - 2 && page < totalPages - 3;

                if (!showPage && !showEllipsisBefore && !showEllipsisAfter) {
                  return null;
                }

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span key={pageNum} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={`rounded-full min-w-[2.5rem] ${
                      pageNum === page
                        ? "bg-[#548C2F] hover:bg-[#4a7829]"
                        : ""
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
