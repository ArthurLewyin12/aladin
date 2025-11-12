"use client";
import { useMemo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOneCourse } from "@/services/hooks/cours/useGetOneCourse";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  MessageCircleQuestion,
  ChevronDown,
} from "lucide-react";
import { MathText } from "@/components/ui/MathText";
import { useTimeTracking } from "@/stores/useTimeTracking";
import { Spinner } from "@/components/ui/spinner";
import { TTSButton } from "@/components/ui/tts";
import { CourseStructuredData } from "@/services/controllers/types/common/cours.type";
// import { TTSDebug } from "@/components/debug/TTSDebug";

// Composant pour afficher une notion dépliable
const NotionCard = ({ notion, index }: { notion: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* En-tête de la notion */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base font-semibold text-orange-500">
              {index + 1}.
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
              {notion.titre}
            </h3>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Contenu dépliable */}
      {isOpen && (
        <div className="mt-2 space-y-3 border-t border-gray-200 pt-3">
          {/* Explication */}
          <div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <MathText text={notion.explication} />
            </p>
          </div>

          {/* Exemples */}
          {notion.exemples && Object.keys(notion.exemples).length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Exemples:
              </h4>
              <ul className="space-y-1">
                {Object.entries(notion.exemples).map(
                  ([key, exemple]: [string, any]) => {
                    const text =
                      typeof exemple === "string"
                        ? exemple
                        : exemple?.exemple || "";
                    return text ? (
                      <li key={key} className="flex gap-2 text-sm">
                        <span className="text-orange-500 font-bold flex-shrink-0">
                          •
                        </span>
                        <span className="text-gray-700">
                          <MathText text={text} />
                        </span>
                      </li>
                    ) : null;
                  },
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function SavedCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = parseInt(params.courseId as string);

  const { data, isLoading, isError, error } = useGetOneCourse(courseId);
  const { startTracking, stopTracking } = useTimeTracking();

  // Déterminer si c'est le nouveau format structuré
  const hasStructuredCourseData =
    data && typeof data === "object" && "course_data" in data;

  // Démarrer le tracking quand le cours est chargé
  useEffect(() => {
    if (!isLoading && data) {
      startTracking("revision", data.id, data.chapitre.id);
    }

    // Arrêter le tracking au démontage
    return () => {
      stopTracking();
    };
  }, [isLoading, data, startTracking, stopTracking]);

  const parsedContent = useMemo(() => {
    if (!data || !data.text || typeof data.text !== "string") return [];

    const romanNumeralRegex = /^([IVXLCDM]+)\.\s/;

    return data.text.split("\n").map((line, index) => {
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
    if (!data || !data.text || typeof data.text !== "string") return "";
    const conclusionIndex = data.text.indexOf("CONCLUSION");
    if (conclusionIndex !== -1) {
      return data.text.substring(conclusionIndex + "CONCLUSION".length).trim();
    }
    // Fallback: take first 3 non-title lines
    return parsedContent
      .filter((line) => line.type === "paragraph" && line.content.length > 20)
      .slice(0, 3)
      .map((line) => line.content)
      .join(" ");
  }, [data, parsedContent]);

  const handleBack = () => router.back();

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
  if (!isLoading && !data) {
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
            Récupération du contenu sauvegardé
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
          className="mt-2 sm:mt-4 w-full flex   items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
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
              Cours sauvegardé
            </h1>
          </div>
        </div>

        {/* Main Content */}
        {data && (
          <main className="w-full max-w-4xl mx-auto py-8 sm:py-12 space-y-6">
            {/* Vérifier si c'est le nouveau format structuré */}
            {hasStructuredCourseData ? (
              <>
                {/* NOUVEAU FORMAT STRUCTURÉ - Simple et épuré */}

                {/* Titre Principal avec underline */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-orange-500 w-fit mx-auto">
                  {data.course_data?.["TITRE_DE_LA_LECON"] ||
                    data.course_data?.["Titre de la leçon"] ||
                    data.course_data?.["Titre de la lecon"]}
                </h1>

                {/* Introduction */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Introduction
                  </h2>
                  <div className="text-gray-700 leading-relaxed">
                    <MathText text={data.course_data?.Introduction || ""} />
                  </div>
                </div>

                {/* Développement du cours */}
                {data.course_data &&
                  Object.keys(
                    data.course_data["DEVELOPPEMENT_DU_COURS"] ||
                      data.course_data["developpement du cours"] ||
                      {},
                  ).length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">
                        Développement du cours
                      </h2>
                      <div className="space-y-8">
                        {Object.entries(
                          (data.course_data["DEVELOPPEMENT_DU_COURS"] ||
                            data.course_data[
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
                {(data.course_data?.["SYNTHESE_DU_COURS"] ||
                  data.course_data?.["Synthese ce qu'il faut retenir"]) && (
                  <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-amber-900 mb-4">
                      Synthèse du cours
                    </h2>

                    {/* Synthèse structurée */}
                    {data.course_data?.["SYNTHESE_DU_COURS"] && (
                      <div className="space-y-4">
                        {data.course_data["SYNTHESE_DU_COURS"]
                          .recapitulatif && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Récapitulatif
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  data.course_data["SYNTHESE_DU_COURS"]
                                    .recapitulatif
                                }
                              />
                            </div>
                          </div>
                        )}

                        {data.course_data["SYNTHESE_DU_COURS"]
                          .competences_acquises && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Compétences acquises
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  data.course_data["SYNTHESE_DU_COURS"]
                                    .competences_acquises
                                }
                              />
                            </div>
                          </div>
                        )}

                        {data.course_data["SYNTHESE_DU_COURS"]
                          .points_de_vigilance && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Points de vigilance
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  data.course_data["SYNTHESE_DU_COURS"]
                                    .points_de_vigilance
                                }
                              />
                            </div>
                          </div>
                        )}

                        {data.course_data["SYNTHESE_DU_COURS"].ouverture && (
                          <div>
                            <h3 className="font-semibold text-amber-900 mb-2">
                              Ouverture
                            </h3>
                            <div className="text-amber-950 leading-relaxed">
                              <MathText
                                text={
                                  data.course_data["SYNTHESE_DU_COURS"]
                                    .ouverture
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Synthèse simple (fallback) */}
                    {!data.course_data?.["SYNTHESE_DU_COURS"] &&
                      data.course_data?.["Synthese ce qu'il faut retenir"] && (
                        <div className="text-amber-950 leading-relaxed">
                          <MathText
                            text={
                              data.course_data["Synthese ce qu'il faut retenir"]
                            }
                          />
                        </div>
                      )}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* ANCIEN FORMAT */}
                {/* Course Content Card */}
                <article className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-10 lg:p-14 mb-6">
                  <div
                    className={`
              prose prose-base sm:prose-base md:prose-lg lg:prose-lg max-w-none
              prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:text-orange-600
              prose-p:my-3 prose-p:leading-7 prose-p:text-gray-800
              prose-strong:text-orange-700 prose-strong:font-semibold
              prose-ul:my-4 prose-li:my-1
              prose-ol:my-4 prose-ol:list-decimal
            `}
                  >
                    {parsedContent.map((line) => (
                      <div key={line.id}>
                        {line.type === "title" ? (
                          <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mt-8 first:mt-0 mb-4">
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
                  </div>
                </article>

                {/* Key Takeaways Section */}
                {summary && (
                  <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500 rounded-xl">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-amber-900">
                        Points clés à retenir
                      </h2>
                    </div>
                    <MathText
                      text={summary}
                      className="text-base sm:text-lg text-amber-900 leading-relaxed"
                    />
                  </section>
                )}

                {/* FAQ Section - Ancien Format */}
                {!hasStructuredCourseData &&
                  data &&
                  data.questions &&
                  data.questions.length > 0 && (
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-500 rounded-xl">
                          <MessageCircleQuestion className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                          Questions d'approfondissements
                        </h2>
                      </div>
                      <div className="space-y-4">
                        {data.questions.map((qa, index) => (
                          <details
                            key={index}
                            className="group bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 p-5 rounded-2xl hover:border-orange-300 transition-all duration-200 open:bg-white open:border-orange-400 open:shadow-md"
                          >
                            <summary className="font-semibold text-base sm:text-lg cursor-pointer text-gray-900 flex items-start gap-3 list-none">
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
              </>
            )}

            {/* Questions Fréquentes pour le nouveau format */}
            {hasStructuredCourseData &&
              data &&
              data.questions &&
              data.questions.length > 0 && (
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
                    {data.questions.map((qa, index) => (
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
    </div>
  );
}
