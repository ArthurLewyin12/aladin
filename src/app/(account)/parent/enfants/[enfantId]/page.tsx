"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, FileQuestion, Users, BarChart3 } from "lucide-react";
import { useEnfants, useEnfantResume } from "@/services/hooks/parent";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function EnfantProfilPage() {
  const params = useParams();
  const router = useRouter();
  const enfantId = params.enfantId as string;

  // Récupérer les données de l'enfant
  const { data: enfantsData, isLoading: isLoadingEnfants } = useEnfants();
  const { data: resumeData, isLoading: isLoadingResume } = useEnfantResume();

  const handleBack = () => {
    router.push("/parent/enfants");
  };

  if (isLoadingEnfants) {
    return (
      <div className="min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  const enfant = enfantsData?.enfants.find((e) => e.id.toString() === enfantId);

  if (!enfant) {
    return (
      <div className="min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">Enfant non trouvé.</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = resumeData?.statistiques || {
    groupes: 0,
    quiz_personnels: 0,
    quiz_groupes: 0,
    quiz_total: 0,
    cours: 0,
    total_contenus: 0,
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-10 sm:h-10 shadow-sm flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 leading-tight">
              Profil de {enfant.prenom}
            </h1>
          </div>
        </div>

        {/* Informations de l'enfant */}
        <Card className="rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-gray-900">
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Nom complet</span>
              <span className="font-semibold text-gray-900">
                {enfant.prenom} {enfant.nom}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Niveau</span>
              <span className="font-semibold text-gray-900">
                {enfant.niveau?.libelle || "Non défini"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-semibold text-gray-900 truncate ml-2">
                {enfant.email}
              </span>
            </div>
            {enfant.numero && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Téléphone</span>
                <span className="font-semibold text-gray-900">{enfant.numero}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-semibold text-gray-900">
                {enfant.type === "utilisateur" ? "Compte élève" : "Ajouté manuellement"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        {isLoadingResume ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Quiz créés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.quiz_total}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.quiz_personnels} personnels, {stats.quiz_groupes} en groupe
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cours créés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.cours}</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Groupes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.groupes}</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total contenus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.total_contenus}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions CTA */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Actions disponibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Générer un quiz */}
            <button
              onClick={() => router.push(`/parent/enfants/${enfantId}/quiz/generate`)}
              className="w-full bg-white hover:bg-purple-50 border-2 border-purple-100 rounded-2xl p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-purple-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                  <FileQuestion className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5">
                    Créer un quiz
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Générer un quiz pour {enfant.prenom}
                  </p>
                </div>
              </div>
            </button>

            {/* Créer un cours */}
            <button
              onClick={() => router.push(`/parent/enfants/${enfantId}/cours/generate`)}
              className="w-full bg-white hover:bg-purple-50 border-2 border-purple-100 rounded-2xl p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-purple-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5">
                    Créer un cours
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Générer un cours pour {enfant.prenom}
                  </p>
                </div>
              </div>
            </button>

            {/* Ajouter à un groupe */}
            <button
              onClick={() => router.push(`/parent/groups?enfantId=${enfantId}`)}
              className="w-full bg-white hover:bg-purple-50 border-2 border-purple-100 rounded-2xl p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-purple-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5">
                    Ajouter à un groupe
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Gérer les groupes de {enfant.prenom}
                  </p>
                </div>
              </div>
            </button>

            {/* Voir le dashboard */}
            <button
              onClick={() => router.push(`/parent/dashboard?enfantId=${enfantId}`)}
              className="w-full bg-white hover:bg-purple-50 border-2 border-purple-100 rounded-2xl p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-purple-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5">
                    Voir les statistiques
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Consulter les progrès de {enfant.prenom}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Contenus créés - Empty state si aucun contenu */}
        {stats.total_contenus === 0 && (
          <div className="px-4 sm:px-0">
            <EmptyState
              title="Aucun contenu créé pour le moment"
              description={`Commencez par créer un quiz ou un cours pour ${enfant.prenom} !`}
              icons={[
                <FileQuestion key="1" size={20} />,
                <BookOpen key="2" size={20} />,
                <Users key="3" size={20} />,
              ]}
              size="default"
              theme="light"
              variant="default"
              className="mx-auto max-w-[50rem]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
