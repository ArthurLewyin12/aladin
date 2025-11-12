"use client";
import { useMemo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourse } from "@/services/hooks/professeur/useCourse";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MessageCircleQuestion } from "lucide-react";
import { MathText } from "@/components/ui/MathText";
import { Spinner } from "@/components/ui/spinner";

export default function CoursePreviewIAPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.courseId as string);

  const { data: course, isLoading, isError, error } = useCourse(courseId);

  const handleBack = () => router.back();

  const handleEdit = () => {
    router.push(`/teacher/courses/${courseId}/edit`);
  };

  // Déterminer si c'est le nouveau format structuré
  const hasStructuredCourseData =
    course && typeof course === "object" && "course_data" in course;

  if (isError) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-red-600 mb-2">
            Erreur lors du chargement du cours
          </p>
          <p className="text-sm text-red-500 mb-6">{(error as any)?.message}</p>
          <Button
            onClick={handleBack}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-12 h-12 p-0 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // On ne peut pas afficher la page si les données ne sont pas prêtes (et pas en chargement)
  if (!isLoading && !course) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-700 mb-6">
            Aucune donnée disponible pour ce cours
          </p>
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl w-12 h-12 p-0 justify-center transition-all"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Loader simple pour récupération depuis BD
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-lg font-medium text-gray-700">
            Chargement de votre cours...
          </p>
          <p className="text-sm text-gray-500">
            Récupération du contenu généré
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="mt-2 sm:mt-4 w-full flex items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
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

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 leading-tight">
              Cours généré
            </h1>
          </div>
        </div>

        {/* Main Content */}
        {course && (
          <main className="w-full max-w-4xl mx-auto py-8 sm:py-12 space-y-6">
            {/* NOUVEAU FORMAT STRUCTURÉ */}
            {hasStructuredCourseData ? (
              <>
                {/* Titre Principal avec underline */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-orange-500 w-fit mx-auto">
                  {course.course_data?.["TITRE_DE_LA_LECON"] ||
                    course.course_data?.["Titre de la leçon"] ||
                    course.course_data?.["Titre de la lecon"]}
                </h1>

                {/* Introduction */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Introduction
                  </h2>
                  <div className="text-gray-700 leading-relaxed">
                    <MathText text={course.course_data?.Introduction || ""} />
                  </div>
                </div>

                {/* Développement du cours */}
                {course.course_data &&
                  Object.keys(
                    course.course_data["DEVELOPPEMENT_DU_COURS"] ||
                      course.course_data["developpement du cours"] ||
                      {},
                  ).length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">
                        Développement du cours
                      </h2>
                      <div className="space-y-8">
                        {Object.entries(
                          (course.course_data["DEVELOPPEMENT_DU_COURS"] ||
                            course.course_data[
                              "developpement du cours"
                            ]) as Record<string, any>,
                        ).map(([key, notion]: [string, any], index: number) => (
                          <div
                            key={key}
                            className="border-l-4 border-orange-500 pl-6 py-4"
                          >
                            {/* Numéro et titre de la notion */}
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-2xl font-bold text-orange-500">
                                {index + 1}.
                              </span>
                              <h3 className="text-xl font-bold text-gray-900">
                                {notion.titre}
                              </h3>
                            </div>

                            {/* Définition et cadrage */}
                            {notion.definition_et_cadrage && (
                              <div className="mb-4 bg-blue-50 border-l-2 border-blue-400 pl-4 py-2 rounded">
                                <p className="text-sm font-semibold text-blue-900 mb-1">
                                  Définition
                                </p>
                                <div className="text-gray-700">
                                  <MathText
                                    text={notion.definition_et_cadrage}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Explication approfondie */}
                            {notion.explication_approfondie && (
                              <div className="mb-4 space-y-3">
                                {notion.explication_approfondie.theorie && (
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm mb-1">
                                      Théorie
                                    </p>
                                    <div className="text-gray-700 leading-relaxed">
                                      <MathText
                                        text={
                                          notion.explication_approfondie.theorie
                                        }
                                      />
                                    </div>
                                  </div>
                                )}

                                {notion.explication_approfondie.analyse && (
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm mb-1">
                                      Analyse
                                    </p>
                                    <div className="text-gray-700 leading-relaxed">
                                      <MathText
                                        text={
                                          notion.explication_approfondie.analyse
                                        }
                                      />
                                    </div>
                                  </div>
                                )}

                                {notion.explication_approfondie
                                  .liens_et_applications && (
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm mb-1">
                                      Liens et applications
                                    </p>
                                    <div className="text-gray-700 leading-relaxed">
                                      <MathText
                                        text={
                                          notion.explication_approfondie
                                            .liens_et_applications
                                        }
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Explication simple (fallback) */}
                            {!notion.explication_approfondie &&
                              notion.explication && (
                                <div className="text-gray-700 leading-relaxed mb-4">
                                  <MathText text={notion.explication} />
                                </div>
                              )}

                            {/* Exemples détaillés */}
                            {notion.exemples &&
                              Object.keys(notion.exemples).length > 0 && (
                                <div className="mb-4">
                                  <p className="font-semibold text-gray-900 mb-3">
                                    Exemples
                                  </p>
                                  <div className="space-y-3">
                                    {Object.entries(notion.exemples).map(
                                      ([exKey, exemple]: [string, any]) => {
                                        // Exemple détaillé (avec titre, contexte, développement)
                                        if (
                                          typeof exemple === "object" &&
                                          exemple?.titre
                                        ) {
                                          return (
                                            <div
                                              key={exKey}
                                              className="bg-gray-50 border border-gray-300 rounded-lg p-4"
                                            >
                                              <h4 className="font-semibold text-gray-900 mb-2">
                                                {exemple.titre}
                                              </h4>
                                              {exemple.contexte && (
                                                <div className="mb-2">
                                                  <p className="text-xs font-medium text-gray-600 mb-1">
                                                    Contexte
                                                  </p>
                                                  <div className="text-gray-700 text-sm">
                                                    <MathText
                                                      text={exemple.contexte}
                                                    />
                                                  </div>
                                                </div>
                                              )}
                                              {exemple.developpement && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-600 mb-1">
                                                    Développement
                                                  </p>
                                                  <div className="text-gray-700 text-sm">
                                                    <MathText
                                                      text={
                                                        exemple.developpement
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        } else {
                                          // Exemple simple (juste du texte)
                                          const text =
                                            typeof exemple === "string"
                                              ? exemple
                                              : exemple?.exemple || "";
                                          return text ? (
                                            <div
                                              key={exKey}
                                              className="flex gap-3"
                                            >
                                              <span className="flex-shrink-0 text-orange-500 font-bold">
                                                •
                                              </span>
                                              <div className="text-gray-700">
                                                <MathText text={text} />
                                              </div>
                                            </div>
                                          ) : null;
                                        }
                                      },
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Points clés */}
                            {notion.points_cles &&
                              notion.points_cles.length > 0 && (
                                <div className="mb-4 bg-yellow-50 border-l-2 border-yellow-400 pl-4 py-3 rounded">
                                  <p className="font-semibold text-yellow-900 mb-2">
                                    Points clés à retenir
                                  </p>
                                  <ul className="space-y-1">
                                    {notion.points_cles.map(
                                      (point: string, idx: number) => (
                                        <li
                                          key={idx}
                                          className="flex gap-2 text-yellow-900 text-sm"
                                        >
                                          <span className="flex-shrink-0">
                                            ✓
                                          </span>
                                          <span>{point}</span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Synthèse */}
                {(course.course_data?.["SYNTHESE_DU_COURS"] ||
                  course.course_data?.["Synthese ce qu'il faut retenir"]) && (
                  <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-amber-900 mb-4">
                      Synthèse du cours
                    </h2>

                    {/* Synthèse structurée */}
                    {course.course_data?.["SYNTHESE_DU_COURS"] && (
                      <div className="space-y-4">
                        {course.course_data["SYNTHESE_DU_COURS"]
                          .recapitulatif && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Récapitulatif
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  course.course_data["SYNTHESE_DU_COURS"]
                                    .recapitulatif
                                }
                              />
                            </div>
                          </div>
                        )}

                        {course.course_data["SYNTHESE_DU_COURS"]
                          .competences_acquises && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Compétences acquises
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  course.course_data["SYNTHESE_DU_COURS"]
                                    .competences_acquises
                                }
                              />
                            </div>
                          </div>
                        )}

                        {course.course_data["SYNTHESE_DU_COURS"]
                          .points_de_vigilance && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Points de vigilance
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  course.course_data["SYNTHESE_DU_COURS"]
                                    .points_de_vigilance
                                }
                              />
                            </div>
                          </div>
                        )}

                        {course.course_data["SYNTHESE_DU_COURS"].ouverture && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Ouverture
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  course.course_data["SYNTHESE_DU_COURS"]
                                    .ouverture
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Synthèse simple (fallback) */}
                    {!course.course_data?.["SYNTHESE_DU_COURS"] &&
                      course.course_data?.[
                        "Synthese ce qu'il faut retenir"
                      ] && (
                        <div className="text-amber-950 leading-relaxed">
                          <MathText
                            text={
                              course.course_data[
                                "Synthese ce qu'il faut retenir"
                              ]
                            }
                          />
                        </div>
                      )}
                  </div>
                )}

                {/* Questions d'approfondissement */}
                {course && course.questions && course.questions.length > 0 && (
                  <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-500 rounded-xl">
                        <MessageCircleQuestion className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Questions d'approfondissements
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {course.questions.map((qa: any, index: number) => (
                        <details
                          key={index}
                          className="group bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 p-5 rounded-2xl hover:border-orange-300 transition-all duration-200 open:bg-white open:border-orange-400 open:shadow-md"
                        >
                          <summary className="font-semibold text-base sm:text-lg cursor-pointer text-gray-900 flex items-start gap-3 list-none">
                            <span className="flex-shrink-0 mt-0.5 text-orange-500 group-open:hidden">
                              ▶
                            </span>
                            <span className="flex-shrink-0 mt-0.5 text-orange-500 hidden group-open:block">
                              ▼
                            </span>
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mt-0.5">
                              {index + 1}
                            </span>
                            <MathText text={qa.question} className="flex-1" />
                          </summary>
                          <div className="mt-4 pl-9">
                            <MathText
                              text={qa.reponse}
                              className="text-sm sm:text-base text-gray-700 leading-relaxed"
                            />
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {/* Edit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleEdit}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-3xl"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Éditer ce cours
                  </Button>
                </div>
              </>
            ) : (
              // Fallback pour ancien format
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-600 mb-4">
                  Format de cours non reconnu ou cours non généré par IA
                </p>
                <Button
                  onClick={handleEdit}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Éditer ce cours
                </Button>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
