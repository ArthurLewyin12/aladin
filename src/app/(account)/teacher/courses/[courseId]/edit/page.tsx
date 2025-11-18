"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { ArrowLeft, Save, Eye, FileText, AlertCircle } from "lucide-react";
import { Editor } from "@/components/blocks/editor-x/editor";
import { SerializedEditorState, LexicalEditor } from "lexical";
import { useCourse } from "@/services/hooks/professeur/useCourse";
import { useUpdateCourse } from "@/services/hooks/professeur/useUpdateCourse";
import { useCourseEditor } from "@/stores/useCourseEditor";
import { extractCourseContent } from "@/lib/lexical-utils";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useClasse } from "@/services/hooks/professeur/useClasse";
import { useChapitres } from "@/services/hooks/chapitre/useChapitres";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);

  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState<
    SerializedEditorState | undefined
  >(undefined);
  const editorRef = useRef<LexicalEditor | null>(null);

  // Fetch data
  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId);
  const { data: classeDetails, isLoading: isLoadingClasseDetails } = useClasse(
    course?.classe_id || null
  );
  // Pour l'instant, on récupère tous les chapitres (TODO: optimiser plus tard)
  const { data: chapitres, isLoading: isLoadingChapitres } = useChapitres(null);
  const { mutate: updateCourseMutation, isPending: isSaving } =
    useUpdateCourse();
  const { updateDraft, markAsSaved, hasUnsavedChanges } = useCourseEditor();

  // Initialize form with course data
  useEffect(() => {
    if (course) {
      console.log("🔍 Course data received:", course);
      console.log("📚 Course.classe:", course.classe);
      console.log("📖 Course.chapitre:", course.chapitre);
      console.log("📖 Course.chapitre?.matiere:", course.chapitre?.matiere);

      setTitle(course.titre);

      // Load editor state - essayer plusieurs formats si lexical_state est vide
      if (
        course.content?.lexical_state &&
        Object.keys(course.content.lexical_state).length > 0
      ) {
        setEditorState(course.content.lexical_state);
      } else {
        // Si pas de lexical_state valide, l'éditeur commencera vide
        // L'utilisateur devra rééditer le contenu
        setEditorState(undefined);
        console.warn(
          "Cours sans lexical_state valide - contenu devra être réédité",
        );
      }
    }
  }, [course]);

  // Track changes for autosave
  useEffect(() => {
    if (editorRef.current && title) {
      updateDraft({
        id: courseId,
        titre: title,
        chapitre_id: course?.chapitre_id || null,
        classe_id: course?.classe_id || null,
        lexical_state: editorState,
      });
    }
  }, [title, editorState, course]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (
        confirm(
          "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?",
        )
      ) {
        router.push("/teacher/courses");
      }
    } else {
      router.push("/teacher/courses");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        variant: "warning",
        message: "Le titre du cours est requis",
      });
      return;
    }

    if (!editorRef.current) {
      toast({
        variant: "error",
        message: "L'éditeur n'est pas encore prêt",
      });
      return;
    }

    try {
      // Extract complete content from Lexical editor
      const content = extractCourseContent(editorRef.current);

      // Update course via API - utiliser la classe du cours existant
      updateCourseMutation(
        {
          classeId: course?.classe_id!,
          coursId: courseId,
          payload: {
            titre: title,
            content,
          },
        },
        {
          onSuccess: () => {
            markAsSaved();
            router.push("/teacher/courses");
          },
        },
      );
    } catch (error) {
      console.error("Course update error:", error);
    }
  };

  const handlePreview = () => {
    router.push(`/teacher/courses/${courseId}/preview`);
  };

  if (isLoadingCourse || isLoadingClasseDetails || isLoadingChapitres) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cours introuvable ou accès non autorisé.
          </AlertDescription>
        </Alert>
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
              Éditer le cours
            </h1>
          </div>
        </div>

        {/* Course Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
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
                    className="mt-1"
                  />
                </div>

                {/* Informations en lecture seule pour l'édition */}
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Informations du cours existant
                  </h4>
                   <div className="space-y-1 text-sm text-gray-600">
                     <p><span className="font-medium">Classe :</span> {classeDetails?.nom || 'Chargement...'}</p>
                     <p><span className="font-medium">Chapitre :</span> {course?.chapitre?.libelle || 'Chargement...'}</p>
                     <p><span className="font-medium">Matière :</span> {course?.matiere?.libelle || 'Chargement...'}</p>
                   </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Ces informations ne peuvent pas être modifiées lors de
                    l'édition.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handlePreview}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isSaving ? (
                      <Spinner className="w-4 h-4 mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? "Mise à jour..." : "Mettre à jour"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Contenu du cours</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Afficher un avertissement si le contenu ne peut pas être pré-rempli */}
                {course && course.content && !course.content.lexical_state && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Le contenu de ce cours ne peut pas être pré-rempli
                      automatiquement. Veuillez rééditer le contenu dans
                      l'éditeur ci-dessous.
                      {course.content.plain_text && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Aperçu du contenu existant :</strong>
                          <br />
                          {course.content.plain_text.substring(0, 200)}
                          {course.content.plain_text.length > 200 && "..."}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

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
    </div>
  );
}
