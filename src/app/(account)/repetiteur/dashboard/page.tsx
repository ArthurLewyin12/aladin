"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Users, BookOpen, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useEleves } from "@/services/hooks/repetiteur";
import { useSession } from "@/services/hooks/auth/useSession";
import { useRepetiteurStats } from "@/services/hooks/repetiteur";

export default function RepetiteurDashboardPage() {
  const router = useRouter();
  const { user } = useSession();
  const { data: elevesData, isLoading: isLoadingEleves } = useEleves();
  const { data: statsData, isLoading: isLoadingStats } = useRepetiteurStats(
    user?.id || 0
  );

  const eleves = elevesData?.eleves || [];
  const eleveActif = elevesData?.eleve_actif;
  const stats = statsData?.stats;

  const handleBack = () => {
    router.push("/repetiteur/home");
  };

  if (isLoadingEleves || isLoadingStats) {
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

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
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
            <span className="text-2xl sm:text-3xl">📊</span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#548C2F] leading-tight">
              Tableau de bord
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Vue d'ensemble de votre activité et de vos élèves
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-[#F0F7EC] to-white border-[#C8E0B8]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Élèves
              </CardTitle>
              <Users className="h-5 w-5 text-[#548C2F]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#548C2F]">
                {stats?.nombre_eleves || eleves.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.nombre_eleves_actifs || 0} actifs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Quiz créés
              </CardTitle>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats?.total_quiz_crees || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total généré</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cours créés
              </CardTitle>
              <FileText className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats?.total_cours_crees || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total généré</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Progression
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">+12%</div>
              <p className="text-xs text-gray-500 mt-1">Ce mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Élève actif */}
        {eleveActif ? (
          <Card className="mb-8 bg-[#F0F7EC] border-[#C8E0B8]">
            <CardHeader>
              <CardTitle className="text-[#548C2F]">Élève actuellement suivi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#E3F1D9] rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#548C2F]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {eleveActif.prenom} {eleveActif.nom}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {eleveActif.niveau?.libelle}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {eleveActif.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-amber-200">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun élève sélectionné
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionnez un élève pour voir ses statistiques et créer du
                  contenu adapté
                </p>
                <Button
                  onClick={() => router.push("/repetiteur/students")}
                  className="bg-[#548C2F] hover:bg-[#4a7829]"
                >
                  Sélectionner un élève
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des élèves */}
        {eleves.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mes élèves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eleves.map((eleve) => (
                  <div
                    key={eleve.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      eleveActif?.id === eleve.id
                        ? "bg-[#F0F7EC] border-[#548C2F]"
                        : "bg-gray-50 border-gray-200 hover:border-[#C8E0B8]"
                    }`}
                    onClick={() => router.push("/repetiteur/students")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E3F1D9] rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#548C2F]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {eleve.prenom} {eleve.nom}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {eleve.niveau?.libelle}
                          </p>
                        </div>
                      </div>
                      {eleveActif?.id === eleve.id && (
                        <span className="text-xs font-medium text-[#548C2F] bg-[#E3F1D9] px-3 py-1 rounded-full">
                          Actif
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

