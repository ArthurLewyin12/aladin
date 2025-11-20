"use client";

import { useState, useMemo } from "react";
import { useGetEleveCours } from "@/services/hooks/cours/useGetAllCourses";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EleveCours, EleveClasse } from "@/services/controllers/types/common/cours.type";
import { useSession } from "@/services/hooks/auth/useSession";

interface EleveCoursesByClassProps {
  className?: string;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export const EleveCoursesByClass = ({ className }: EleveCoursesByClassProps) => {
  const router = useRouter();
  const { user } = useSession();

  console.log("🔍 EleveCoursesByClass rendu");
  console.log("🔍 User:", user);
  console.log("🔍 User ID:", user?.id);

  const { data, isLoading, isError } = useGetEleveCours(user?.id || null);

  console.log("🔍 Hook useGetEleveCours appelé avec userId:", user?.id);
  console.log("🔍 Hook response - isLoading:", isLoading, "isError:", isError, "data:", data);

  const classes = data?.classes || [];
  const cours = data?.cours || [];
  const count = data?.count || { classes: 0, cours_manuel: 0, cours_genere: 0, cours_total: 0 };

  const handleViewCourse = (course: EleveCours) => {
    // Pour l'instant, rediriger vers la page des cours existante
    // TODO: Créer une page dédiée pour les cours de classe
    router.push(`/student/cours/saved/${course.id}`);
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
            Erreur lors du chargement des cours.
          </p>
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
          <div className="relative w-full max-w-2xl">
            <EmptyState
              title="Aucune classe trouvée"
              description="Vous n'êtes inscrit dans aucune classe pour le moment."
              icons={[<GraduationCap key="graduation" size={20} />]}
              size="default"
              theme="light"
              variant="default"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{count.classes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cours manuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{count.cours_manuel}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cours générés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{count.cours_genere}</div>
          </CardContent>
        </Card>
      </div>

      {/* Classes et leurs cours */}
      <div className="space-y-8">
        {classes.map((classe) => {
          const classCourses = cours.filter(course => course.classe.id === classe.id);

          return (
            <div key={classe.id} className="space-y-4">
              {/* Header de la classe */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{classe.nom}</h3>
                  <p className="text-sm text-gray-600">{classe.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {classCourses.length} cours disponible{classCourses.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Cours de la classe */}
              {classCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classCourses.map((course, index) => (
                    <div
                      key={course.id}
                      className={`relative rounded-3xl p-6 shadow-sm transition-all hover:shadow-md ${CARD_COLORS[index % CARD_COLORS.length]}`}
                    >
                      {/* Header avec titre et type */}
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <h4 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                          {course.titre}
                        </h4>
                        <Badge
                          variant={course.type === "manuel" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {course.type === "manuel" ? "Manuel" : "Généré"}
                        </Badge>
                      </div>

                      {/* Informations du cours */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {course.chapitre.matiere.libelle}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Chapitre : {course.chapitre.libelle}
                        </p>
                        <p className="text-sm text-gray-600">
                          Professeur : {course.professeur.prenom} {course.professeur.nom}
                        </p>
                        {course.type === "genere" && course.data?.questions && (
                          <p className="text-sm text-gray-600">
                            Questions : {course.data.questions.length}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Créé le : {new Date(course.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>

                      {/* Aperçu du contenu */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {course.type === "genere" && course.data?.course_data?.Introduction
                            ? course.data.course_data.Introduction.substring(0, 150) + "..."
                            : course.plain_text
                            ? course.plain_text.substring(0, 150) + "..."
                            : "Aucun aperçu disponible"}
                        </p>
                      </div>

                      {/* Footer avec bouton */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewCourse(course)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 font-semibold text-sm"
                        >
                          Voir le cours
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Aucun cours disponible dans cette classe</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};