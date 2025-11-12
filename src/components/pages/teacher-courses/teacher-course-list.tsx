"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSubjects } from "@/services/hooks/professeur/useSubjects";
import { useClasses } from "@/services/hooks/professeur/useClasses";
import { useCourses, Course } from "@/services/hooks/professeur/useCourses";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, FileText, Plus, AlertCircle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CourseCard } from "./course-card";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseAsInteger, useQueryState } from "nuqs";

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
  "bg-[#F0F9FF]", // Bleu très clair
  "bg-[#FEF3C7]", // Jaune clair
];

const ITEMS_PER_PAGE = 6;

export function TeacherCourseList() {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // Récupérer les matières enseignées du prof
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const subjectsResponse = subjectsData || {
    matieres: [],
    libelles: [],
    count: 0,
    max: 3,
  };
  // Vérifier si le prof a défini des matières (nouveau format: libelles contient les IDs)
  const hasDefinedSubjects =
    (subjectsResponse.libelles && subjectsResponse.libelles.length > 0) ||
    subjectsResponse.matieres.length > 0;

  // Récupérer les classes du prof
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const hasClasses = (classes || []).length > 0;

  // Récupérer les cours du professeur
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses();
  const courses = coursesData?.courses || [];

  // Compter les cours générés et manuels
  const { countGenere, countManuel } = useMemo(() => {
    const genere = courses.filter((c: any) => c.type === "genere").length;
    const manuel = courses.filter((c: any) => c.type === "manuel").length;
    return { countGenere: genere, countManuel: manuel };
  }, [courses]);

  // Enrichir les cours avec les couleurs et paginer
  const { paginatedCourses, totalPages } = useMemo(() => {
    const enriched = courses.map((course: Course, index: number) => ({
      ...course,
      cardColor: CARD_COLORS[index % CARD_COLORS.length],
    }));

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedCourses: enriched.slice(startIndex, endIndex),
      totalPages: Math.ceil(enriched.length / ITEMS_PER_PAGE),
    };
  }, [courses, page]);

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
              Vous devez définir les matières que vous enseignez avant de créer
              des cours. Cela garantira que les cours correspondent à vos
              domaines d'enseignement.
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
              Les cours doivent être associés à une classe. Créez au moins une
              classe avant de créer des cours.
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
              Créez vos premiers cours pour vos classes et partagez vos
              connaissances avec vos élèves !
            </p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-3xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
                >
                  <Plus className="w-4 sm:w-5 h-5 mr-2" />
                  Créer un cours
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="rounded-3xl border-0 shadow-xl w-64 p-2 bg-white"
              >
                <DropdownMenuItem
                  onClick={() =>
                    router.push("/teacher/courses/create?type=manual")
                  }
                  className="rounded-2xl cursor-pointer p-4 hover:bg-green-50 focus:bg-green-50 transition-colors mb-2"
                >
                  <BookOpen className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Cours Manuel</p>
                    <p className="text-xs text-gray-600">
                      Créez votre cours manuellement
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/teacher/courses/generate")}
                  className="rounded-2xl cursor-pointer p-4 hover:bg-green-50 focus:bg-green-50 transition-colors"
                >
                  <Sparkles className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Cours par IA</p>
                    <p className="text-xs text-gray-600">Générez avec Aladin</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            {countGenere} généré{countGenere > 1 ? "s" : ""} • {countManuel} manuel{countManuel > 1 ? "s" : ""}
            {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg rounded-3xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap"
            >
              <Plus className="w-4 sm:w-5 h-5 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Nouveau cours</span>
              <span className="sm:hidden">Créer</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-3xl border-0 shadow-xl w-64 p-2 bg-white"
          >
            <DropdownMenuItem
              onClick={() => router.push("/teacher/courses/create?type=manual")}
              className="rounded-2xl cursor-pointer p-4 hover:bg-green-50 focus:bg-green-50 transition-colors mb-2"
            >
              <BookOpen className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Cours Manuel</p>
                <p className="text-xs text-gray-600">
                  Créez votre cours manuellement
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/teacher/courses/generate")}
              className="rounded-2xl cursor-pointer p-4 hover:bg-green-50 focus:bg-green-50 transition-colors"
            >
              <Sparkles className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Cours par IA</p>
                <p className="text-xs text-gray-600">Générez avec Aladin</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grille des cours paginés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {paginatedCourses.map((course) => (
          <CourseCard
            key={`course-${course.id}`}
            course={course}
            cardColor={course.cardColor}
            onEdit={(courseId) =>
              router.push(`/teacher/courses/${courseId}/edit`)
            }
            onPreview={(courseId) => {
              // Find the course to check its type
              const courseData = paginatedCourses.find(c => c.id === courseId);
              const previewPath =
                courseData?.type === "genere"
                  ? `/teacher/courses/${courseId}/preview-ia`
                  : `/teacher/courses/${courseId}/preview`;
              router.push(previewPath);
            }}
            onDelete={(courseId) => {
              // TODO: Implémenter la suppression
              console.log("Supprimer cours", courseId);
            }}
          />
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
                      ? "bg-[#2C3E50] hover:bg-[#1a252f]"
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
  );
}
