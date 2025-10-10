import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Course } from "@/services/controllers/types/common/cours.type";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/services/hooks/use-media-query"; // Import the hook

interface CourseDetailsResponsiveDialogProps {
  courseId: number | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  courseData?: Course; // Optional: if we want to pass the full course object
}

export const CourseDetailsResponsiveDialog: React.FC<
  CourseDetailsResponsiveDialogProps
> = ({ courseId, isOpen, onOpenChange, courseData }) => {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)"); // Tailwind's 'md' breakpoint

  if (!courseData && courseId) {
    // Placeholder for loading state if courseData is not provided
    const Content = isDesktop ? DialogContent : DrawerContent;
    const Header = isDesktop ? DialogHeader : DrawerHeader;
    const Title = isDesktop ? DialogTitle : DrawerTitle;
    const Description = isDesktop ? DialogDescription : DrawerDescription;

    return (
      <Wrapper
        isDesktop={isDesktop}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <Header>
          <Title>Chargement du cours...</Title>
          <Description>
            Veuillez patienter pendant le chargement des détails du cours.
          </Description>
        </Header>
      </Wrapper>
    );
  }

  if (!courseData) {
    return null; // Don't render if no course data is available
  }

  const handleGoToDetailsPage = () => {
    router.push(`/student/courses/${courseData.id}`);
    onOpenChange(false); // Close modal/drawer after navigation
  };

  const CommonContent = (
    <div className="py-4">
      <h4 className="font-semibold mb-2">Aperçu du texte:</h4>
      <p className="text-sm text-gray-700 whitespace-pre-wrap">
        {courseData.text_preview}
      </p>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleGoToDetailsPage}>Voir le cours complet</Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {courseData.chapitre?.libelle || "Détails du cours"}
            </DialogTitle>
            <DialogDescription>Aperçu du cours et options.</DialogDescription>
          </DialogHeader>
          {CommonContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {courseData.chapitre?.libelle || "Détails du cours"}
          </DrawerTitle>
          <DrawerDescription>Aperçu du cours et options.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">{CommonContent}</div>
      </DrawerContent>
    </Drawer>
  );
};

// Helper Wrapper component to avoid repetition for loading state
const Wrapper: React.FC<{
  isDesktop: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
}> = ({ isDesktop, isOpen, onOpenChange, children }) => {
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
};
