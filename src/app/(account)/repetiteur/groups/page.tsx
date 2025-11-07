"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BookOpen, FileQuestion } from "lucide-react";
import { GroupList } from "@/components/pages/groups/group-list";
import { EmptyState } from "@/components/ui/empty-state";
import { useGroupes } from "@/services/hooks/groupes/useGroupes";
import { useEleves } from "@/services/hooks/repetiteur";
import { Spinner } from "@/components/ui/spinner";

export default function RepetiteurGroupsPage() {
  const router = useRouter();
  const { data: elevesData } = useEleves();
  const { data: groupes, isLoading, isError } = useGroupes();

  const eleveActif = elevesData?.eleve_actif;

  const handleBack = () => {
    router.push("/repetiteur/home");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">
            Une erreur est survenue lors du chargement des groupes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#548C2F] leading-tight">
                Groupes d'étude
              </h1>
            </div>
          </div>
        </div>

        {/* Afficher l'élève actif */}
        {eleveActif && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[20px]">
            <p className="text-sm text-gray-700">
              Groupes pour :{" "}
              <span className="font-semibold text-[#548C2F]">
                {eleveActif.prenom} {eleveActif.nom}
              </span>{" "}
              ({eleveActif.niveau?.libelle})
            </p>
          </div>
        )}

        {/* Afficher les groupes ou empty state */}
        {groupes && groupes.length > 0 ? (
          <GroupList
            onCreateGroup={() => {}}
            basePath="/repetiteur/groups"
            showCreateButton={false}
            variant="repetiteur"
          />
        ) : (
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="relative w-full max-w-2xl">
              <EmptyState
                title="Aucun groupe d'étude"
                description="Vous n'avez pas encore créé de groupe d'étude. Les groupes que vous créerez seront affichés ici."
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
          </div>
        )}
      </div>
    </div>
  );
}
