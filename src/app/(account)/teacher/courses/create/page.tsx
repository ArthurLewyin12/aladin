"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye, FileText } from "lucide-react";
import { Editor } from "@/components/blocks/editor-x/editor";
import { SerializedEditorState, LexicalEditor } from "lexical";
import { useClasses } from "@/services/hooks/professeur/useClasses";
import { useSubjects } from "@/services/hooks/professeur/useSubjects";
import { useCreateManualCourse } from "@/services/hooks/professeur/useCreateManualCourse";
import { useActivateCourse } from "@/services/hooks/professeur/useActivateCourse";
import { useCourseEditor } from "@/stores/useCourseEditor";
import { extractCourseContent } from "@/lib/lexical-utils";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";
import { useClasse } from "@/services/hooks/professeur/useClasse";
import { useChapitres } from "@/services/hooks/chapitre/useChapitres";
import { CoursePreviewModal } from "@/components/pages/teacher-courses/course-preview-modal";
import { CourseContent } from "@/services/controllers/types/common/professeur.types";
import { Share } from "lucide-react";

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Commencez à rédiger votre cours ici...",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<CourseContent | null>(
    null,
  );
  const editorRef = useRef<LexicalEditor | null>(null);

  // Hooks
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const { data: classeDetails, isLoading: isLoadingClasseDetails } = useClasse(
    selectedClass ? Number(selectedClass) : null,
  );
  const { data: chapitres, isLoading: isLoadingChapitres } = useChapitres(
    selectedMatiere ? Number(selectedMatiere) : null,
  );
  const { mutate: createCourseMutation, isPending: isSaving } =
    useCreateManualCourse();
  const { mutate: activateCourseMutation, isPending: isActivatingCourse } =
    useActivateCourse();
  const { updateDraft, clearDraft, hasUnsavedChanges } = useCourseEditor();

  // Reset matiere and chapter when class changes
  useEffect(() => {
    setSelectedMatiere("");
    setSelectedChapter("");
  }, [selectedClass]);

  // Reset chapter when matiere changes
  useEffect(() => {
    setSelectedChapter("");
  }, [selectedMatiere]);

  // Track changes for draft
  useEffect(() => {
    if (title || selectedClass || selectedChapter) {
      updateDraft({
        titre: title,
        chapitre_id: selectedChapter ? Number(selectedChapter) : null,
        classe_id: selectedClass ? Number(selectedClass) : null,
        lexical_state: editorState,
      });
    }
  }, [title, selectedClass, selectedChapter, editorState]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (
        confirm(
          "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?",
        )
      ) {
        clearDraft();
        router.push("/teacher/courses");
      }
    } else {
      router.push("/teacher/courses");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ message: "Le titre du cours est requis", variant: "warning" });
      return;
    }
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

    if (!editorRef.current) {
      toast({ message: "L'éditeur n'est pas encore prêt", variant: "error" });
      return;
    }

    try {
      // Extract complete content from Lexical editor
      const content = extractCourseContent(editorRef.current);

      // Create course via API
      createCourseMutation(
        {
          classeId: Number(selectedClass),
          payload: {
            titre: title,
            chapitre_id: Number(selectedChapter),
            content,
          },
        },
        {
          onSuccess: () => {
            clearDraft();
            router.push("/teacher/courses");
          },
        },
      );
    } catch (error) {
      console.error("Course creation error:", error);
    }
  };

  const handlePreview = () => {
    if (!editorRef.current) {
      toast({ message: "L'éditeur n'est pas encore prêt", variant: "error" });
      return;
    }

    // Extract content and show preview modal
    const content = extractCourseContent(editorRef.current);
    setPreviewContent(content);
    setPreviewModalOpen(true);
  };

  const handleShareCourse = async () => {
    // Même validation que handleSave
    if (!title.trim()) {
      toast({ message: "Le titre du cours est requis", variant: "warning" });
      return;
    }
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

    if (!editorRef.current) {
      toast({ message: "L'éditeur n'est pas encore prêt", variant: "error" });
      return;
    }

    try {
      // Extract complete content from Lexical editor
      const content = extractCourseContent(editorRef.current);

      // Create course and activate it immediately
      createCourseMutation(
        {
          classeId: Number(selectedClass),
          payload: {
            titre: title,
            chapitre_id: Number(selectedChapter),
            content,
          },
        },
        {
          onSuccess: (data) => {
            // Une fois le cours créé, l'activer immédiatement
            if (data?.cours?.id) {
              activateCourseMutation(
                {
                  classeId: Number(selectedClass),
                  coursId: data.cours.id,
                },
                {
                  onSuccess: () => {
                    clearDraft();
                    router.push("/teacher/courses");
                  },
                },
              );
            } else {
              clearDraft();
              router.push("/teacher/courses");
            }
          },
        },
      );
    } catch (error) {
      console.error("Course creation error:", error);
    }
  };

  if (isLoadingClasses || isLoadingSubjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
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
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 leading-tight">
              Créer un cours manuel
            </h1>
          </div>
        </div>

        {/* Course Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-1 space-y-6 ">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informations du cours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre du cours *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Introduction aux dérivées"
                    className="mt-1 w-full rounded-3xl"
                  />
                </div>

                <div>
                  <Label htmlFor="class">Classe *</Label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="mt-1 rounded-3xl w-full">
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl">
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
                    <SelectContent className="rounded-3xl">
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

                <div>
                  <Label htmlFor="chapter">Chapitre *</Label>
                  <Select
                    value={selectedChapter}
                    onValueChange={setSelectedChapter}
                    disabled={!selectedMatiere || isLoadingChapitres}
                  >
                    <SelectTrigger className="mt-1 w-full rounded-3xl">
                      <SelectValue placeholder="Sélectionner un chapitre" />
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl">
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
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="rounded-3xl">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handlePreview}
                    variant="outline"
                    className="w-full rounded-3xl"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-green-600 hover:bg-green-700 rounded-3xl"
                  >
                    {isSaving ? (
                      <Spinner className="w-4 h-4 mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? "Enregistrement..." : "Enregistrer le cours"}
                  </Button>
                  <Button
                    onClick={handleShareCourse}
                    disabled={isSaving || isActivatingCourse}
                    className="w-full rounded-3xl bg-green-800 hover:bg-green-900"
                  >
                    {isSaving || isActivatingCourse ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        {isSaving ? "Création..." : "Activation..."}
                      </>
                    ) : (
                      <>
                        <Share className="w-4 h-4 mr-2" />
                        Partager
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor Panel */}
          <div className="lg:col-span-2">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Contenu du cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[600px]">
                  <Editor
                    editorSerializedState={editorState}
                    onSerializedChange={(value) => setEditorState(value)}
                    onEditorReady={(editor) => {
                      editorRef.current = editor;
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <CoursePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={title || "Sans titre"}
        content={previewContent}
      />
    </div>
  );
}
