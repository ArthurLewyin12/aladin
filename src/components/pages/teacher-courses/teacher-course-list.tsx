"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSubjects } from "@/services/hooks/professeur/useSubjects";
import { useClasses } from "@/services/hooks/professeur/useClasses";
import { useCourses, Course } from "@/services/hooks/professeur/useCourses";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, FileText, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CourseCard } from "./course-card";
import Image from "next/image";

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
  "bg-[#F0F9FF]", // Bleu très clair
  "bg-[#FEF3C7]", // Jaune clair
];

export function TeacherCourseList() {
  const router = useRouter();

  // Récupérer les matières enseignées du prof
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const subjectsResponse = subjectsData || { matieres: [], libelles: [], count: 0, max: 3 };
  // Vérifier si le prof a défini des matières (nouveau format: libelles contient les IDs)
  const hasDefinedSubjects = (subjectsResponse.libelles && subjectsResponse.libelles.length > 0) || subjectsResponse.matieres.length > 0;

  // Récupérer les classes du prof
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const hasClasses = (classes || []).length > 0;

  // Récupérer les cours du professeur
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses();
  const courses = coursesData?.courses || [];

  // Enrichir les cours avec les couleurs
  const enrichedCourses = useMemo(() => {
    return courses.map((course: Course, index: number) => ({
      ...course,
      cardColor: CARD_COLORS[index % CARD_COLORS.length],
    }));
  }, [courses]);

  if (isLoadingSubjects || isLoadingClasses || isLoadingCourses) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  // Cas 1: Le prof n'a pas défini ses matières
  if (!hasDefinedSubjects) {
    return (
      <div className="px-4 sm:px-0">
        <div className="mb-6 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 bg-amber-50 flex gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              Définissez vos matières d'abord
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              Vous devez définir les matières que vous enseignez avant de créer des cours. Cela garantira que les cours correspondent à vos domaines d'enseignement.
            </p>
            <Button
              onClick={() => router.push("/teacher/settings")}
              className="text-sm bg-amber-600 hover:bg-amber-700 text-white"
            >
              Aller aux paramètres
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Cas 2: Le prof n'a pas créé de classes
  if (!hasClasses) {
    return (
      <div className="px-4 sm:px-0">
        <div className="mb-6 p-4 sm:p-5 rounded-2xl border-2 border-blue-200 bg-blue-50 flex gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Créez une classe d'abord
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Les cours doivent être associés à une classe. Créez au moins une classe avant de créer des cours.
            </p>
            <Button
              onClick={() => router.push("/teacher/classes")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              Créer une classe
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Cas 3: Pas de cours créés, mais matières et classes existent
  if (courses.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        {/* Illustration centrale */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
          <div className="relative w-full max-w-sm">
            <Image
              src="/meet.gif"
              alt="Cours illustration"
              width={350}
              height={100}
              className="w-full h-auto object-contain"
              priority
              unoptimized
            />
          </div>

          {/* Texte et bouton CTA */}
          <div className="text-center px-4">
            <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
              Créez vos premiers cours pour vos classes et partagez vos connaissances
              avec vos élèves !
            </p>

              <Button
                size="lg"
                onClick={() => router.push("/teacher/courses/create")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
              >
                <Plus className="w-4 sm:w-5 h-5 mr-2" />
                Créer un cours
              </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Bouton en haut quand il y a des cours */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            Mes Cours
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {courses.length} cours {courses.length > 1 ? "disponibles" : "disponible"}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => router.push("/teacher/courses/create")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="w-4 sm:w-5 h-5 mr-2 flex-shrink-0" />
          <span className="hidden sm:inline">Nouveau cours</span>
          <span className="sm:hidden">Créer</span>
        </Button>
      </div>

      {/* Grille des cours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {enrichedCourses.map((course) => (
          <CourseCard
            key={`course-${course.id}`}
            course={course}
            cardColor={course.cardColor}
            onEdit={(courseId) => router.push(`/teacher/courses/${courseId}/edit`)}
            onPreview={(courseId) => router.push(`/teacher/courses/${courseId}/preview`)}
            onDelete={(courseId) => {
              // TODO: Implémenter la suppression
              console.log("Supprimer cours", courseId);
            }}
          />
        ))}
      </div>
    </div>
  );
}
