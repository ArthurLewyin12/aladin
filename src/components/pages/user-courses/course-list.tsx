import { useState, useMemo, useEffect } from "react";
import { useGetAllCourses } from "@/services/hooks/cours/useGetAllCourses";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, FileText, ChevronLeft, ChevronRight, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserCourseCard } from "./user-course-card";
import { Course } from "@/services/controllers/types/common/cours.type";
import { getOneCourse } from "@/services/controllers/cours.controller";
import { toast } from "@/lib/toast";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

const ITEMS_PER_PAGE = 6;

export function CourseList() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetAllCourses();
  const courses: Course[] = (data?.courses as Course[]) || [];
  const [loadingCourseId, setLoadingCourseId] = useState<number | null>(null);

  // Tab management avec nuqs
  const [activeTab, setActiveTab] = useQueryState("tab", parseAsString.withDefault("personnel"));
  // Pagination avec nuqs
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // Vérifier s'il y a des cours dans chaque catégorie
  const hasPersonalCourses = courses.some(course => course.type === "personnel");
  const hasClassCourses = courses.some(course => course.type === "classe_genere");

  // Si une seule catégorie a des cours, forcer ce tab
  const effectiveActiveTab = !hasPersonalCourses && hasClassCourses ? "classe" :
                            !hasClassCourses && hasPersonalCourses ? "personnel" : activeTab;

  // Mettre à jour le tab actif si nécessaire
  useEffect(() => {
    if (effectiveActiveTab !== activeTab) {
      setActiveTab(effectiveActiveTab);
    }
  }, [effectiveActiveTab, activeTab, setActiveTab]);

  // Filtrer et trier les cours selon le tab actif
  const { filteredCourses, paginatedCourses, totalPages } = useMemo(() => {
    // Filtrer selon le type
    const filtered = courses.filter(course =>
      activeTab === "personnel" ? course.type === "personnel" : course.type === "classe_genere"
    );

    // Trier par ID décroissant (plus récents en premier)
    const sortedCourses = [...filtered].sort((a, b) => b.id - a.id);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return {
      filteredCourses: sortedCourses,
      paginatedCourses: sortedCourses.slice(startIndex, endIndex),
      totalPages: Math.ceil(sortedCourses.length / ITEMS_PER_PAGE),
    };
  }, [courses, activeTab, page]);

  const tabs = [
    { label: "personnel", icon: <User size={16} /> },
    { label: "classe", icon: <Users size={16} /> },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1); // Reset pagination when changing tabs
  };

  const handleOpenDetails = async (course: Course) => {
    setLoadingCourseId(course.id);

    try {
      // Tenter de charger le cours pour vérifier s'il est disponible
      await getOneCourse(course.id);

      // Si succès, rediriger vers la page du cours
      router.push(`/student/cours/saved/${course.id}`);
    } catch (err: any) {
      // Si erreur (404 ou autre), afficher un toast informatif
      toast({
        title: "Cours en cours de préparation",
        message:
          "Ce cours sera bientôt disponible. Merci de réessayer dans quelques instants.",
        variant: "warning",
        duration: 4000,
      });
    } finally {
      setLoadingCourseId(null);
    }
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
            Une erreur est survenue lors du chargement des cours.
          </p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        {/* Illustration centrale */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-4 sm:mt-8">
          <div className="relative w-full max-w-2xl">
            <EmptyState
              title="Aucun cours généré"
              description="Crée ton premier cours personnalisé et commence à apprendre de manière efficace !"
              icons={[
                <FileText key="1" size={20} />,
                <BookOpen key="2" size={20} />,
                <Plus key="3" size={20} />,
              ]}
              size="default"
              theme="light"
              variant="default"
            />
          </div>

          {/* Texte et bouton CTA */}
          <div className="text-center px-4">
            <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
              Clique ci-dessous pour générer ton premier cours et commencer
              l'aventure !
            </p>

            <Button
              size="lg"
              onClick={() => router.push("/student/revision/generated")}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl w-full sm:w-auto"
            >
              <Plus className="w-4  sm:w-5 h-5 mr-2" />
              Générer un cours
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Header avec bouton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Mes Cours
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {filteredCourses.length} cours{" "}
              {filteredCourses.length > 1 ? "disponibles" : "disponible"}
              {totalPages > 1 && ` • Page ${page} sur ${totalPages}`}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push("/student/revision/generated")}
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="w-4  sm:w-5 h-5 mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">Nouveau cours</span>
            <span className="sm:hidden">Créer</span>
          </Button>
        </div>

        {/* Tabs pour filtrer les cours */}
        {(hasPersonalCourses && hasClassCourses) && (
          <div className="flex justify-center">
            <AnimatedTabs
              tabs={tabs}
              activeTab={effectiveActiveTab}
              onTabChange={handleTabChange}
            />
          </div>
        )}

        {/* Grille des cours paginés */}
        {paginatedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedCourses.map((course, index) => (
              <UserCourseCard
                key={course.id}
                course={course}
                index={(page - 1) * ITEMS_PER_PAGE + index}
                onDetailsClick={() => handleOpenDetails(course)}
                isLoading={loadingCourseId === course.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:gap-8 mt-8">
            <EmptyState
              title={`Aucun cours ${effectiveActiveTab === "personnel" ? "personnel" : "de classe"}`}
              description={`${
                effectiveActiveTab === "personnel"
                  ? "Crée ton premier cours personnalisé !"
                  : "Les cours de classe apparaîtront ici quand ils seront disponibles."
              }`}
              icons={[
                <FileText key="1" size={20} />,
                <BookOpen key="2" size={20} />,
              ]}
              size="default"
              theme="light"
              variant="default"
            />
          </div>
        )}

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
    </>
  );
}
