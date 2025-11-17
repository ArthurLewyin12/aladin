"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourse } from "@/services/hooks/professeur/useCourse";
import { useUpdateCourseIA } from "@/services/hooks/professeur/useUpdateCourseIA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, Trash2, Eye } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NotionData {
  titre: string;
  definition_et_cadrage: string;
  explication_approfondie: {
    theorie: string;
    analyse: string;
    liens_et_applications: string;
  };
  exemples: {
    [key: string]: {
      titre: string;
      contexte: string;
      developpement: string;
    };
  };
  points_cles: string[];
}

interface SyntheseData {
  recapitulatif: string;
  competences_acquises: string;
  points_de_vigilance: string;
  ouverture: string;
}

interface Question {
  question: string;
  reponse: string;
}

export default function EditCourseIAPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.courseId as string);

  const { data: course, isLoading, isError } = useCourse(courseId);
  const { mutate: updateCourseIA, isPending: isSaving } = useUpdateCourseIA();

  // États pour les différentes sections
  const [titreDeLaLecon, setTitreDeLaLecon] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [notions, setNotions] = useState<{ [key: string]: NotionData }>({});
  const [synthese, setSynthese] = useState<SyntheseData>({
    recapitulatif: "",
    competences_acquises: "",
    points_de_vigilance: "",
    ouverture: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  // Helper function to get course_data
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

  // Charger les données du cours
  useEffect(() => {
    if (course) {
      const courseData = getCourseData(course);
      if (courseData) {
        setTitreDeLaLecon(
          courseData.TITRE_DE_LA_LECON ||
            courseData["Titre de la leçon"] ||
            ""
        );
        setIntroduction(courseData.Introduction || "");

        // Charger les notions
        const developpement =
          courseData.DEVELOPPEMENT_DU_COURS ||
          courseData["developpement du cours"] ||
          {};
        setNotions(developpement);

        // Charger la synthèse
        const syntheseData = courseData.SYNTHESE_DU_COURS || {};
        setSynthese({
          recapitulatif: syntheseData.recapitulatif || "",
          competences_acquises: syntheseData.competences_acquises || "",
          points_de_vigilance: syntheseData.points_de_vigilance || "",
          ouverture: syntheseData.ouverture || "",
        });

        // Charger les questions
        const questionsData = course.content?.questions || course.questions || [];
        setQuestions(questionsData);
      }
    }
  }, [course]);

  const handleBack = () => router.back();

  const handlePreview = () => {
    router.push(`/teacher/courses/${courseId}/preview-ia`);
  };

  const handleSave = () => {
    // Payload pour cours IA - format structuré
    const payload = {
      titre: titreDeLaLecon,
      content: {
        structured: true,
        course_data: {
          TITRE_DE_LA_LECON: titreDeLaLecon,
          Introduction: introduction,
          DEVELOPPEMENT_DU_COURS: notions,
          SYNTHESE_DU_COURS: synthese,
        },
      },
      questions: questions,
    };

    updateCourseIA(
      {
        courseId,
        classeId: course?.classe_id || 0,
        payload,
      },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            message: "Cours mis à jour avec succès !",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            message: error.message || "Erreur lors de la mise à jour",
          });
        },
      }
    );
  };

  const addNotion = () => {
    const notionKey = `Notion_${Object.keys(notions).length + 1}`;
    setNotions({
      ...notions,
      [notionKey]: {
        titre: "",
        definition_et_cadrage: "",
        explication_approfondie: {
          theorie: "",
          analyse: "",
          liens_et_applications: "",
        },
        exemples: {
          exemple_1: {
            titre: "",
            contexte: "",
            developpement: "",
          },
        },
        points_cles: [],
      },
    });
  };

  const removeNotion = (notionKey: string) => {
    const newNotions = { ...notions };
    delete newNotions[notionKey];
    setNotions(newNotions);
  };

  const updateNotion = (notionKey: string, field: string, value: any) => {
    setNotions({
      ...notions,
      [notionKey]: {
        ...notions[notionKey],
        [field]: value,
      },
    });
  };

  const addPointCle = (notionKey: string) => {
    const notion = notions[notionKey];
    setNotions({
      ...notions,
      [notionKey]: {
        ...notion,
        points_cles: [...(notion.points_cles || []), ""],
      },
    });
  };

  const updatePointCle = (notionKey: string, index: number, value: string) => {
    const notion = notions[notionKey];
    const newPointsCles = [...(notion.points_cles || [])];
    newPointsCles[index] = value;
    setNotions({
      ...notions,
      [notionKey]: {
        ...notion,
        points_cles: newPointsCles,
      },
    });
  };

  const removePointCle = (notionKey: string, index: number) => {
    const notion = notions[notionKey];
    const newPointsCles = (notion.points_cles || []).filter((_, i) => i !== index);
    setNotions({
      ...notions,
      [notionKey]: {
        ...notion,
        points_cles: newPointsCles,
      },
    });
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", reponse: "" }]);
  };

  const updateQuestion = (index: number, field: "question" | "reponse", value: string) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold text-red-600">
            Erreur lors du chargement du cours
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">
                Éditer le cours IA
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {course?.matiere?.libelle} - {course?.chapitre?.libelle}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handlePreview}
              variant="outline"
              className="rounded-xl border-2"
            >
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
            >
              {isSaving ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Formulaire d'édition */}
        <div className="space-y-6">
          {/* Titre de la leçon */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
            <Label htmlFor="titre" className="text-lg font-semibold text-gray-900 mb-2 block">
              Titre de la leçon
            </Label>
            <Input
              id="titre"
              value={titreDeLaLecon}
              onChange={(e) => setTitreDeLaLecon(e.target.value)}
              placeholder="Ex: Mouvement du centre d'inertie d'un solide"
              className="text-lg font-medium"
            />
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
            <Label htmlFor="introduction" className="text-lg font-semibold text-gray-900 mb-2 block">
              Introduction
            </Label>
            <Textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="Introduction du cours..."
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Développement du cours - Notions */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Développement du cours</h2>
              <Button
                onClick={addNotion}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une notion
              </Button>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {Object.entries(notions).map(([notionKey, notion], index) => (
                <AccordionItem
                  key={notionKey}
                  value={notionKey}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl font-bold text-orange-500">{index + 1}.</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {notion.titre || `Notion ${index + 1}`}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 space-y-4">
                    {/* Titre */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Titre de la notion
                      </Label>
                      <Input
                        value={notion.titre}
                        onChange={(e) => updateNotion(notionKey, "titre", e.target.value)}
                        placeholder="Ex: Référentiel galiléen"
                      />
                    </div>

                    {/* Définition et cadrage */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Définition et cadrage
                      </Label>
                      <Textarea
                        value={notion.definition_et_cadrage}
                        onChange={(e) =>
                          updateNotion(notionKey, "definition_et_cadrage", e.target.value)
                        }
                        placeholder="Définition..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    {/* Explication approfondie */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-900">
                        Explication approfondie
                      </Label>

                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">Théorie</Label>
                        <Textarea
                          value={notion.explication_approfondie?.theorie || ""}
                          onChange={(e) =>
                            updateNotion(notionKey, "explication_approfondie", {
                              ...notion.explication_approfondie,
                              theorie: e.target.value,
                            })
                          }
                          placeholder="Théorie..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">Analyse</Label>
                        <Textarea
                          value={notion.explication_approfondie?.analyse || ""}
                          onChange={(e) =>
                            updateNotion(notionKey, "explication_approfondie", {
                              ...notion.explication_approfondie,
                              analyse: e.target.value,
                            })
                          }
                          placeholder="Analyse..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">
                          Liens et applications
                        </Label>
                        <Textarea
                          value={notion.explication_approfondie?.liens_et_applications || ""}
                          onChange={(e) =>
                            updateNotion(notionKey, "explication_approfondie", {
                              ...notion.explication_approfondie,
                              liens_et_applications: e.target.value,
                            })
                          }
                          placeholder="Liens et applications..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>

                    {/* Points clés */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium text-gray-700">Points clés</Label>
                        <Button
                          onClick={() => addPointCle(notionKey)}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(notion.points_cles || []).map((point, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={point}
                              onChange={(e) => updatePointCle(notionKey, idx, e.target.value)}
                              placeholder={`Point clé ${idx + 1}`}
                              className="flex-1"
                            />
                            <Button
                              onClick={() => removePointCle(notionKey, idx)}
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bouton supprimer notion */}
                    <Button
                      onClick={() => removeNotion(notionKey)}
                      variant="destructive"
                      size="sm"
                      className="w-full mt-4"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer cette notion
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Synthèse du cours */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Synthèse du cours</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-amber-900 mb-1 block">
                  Récapitulatif
                </Label>
                <Textarea
                  value={synthese.recapitulatif}
                  onChange={(e) =>
                    setSynthese({ ...synthese, recapitulatif: e.target.value })
                  }
                  placeholder="Récapitulatif du cours..."
                  rows={4}
                  className="resize-none bg-white"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-amber-900 mb-1 block">
                  Compétences acquises
                </Label>
                <Textarea
                  value={synthese.competences_acquises}
                  onChange={(e) =>
                    setSynthese({ ...synthese, competences_acquises: e.target.value })
                  }
                  placeholder="Compétences acquises..."
                  rows={3}
                  className="resize-none bg-white"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-amber-900 mb-1 block">
                  Points de vigilance
                </Label>
                <Textarea
                  value={synthese.points_de_vigilance}
                  onChange={(e) =>
                    setSynthese({ ...synthese, points_de_vigilance: e.target.value })
                  }
                  placeholder="Points de vigilance..."
                  rows={3}
                  className="resize-none bg-white"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-amber-900 mb-1 block">
                  Ouverture
                </Label>
                <Textarea
                  value={synthese.ouverture}
                  onChange={(e) =>
                    setSynthese({ ...synthese, ouverture: e.target.value })
                  }
                  placeholder="Ouverture..."
                  rows={3}
                  className="resize-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* Questions d'approfondissement */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Questions d'approfondissement
              </h2>
              <Button
                onClick={addQuestion}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une question
              </Button>
            </div>

            <div className="space-y-4">
              {questions.map((qa, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Question {index + 1}</span>
                    <Button
                      onClick={() => removeQuestion(index)}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Question</Label>
                    <Textarea
                      value={qa.question}
                      onChange={(e) => updateQuestion(index, "question", e.target.value)}
                      placeholder="Votre question..."
                      rows={2}
                      className="resize-none bg-white"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Réponse</Label>
                    <Textarea
                      value={qa.reponse}
                      onChange={(e) => updateQuestion(index, "reponse", e.target.value)}
                      placeholder="La réponse..."
                      rows={4}
                      className="resize-none bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde flottant */}
        <div className="fixed bottom-8 right-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-2xl h-14 px-8"
          >
            {isSaving ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}
