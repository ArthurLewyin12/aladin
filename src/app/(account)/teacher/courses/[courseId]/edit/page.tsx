"use client";

import { useState, useEffect } from "react";
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
import { SerializedEditorState } from "lexical";
import { useClasses } from "@/services/hooks/professeur/useClasses";
import { useCourse } from "@/services/hooks/professeur/useCourses";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);

  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [editorState, setEditorState] = useState<
    SerializedEditorState | undefined
  >();
  const [isSaving, setIsSaving] = useState(false);

  // Fetch data
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId);

  // Initialize form with course data
  useEffect(() => {
    if (course) {
      setTitle(course.titre);
      setSelectedClass(course.classe?.id.toString() || "");
      setSelectedChapter(course.chapitre?.id.toString() || "");

      // TODO: Load editor state from course.content.lexical_state
      if (course.content?.lexical_state) {
        setEditorState(course.content.lexical_state);
      }
    }
  }, [course]);

  const handleBack = () => {
    router.push("/teacher/courses");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        variant: "warning",
        message: "Le titre du cours est requis",
      });
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement course update API call
      console.log("Updating course:", {
        id: courseId,
        title,
        classe_id: selectedClass,
        chapitre_id: selectedChapter,
        content: JSON.stringify(editorState),
      });

      toast({
        variant: "success",
        message: "Cours mis à jour avec succès !",
      });

      router.push("/teacher/courses");
    } catch (error) {
      toast({
        variant: "error",
        message: "Erreur lors de la mise à jour du cours",
      });
      console.error("Course update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    router.push(`/teacher/courses/${courseId}/preview`);
  };

  if (isLoadingClasses || isLoadingCourse) {
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

                <div>
                  <Label htmlFor="class">Classe *</Label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="mt-1">
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

                <div>
                  <Label htmlFor="chapter">Chapitre *</Label>
                  <Select
                    value={selectedChapter}
                    onValueChange={setSelectedChapter}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner un chapitre" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Load chapters based on selected class/subject */}
                      <SelectItem value="45">Chapitre: Dérivées</SelectItem>
                      <SelectItem value="46">
                        Chapitre: Applications des dérivées
                      </SelectItem>
                      <SelectItem value="67">Chapitre: Mécanique</SelectItem>
                    </SelectContent>
                  </Select>
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
                <div className="min-h-[600px]">
                  <Editor
                    editorSerializedState={editorState}
                    onSerializedChange={(value) => setEditorState(value)}
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
