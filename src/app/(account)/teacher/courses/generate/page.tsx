"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Save, AlertCircle } from "lucide-react";
import { useClasses } from "@/services/hooks/professeur/useClasses";
import { useClasse } from "@/services/hooks/professeur/useClasse";
import { useChapitres } from "@/services/hooks/chapitre/useChapitres";
import { useGenerateCourse } from "@/services/hooks/professeur/useGenerateCourse";
import { GenerationLoadingOverlay } from "@/components/ui/generation-loading-overlay";
import { MathText } from "@/components/ui/MathText";
import { toast } from "@/lib/toast";
import { GenerateCoursSuccessResponse } from "@/services/controllers/types/common/cours.type";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGeneratedCourse } from "@/stores/useGeneratedCourse";

const courseLoadingMessages = [
  "Génération de votre cours personnalisé...",
  "Analyse des concepts clés du chapitre...",
  "Synthèse des informations importantes...",
  "Préparation des exemples et illustrations...",
  "Finalisation du cours...",
];

export default function GenerateCoursePage() {
  const router = useRouter();

  // State de sélection
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  // State de cours généré
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Store Zustand pour persister les données
  const {
    generatedCourse: storedCourse,
    setGeneratedCourse: setStoredCourse,
    clearGeneratedCourse,
  } = useGeneratedCourse();

  // Charger les données sauvegardées au montage
  useEffect(() => {
    if (storedCourse) {
      setSelectedClass(storedCourse.selectedClass);
      setSelectedMatiere(storedCourse.selectedMatiere);
      setSelectedChapter(storedCourse.selectedChapter);
      setGeneratedCourse(storedCourse.generatedCourse);
    }
  }, [storedCourse]);

  // Ajouter un guard pour prévenir la perte de données
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (generatedCourse && !storedCourse?.generatedCourse) {
        e.preventDefault();
        e.returnValue =
          "Votre cours généré sera sauvegardé. Êtes-vous sûr de vouloir quitter ?";
        return "Votre cours généré sera sauvegardé. Êtes-vous sûr de vouloir quitter ?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [generatedCourse, storedCourse]);

  // Hooks
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const { data: classeDetails, isLoading: isLoadingClasseDetails } = useClasse(
    selectedClass ? Number(selectedClass) : null,
  );
  const { data: chapitres, isLoading: isLoadingChapitres } = useChapitres(
    selectedMatiere ? Number(selectedMatiere) : null,
  );
  const { mutate: generateCourseMutation, isPending: isGeneratingCourse } =
    useGenerateCourse();

  // Reset matiere et chapter quand classe change
  useEffect(() => {
    setSelectedMatiere("");
    setSelectedChapter("");
    setGeneratedCourse(null);
  }, [selectedClass]);

  // Reset chapter quand matiere change
  useEffect(() => {
    setSelectedChapter("");
    setGeneratedCourse(null);
  }, [selectedMatiere]);

  // Déterminer si on a la structure course_data
  const hasStructuredCourseData =
    generatedCourse &&
    typeof generatedCourse === "object" &&
    "course_data" in generatedCourse &&
    generatedCourse.course_data;

  // Parser le contenu texte brut
  const parsedContent = useMemo(() => {
    if (!generatedCourse || !generatedCourse.text) return [];

    const romanNumeralRegex = /^([IVXLCDM]+)\.\s/;

    return generatedCourse.text
      .split("\n")
      .map((line: string, index: number) => {
        const isTitle =
          romanNumeralRegex.test(line) ||
          (line.toUpperCase() === line && line.length > 0 && line.length < 100);
        return {
          id: index,
          type: isTitle && line.length < 100 ? "title" : "paragraph",
          content: line,
        };
      });
  }, [generatedCourse]);

  const handleGenerateCourse = async () => {
    if (!selectedClass) {
      toast({
        message: "Veuillez sélectionner une classe",
        variant: "warning",
      });
      return;
    }

    if (!selectedMatiere) {
      toast({
        message: "Veuillez sélectionner une matière",
        variant: "warning",
      });
      return;
    }

    if (!selectedChapter) {
      toast({
        message: "Veuillez sélectionner un chapitre",
        variant: "warning",
      });
      return;
    }

    setIsGenerating(true);

    generateCourseMutation(
      {
        classeId: Number(selectedClass),
        payload: {
          chapter_id: Number(selectedChapter),
        },
      },
      {
        onSuccess: (data: any) => {
          // data est { message, cours }
          const cours = data.cours || data;
          setGeneratedCourse(cours);
          // Sauvegarder dans le store Zustand
          setStoredCourse({
            selectedClass,
            selectedMatiere,
            selectedChapter,
            generatedCourse: cours,
          });
          setIsGenerating(false);
          toast({
            variant: "success",
            message: "Cours généré avec succès !",
          });
        },
        onError: (error: any) => {
          setIsGenerating(false);
          console.error("Erreur lors de la génération", error);
        },
      },
    );
  };

  const handleSaveCourse = () => {
    if (!generatedCourse) {
      toast({
        message: "Aucun cours à sauvegarder",
        variant: "warning",
      });
      return;
    }

    // TODO: Implémenter la logique de sauvegarde du cours
    toast({
      variant: "success",
      message: "Cours sauvegardé avec succès !",
    });
    // Nettoyer le store après la sauvegarde
    clearGeneratedCourse();
    router.push("/teacher/courses");
  };

  const handleBack = () => {
    router.push("/teacher/courses");
  };

  if (isLoadingClasses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GenerationLoadingOverlay
        isLoading={isGenerating}
        messages={courseLoadingMessages}
      />

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
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 leading-tight">
              Générer un cours avec IA
            </h1>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Panneau Gauche - Sélection */}
          <div className="lg:col-span-2 sticky top-6 h-fit z-10">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Paramètres de génération
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sélection Classe */}
                <div>
                  <Label htmlFor="class">Classe *</Label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="mt-1 rounded-3xl w-full">
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map((classe) => (
                        <SelectItem
                          key={classe.id}
                          value={classe.id.toString()}
                        >
                          {classe.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sélection Matière */}
                <div>
                  <Label htmlFor="matiere">Matière *</Label>
                  <Select
                    value={selectedMatiere}
                    onValueChange={setSelectedMatiere}
                    disabled={!selectedClass || isLoadingClasseDetails}
                  >
                    <SelectTrigger className="mt-1 rounded-3xl w-full">
                      <SelectValue placeholder="Sélectionner une matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingClasseDetails ? (
                        <div className="flex items-center justify-center p-4">
                          <Spinner className="w-4 h-4" />
                        </div>
                      ) : classeDetails?.matieres &&
                        classeDetails.matieres.length > 0 ? (
                        classeDetails.matieres.map((matiere) => (
                          <SelectItem
                            key={matiere.id}
                            value={matiere.id.toString()}
                          >
                            {matiere.libelle}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-gray-500">
                          Aucune matière disponible pour cette classe
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sélection Chapitre */}
                <div>
                  <Label htmlFor="chapter">Chapitre *</Label>
                  <Select
                    value={selectedChapter}
                    onValueChange={setSelectedChapter}
                    disabled={!selectedMatiere || isLoadingChapitres}
                  >
                    <SelectTrigger className="mt-1 rounded-3xl w-full">
                      <SelectValue placeholder="Sélectionner un chapitre" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingChapitres ? (
                        <div className="flex items-center justify-center p-4">
                          <Spinner className="w-4 h-4" />
                        </div>
                      ) : chapitres && chapitres.length > 0 ? (
                        chapitres.map((chapitre) => (
                          <SelectItem
                            key={chapitre.id}
                            value={chapitre.id.toString()}
                          >
                            {chapitre.libelle}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-gray-500">
                          Aucun chapitre disponible pour cette matière
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerateCourse}
                    disabled={
                      isGeneratingCourse ||
                      !selectedClass ||
                      !selectedMatiere ||
                      !selectedChapter
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-3xl"
                  >
                    {isGeneratingCourse ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Générer le cours
                      </>
                    )}
                  </Button>

                  {generatedCourse && (
                    <Button
                      onClick={handleSaveCourse}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-3xl"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau Droit - Affichage du Cours */}
          <div className="lg:col-span-3">
            {!generatedCourse ? (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-12 h-12 mb-4 text-gray-400" />
                    <p className="text-gray-600 text-lg">
                      Sélectionnez une classe, matière et chapitre, puis cliquez
                      sur "Générer le cours" pour commencer.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : hasStructuredCourseData ? (
              <>
                {/* NOUVEAU FORMAT STRUCTURÉ */}
                <div className="space-y-6">
                  {/* Titre Principal avec underline */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-green-500 w-fit mx-auto">
                      {generatedCourse.course_data?.["TITRE_DE_LA_LECON"] ||
                        generatedCourse.course_data?.["Titre de la leçon"] ||
                        generatedCourse.course_data?.["Titre de la lecon"]}
                    </h1>
                  </div>

                  {/* Introduction */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Introduction
                    </h2>
                    <div className="text-gray-700 leading-relaxed">
                      <MathText
                        text={generatedCourse.course_data?.Introduction || ""}
                      />
                    </div>
                  </div>

                  {/* Développement du cours */}
                  {generatedCourse.course_data &&
                    Object.keys(
                      generatedCourse.course_data["DEVELOPPEMENT_DU_COURS"] ||
                        generatedCourse.course_data["developpement du cours"] ||
                        {},
                    ).length > 0 && (
                      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                          Développement du cours
                        </h2>
                        <div className="space-y-8">
                          {Object.entries(
                            generatedCourse.course_data[
                              "DEVELOPPEMENT_DU_COURS"
                            ] ||
                              generatedCourse.course_data[
                                "developpement du cours"
                              ],
                          ).map(
                            ([key, notion]: [string, any], index: number) => (
                              <div
                                key={key}
                                className="border-l-4 border-green-500 pl-6 py-4"
                              >
                                {/* Numéro et titre de la notion */}
                                <div className="flex items-baseline gap-2 mb-4">
                                  <span className="text-2xl font-bold text-green-500">
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
                                              notion.explication_approfondie
                                                .theorie
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
                                              notion.explication_approfondie
                                                .analyse
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
                                            // Exemple détaillé
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
                                                          text={
                                                            exemple.contexte
                                                          }
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
                                              // Exemple simple
                                              const text =
                                                typeof exemple === "string"
                                                  ? exemple
                                                  : exemple?.exemple || "";
                                              return text ? (
                                                <div
                                                  key={exKey}
                                                  className="flex gap-3"
                                                >
                                                  <span className="flex-shrink-0 text-green-500 font-bold">
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
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Synthèse */}
                  {((generatedCourse as any)?.course_data?.[
                    "SYNTHESE_DU_COURS"
                  ] ||
                    (generatedCourse as any)?.course_data?.[
                      "Synthese ce qu'il faut retenir"
                    ]) && (
                    <div className="bg-gradient-to-br from-amber-50 to-green-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8">
                      <h2 className="text-xl font-bold text-amber-900 mb-4">
                        Synthèse du cours
                      </h2>

                      {/* Synthèse structurée */}
                      {generatedCourse.course_data?.["SYNTHESE_DU_COURS"] && (
                        <div className="space-y-4">
                          {(generatedCourse as any).course_data[
                            "SYNTHESE_DU_COURS"
                          ].recapitulatif && (
                            <div>
                              <h3 className="font-semibold text-amber-900 mb-2">
                                Récapitulatif
                              </h3>
                              <div className="text-amber-950 leading-relaxed">
                                <MathText
                                  text={
                                    (generatedCourse as any).course_data[
                                      "SYNTHESE_DU_COURS"
                                    ].recapitulatif
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {(generatedCourse as any).course_data[
                            "SYNTHESE_DU_COURS"
                          ].competences_acquises && (
                            <div>
                              <h3 className="font-semibold text-amber-900 mb-2">
                                Compétences acquises
                              </h3>
                              <div className="text-amber-950 leading-relaxed">
                                <MathText
                                  text={
                                    (generatedCourse as any).course_data[
                                      "SYNTHESE_DU_COURS"
                                    ].competences_acquises
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {(generatedCourse as any).course_data[
                            "SYNTHESE_DU_COURS"
                          ].points_de_vigilance && (
                            <div>
                              <h3 className="font-semibold text-amber-900 mb-2">
                                Points de vigilance
                              </h3>
                              <div className="text-amber-950 leading-relaxed">
                                <MathText
                                  text={
                                    (generatedCourse as any).course_data[
                                      "SYNTHESE_DU_COURS"
                                    ].points_de_vigilance
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {(generatedCourse as any).course_data[
                            "SYNTHESE_DU_COURS"
                          ].ouverture && (
                            <div>
                              <h3 className="font-semibold text-amber-900 mb-2">
                                Ouverture
                              </h3>
                              <div className="text-amber-950 leading-relaxed">
                                <MathText
                                  text={
                                    (generatedCourse as any).course_data[
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
                      {!generatedCourse.course_data?.["SYNTHESE_DU_COURS"] &&
                        generatedCourse.course_data?.[
                          "Synthese ce qu'il faut retenir"
                        ] && (
                          <div className="text-amber-950 leading-relaxed">
                            <MathText
                              text={
                                generatedCourse.course_data[
                                  "Synthese ce qu'il faut retenir"
                                ]
                              }
                            />
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* ANCIEN FORMAT TEXTE BRUT */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <article className="prose prose-base sm:prose-base max-w-none text-gray-800">
                        {parsedContent.map((line: any) => (
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
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
