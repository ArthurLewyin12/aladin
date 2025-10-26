"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { AddNoteForm } from "./add-note-form";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddNoteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddNoteModal({ isOpen, onOpenChange }: AddNoteModalProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Sur mobile, rediriger vers la page dédiée
  useEffect(() => {
    if (isOpen && !isDesktop) {
      onOpenChange(false);
      router.push("/student/notes/add");
    }
  }, [isOpen, isDesktop, router, onOpenChange]);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  // Sur mobile, ne rien afficher (redirection en cours)
  if (!isDesktop) {
    return null;
  }

  // Sur desktop, afficher le Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#548C2F]">
            Ajouter une note de classe
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Enregistre une nouvelle note obtenue en classe.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4 -mr-4">
          <AddNoteForm
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
            showScrollArea={false}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
