import { MathText } from "@/components/ui/MathText";

interface AICourseRendererProps {
  course: any;
  getCourseData: (courseData: any) => any;
}

// Helper function to get course_data or cours_data
const getCourseData = (courseData: any) => {
  return (
    courseData?.content?.course_data ||
    courseData?.course_data ||
    courseData?.data?.course_data ||
    courseData?.content?.cours_data ||
    courseData?.cours_data ||
    courseData?.data?.cours_data
  );
};

export function AICourseRenderer({ course }: AICourseRendererProps) {
  const courseData = getCourseData(course);

  return (
    <div className="space-y-8">
      {/* Titre Principal */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 pb-3 w-fit mx-auto">
        Chapitre :{" "}
        {courseData?.["TITRE_DE_LA_LECON"] ||
          courseData?.["Titre de la leçon"] ||
          courseData?.["Titre de la lecon"]}
      </h1>

      {/* Introduction */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Introduction
        </h2>
        <div className="text-gray-700 leading-relaxed">
          <MathText text={courseData?.Introduction || ""} />
        </div>
      </div>

      {/* Développement du cours */}
      {courseData &&
        Object.keys(
          courseData["DEVELOPPEMENT_DU_COURS"] ||
            courseData["developpement du cours"] ||
            {},
        ).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">
              Développement du cours
            </h2>
            <div className="space-y-8">
              {Object.entries(
                (courseData["DEVELOPPEMENT_DU_COURS"] ||
                  courseData["developpement du cours"]) as Record<string, any>,
              ).map(([key, notion]: [string, any], index: number) => (
                <div key={key} className="pl-6 py-4">
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
                        <MathText text={notion.definition_et_cadrage} />
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
                              text={notion.explication_approfondie.theorie}
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
                              text={notion.explication_approfondie.analyse}
                            />
                          </div>
                        </div>
                      )}

                      {notion.explication_approfondie.liens_et_applications && (
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
                  {!notion.explication_approfondie && notion.explication && (
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
                                          <MathText text={exemple.contexte} />
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
                                            text={exemple.developpement}
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
                                  <div key={exKey} className="flex gap-3">
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
                  {notion.points_cles && notion.points_cles.length > 0 && (
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
                              <span className="flex-shrink-0">✓</span>
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
      {(courseData?.["SYNTHESE_DU_COURS"] ||
        courseData?.["Synthese ce qu'il faut retenir"]) && (
        <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-amber-900 mb-4">
            Synthèse du cours
          </h2>

          {/* Synthèse structurée */}
          {courseData?.["SYNTHESE_DU_COURS"] && (
            <div className="space-y-4">
              {courseData["SYNTHESE_DU_COURS"].recapitulatif && (
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Récapitulatif
                  </h3>
                  <div className="text-amber-950 leading-relaxed">
                    <MathText
                      text={courseData["SYNTHESE_DU_COURS"].recapitulatif}
                    />
                  </div>
                </div>
              )}

              {courseData["SYNTHESE_DU_COURS"].competences_acquises && (
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Compétences acquises
                  </h3>
                  <div className="text-amber-950 leading-relaxed">
                    <MathText
                      text={
                        courseData["SYNTHESE_DU_COURS"].competences_acquises
                      }
                    />
                  </div>
                </div>
              )}

              {courseData["SYNTHESE_DU_COURS"].points_de_vigilance && (
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Points de vigilance
                  </h3>
                  <div className="text-amber-950 leading-relaxed">
                    <MathText
                      text={courseData["SYNTHESE_DU_COURS"].points_de_vigilance}
                    />
                  </div>
                </div>
              )}

              {courseData["SYNTHESE_DU_COURS"].ouverture && (
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Ouverture
                  </h3>
                  <div className="text-amber-950 leading-relaxed">
                    <MathText
                      text={courseData["SYNTHESE_DU_COURS"].ouverture}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Synthèse simple (fallback) */}
          {!courseData?.["SYNTHESE_DU_COURS"] &&
            courseData?.["Synthese ce qu'il faut retenir"] && (
              <div className="text-amber-950 leading-relaxed">
                <MathText text={courseData["Synthese ce qu'il faut retenir"]} />
              </div>
            )}
        </div>
      )}
    </div>
  );
}
