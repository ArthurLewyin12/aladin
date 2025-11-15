"use client";
import { useMemo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourse } from "@/services/hooks/cours/useCourses";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, BookOpen, MessageCircleQuestion } from "lucide-react";
import { GenerateCoursSuccessResponse } from "@/services/controllers/types/common/cours.type";
import { MathText } from "@/components/ui/MathText";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { useDocumentUpload } from "@/stores/useDocumentUpload";
import { DeepeeningQuestions } from "@/components/pages/cours/deepening-questions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const courseLoadingMessages = [
  "Génération de votre cours personnalisé...",
  "Analyse des concepts clés du chapitre...",
  "Synthèse des informations importantes...",
  "Préparation des exemples et illustrations...",
  "Finalisation du cours...",
];

// Helper function to get course_data or cours_data
const getCourseData = (data: any) => {
  return data?.course_data || data?.cours_data;
};

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const chapterId = params.chapterId as string;
  const [showCourseChoiceModal, setShowCourseChoiceModal] = useState(false);
  const [courseIsExisting, setCourseIsExisting] = useState(false);
  const [showDeepeeningQuestions, setShowDeepeeningQuestions] = useState(false);

  // Récupérer le document depuis le store Zustand
  const { pendingDocument, clearPendingDocument } = useDocumentUpload();

  const { data, isLoading, isError, error } = useCourse(
    chapterId,
    pendingDocument || undefined,
  );
  const { startTracking, stopTracking } = useTimeTracking();

  // Nettoyer le document après avoir chargé le cours
  useEffect(() => {
    if (!isLoading && data) {
      clearPendingDocument();
    }
  }, [isLoading, data, clearPendingDocument]);

  // Détecter si le cours est déjà généré et afficher la modal
  useEffect(() => {
    if (!isLoading && data && "served" in data) {
      const courseData = data as GenerateCoursSuccessResponse;
      if (courseData.served === "existing") {
        setCourseIsExisting(true);
        setShowCourseChoiceModal(true);
      }
    }
  }, [isLoading, data]);

  // Démarrer le tracking quand le cours est chargé
  useEffect(() => {
    if (!isLoading && data && "cours_id" in data && !showCourseChoiceModal) {
      const courseData = data as GenerateCoursSuccessResponse;
      startTracking("revision", courseData.cours_id, Number(chapterId));
    }

    // Arrêter le tracking au démontage
    return () => {
      stopTracking();
    };
  }, [isLoading, data, chapterId, showCourseChoiceModal]);

  const parsedContent = useMemo(() => {
    if (!data || !("text" in data)) return [];

    const courseData = data as GenerateCoursSuccessResponse;
    const romanNumeralRegex = /^([IVXLCDM]+)\.\s/;

    return courseData.text.split("\n").map((line, index) => {
      const isTitle =
        romanNumeralRegex.test(line) ||
        (line.toUpperCase() === line && line.length > 0 && line.length < 100);
      return {
        id: index,
        type: isTitle && line.length < 100 ? "title" : "paragraph",
        content: line,
      };
    });
  }, [data]);

  // Memoized summary generation
  const summary = useMemo(() => {
    if (!data || !("text" in data)) return "";
    const courseData = data as GenerateCoursSuccessResponse;
    const conclusionIndex = courseData.text.indexOf("CONCLUSION");
    if (conclusionIndex !== -1) {
      return courseData.text
        .substring(conclusionIndex + "CONCLUSION".length)
        .trim();
    }
    // Fallback: take first 3 non-title lines
    return parsedContent
      .filter((line) => line.type === "paragraph" && line.content.length > 20)
      .slice(0, 3)
      .map((line) => line.content)
      .join(" ");
  }, [data, parsedContent]);

  const handleBack = () => router.back();

  if (isError || (data && !("text" in data) && !("course_data" in data) && !("cours_data" in data))) {
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
  if (!isLoading && !data) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-700 mb-6">
            Aucune donnée disponible pour ce cours
          </p>
          <Button
            onClick={handleBack}
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl w-12 h-12 p-0 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    );
  }

  const courseData = data as GenerateCoursSuccessResponse;
  const hasStructuredCourseData =
    data && typeof data === "object" && ("course_data" in data || "cours_data" in data);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GenerationLoadingOverlay
        isLoading={isLoading}
        messages={courseLoadingMessages}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec bouton retour et titre */}
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
        {data && (
          <main className="w-full max-w-4xl mx-auto py-8 sm:py-12">
            {showDeepeeningQuestions ? (
              <DeepeeningQuestions
                questions={courseData.questions || []}
                onBack={() => setShowDeepeeningQuestions(false)}
              />
            ) : hasStructuredCourseData ? (
              <>
                {/* NOUVEAU FORMAT STRUCTURÉ - Complet avec tous les champs */}

                {/* Titre Principal avec underline */}
                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 pb-3 w-fit mx-auto">
                  {getCourseData(courseData)?.["TITRE_DE_LA_LECON"] ||
                    getCourseData(courseData)?.["Titre de la leçon"] ||
                    getCourseData(courseData)?.["Titre de la lecon"]}
                </h1>

                {/* Introduction */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Introduction
                  </h2>
                  <div className="text-gray-700 leading-relaxed">
                    <MathText
                      text={
                        getCourseData(courseData)?.Introduction || ""
                      }
                    />
                  </div>
                </div>

                {/* Développement du cours */}
                {getCourseData(courseData) &&
                  Object.keys(
                    getCourseData(courseData)["DEVELOPPEMENT_DU_COURS"] ||
                      getCourseData(courseData)[
                        "developpement du cours"
                      ] ||
                      {},
                  ).length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">
                        Développement du cours
                      </h2>
                      <div className="space-y-8">
                        {Object.entries(
                          getCourseData(courseData)[
                            "DEVELOPPEMENT_DU_COURS"
                          ] ||
                            getCourseData(courseData)[
                              "developpement du cours"
                            ],
                        ).map(([key, notion]: [string, any], index: number) => (
                           <div
                             key={key}
                             className="pl-6 py-4"
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
                {((getCourseData(courseData)?.["SYNTHESE_DU_COURS"] ||
                  getCourseData(courseData)?.[
                    "Synthese ce qu'il faut retenir"
                  ]) && (
                  <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-amber-900 mb-4">
                      Synthèse du cours
                    </h2>

                    {/* Synthèse structurée */}
                    {getCourseData(courseData)?.[
                      "SYNTHESE_DU_COURS"
                    ] && (
                      <div className="space-y-4">
                        {getCourseData(courseData)["SYNTHESE_DU_COURS"]
                          .recapitulatif && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Récapitulatif
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  getCourseData(courseData)[
                                    "SYNTHESE_DU_COURS"
                                  ].recapitulatif
                                }
                              />
                            </div>
                          </div>
                        )}

                        {getCourseData(courseData)["SYNTHESE_DU_COURS"]
                          .competences_acquises && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Compétences acquises
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  getCourseData(courseData)[
                                    "SYNTHESE_DU_COURS"
                                  ].competences_acquises
                                }
                              />
                            </div>
                          </div>
                        )}

                        {getCourseData(courseData)["SYNTHESE_DU_COURS"]
                          .points_de_vigilance && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Points de vigilance
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  getCourseData(courseData)[
                                    "SYNTHESE_DU_COURS"
                                  ].points_de_vigilance
                                }
                              />
                            </div>
                          </div>
                        )}

                        {getCourseData(courseData)["SYNTHESE_DU_COURS"]
                          .ouverture && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Ouverture
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  getCourseData(courseData)[
                                    "SYNTHESE_DU_COURS"
                                  ].ouverture
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Synthèse simple (fallback) */}
                    {!getCourseData(courseData)?.["SYNTHESE_DU_COURS"] &&
                      getCourseData(courseData)?.[
                        "Synthese ce qu'il faut retenir"
                      ] && (
                        <div className="text-amber-950 leading-relaxed">
                          <MathText
                            text={
                              getCourseData(courseData)[
                                "Synthese ce qu'il faut retenir"
                              ]
                            }
                          />
                        </div>
                      )}
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* ANCIEN FORMAT */}
                <article className="prose prose-base sm:prose-base max-w-none text-gray-800">
                  {parsedContent.map((line) => (
                    <div key={line.id}>
                      {line.type === "title" ? (
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 first:mt-0 mb-4">
                          {line.content}
                        </h2>
                      ) : line.content.trim() ? (
                        <MathText
                          text={line.content}
                          className="block my-3 leading-7"
                        />
                      ) : (
                        <div className="h-3" />
                      )}
                    </div>
                  ))}
                </article>

                {/* Key Takeaways Section */}
                <section className="mt-8 pt-6 border-t border-gray-300">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Points clés à retenir
                  </h2>
                  <div className="text-gray-700 leading-relaxed">
                    <MathText text={summary} />
                  </div>
                </section>

                {/* FAQ Section */}
                {courseData.questions && courseData.questions.length > 0 && (
                  <section className="mt-8 pt-6 border-t border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Questions fréquentes
                    </h2>
                    <div className="space-y-3">
                      {courseData.questions.map((qa, index) => (
                        <details
                          key={index}
                          className="group border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <summary className="font-medium text-gray-900 flex items-start gap-3 list-none select-none">
                            <span className="flex-shrink-0 mt-0.5 text-gray-400 group-open:hidden">
                              ▶
                            </span>
                            <span className="flex-shrink-0 mt-0.5 text-gray-400 hidden group-open:block">
                              ▼
                            </span>
                            <MathText
                              text={qa.question}
                              className="flex-1 text-gray-900"
                            />
                          </summary>
                          <div className="mt-3 ml-6 pl-3 border-l-2 border-gray-300">
                            <MathText
                              text={qa.reponse}
                              className="text-gray-700 leading-relaxed"
                            />
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Questions d'approfondissement pour le format structuré */}
            {hasStructuredCourseData &&
              courseData &&
              courseData.questions &&
              courseData.questions.length > 0 && (
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
                    {courseData.questions.map((qa, index) => (
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
          </main>
        )}
      </div>

      {/* Modal pour choix du cours */}
      {courseIsExisting && data && "cours_id" in data && (
        <AlertDialog
          open={showCourseChoiceModal}
          onOpenChange={setShowCourseChoiceModal}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cours déjà généré</AlertDialogTitle>
              <AlertDialogDescription>
                Tu as déjà généré ce cours, Que souhaite-tu faire ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            {/*<div className="space-y-3">
              <p className="text-sm text-gray-600">
                <strong>Approfondir :</strong> Voir les 5 questions
                d'approfondissement pour mieux comprendre le sujet.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Voir :</strong> Accédez au cours complet précédemment
                généré.
              </p>
            </div>*/}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-10 sm:h-10 shadow-sm flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    router.push(
                      `/student/cours/saved/${(data as GenerateCoursSuccessResponse).cours_id}`,
                    );
                  }}
                >
                  Voir le cours
                </AlertDialogAction>
                <AlertDialogCancel
                  onClick={() => {
                    setShowCourseChoiceModal(false);
                    setShowDeepeeningQuestions(true);
                  }}
                >
                  Approfondir
                </AlertDialogCancel>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
