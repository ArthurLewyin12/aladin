"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "./use-media-query";

interface UsePreventNavigationProps {
  when: boolean;
  message?: string;
  onConfirm?: () => void;
}

export function usePreventNavigation({
  when,
  message = "Tu es en train de passer un quiz. Si tu quittes maintenant, ton quiz sera automatiquement soumis avec les réponses actuelles.",
  onConfirm,
}: UsePreventNavigationProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Empêcher la fermeture de l'onglet/fenêtre ou la navigation via le navigateur
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // returnValue est déprécié mais nécessaire pour la compatibilité navigateur
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when, message]);

  // Composant de confirmation
  const ConfirmationDialog = useCallback(() => {
    const handleCancel = () => {
      setShowDialog(false);
      setPendingNavigation(null);
    };

    const handleConfirm = () => {
      setShowDialog(false);
      if (onConfirm) {
        onConfirm();
      }
      if (pendingNavigation) {
        router.push(pendingNavigation);
      }
      setPendingNavigation(null);
    };

    if (isDesktop) {
      return (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Quitter le quiz ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                {message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel} className="rounded-xl">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className="bg-orange-600 hover:bg-orange-700 rounded-xl"
              >
                Quitter et soumettre
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    return (
      <Drawer open={showDialog} onOpenChange={setShowDialog}>
        <DrawerContent className="rounded-t-3xl">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl">Quitter le quiz ?</DrawerTitle>
            <DrawerDescription className="text-base pt-2">
              {message}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              onClick={handleConfirm}
              className="h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl"
            >
              Quitter et soumettre
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-12 rounded-xl"
              >
                Annuler
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }, [showDialog, message, pendingNavigation, isDesktop, onConfirm, router]);

  // Fonction pour intercepter la navigation
  const interceptNavigation = useCallback(
    (destination: string) => {
      if (when) {
        setPendingNavigation(destination);
        setShowDialog(true);
        return false; // Empêche la navigation
      }
      return true; // Permet la navigation
    },
    [when],
  );

  return {
    ConfirmationDialog,
    interceptNavigation,
  };
}
