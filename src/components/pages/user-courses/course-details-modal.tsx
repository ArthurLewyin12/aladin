import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Course } from "@/services/controllers/types/common/cours.type";
import { useRouter } from "next/navigation";

interface CourseDetailsModalProps {
  courseId: number | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  courseData?: Course; // Optional: if we want to pass the full course object
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  courseId,
  isOpen,
  onOpenChange,
  courseData,
}) => {
  const router = useRouter();

  // In a real application, you might fetch courseData here if not provided
  // For now, we'll assume courseData is passed or fetched elsewhere

  if (!courseData && courseId) {
    // This is a placeholder. In a real app, you'd fetch the course details here
    // For now, we'll just show a loading state or an error if courseData is missing
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chargement du cours...</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Veuillez patienter pendant le chargement des détails du cours.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  if (!courseData) {
    return null; // Don't render if no course data is available
  }

  const handleGoToDetailsPage = () => {
    //  router.push(`/student/courses/${courseData.id}`);
    onOpenChange(false); // Close modal after navigation
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {courseData.chapitre?.libelle || "Détails du cours"}
          </DialogTitle>
          <DialogDescription>Aperçu du cours et options.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="font-semibold mb-2">Aperçu du texte:</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {courseData.text_preview}
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleGoToDetailsPage}>
              Voir le cours complet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
