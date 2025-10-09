import { createRef } from "react";
import type { ToasterRef, ToasterProps } from "@/components/ui/toast";

/**
 * Crée une référence unique qui sera attachée au composant Toaster dans le layout principal.
 * C'est le pont qui permet à la fonction `toast()` de communiquer avec le composant.
 */
export const toasterRef = createRef<ToasterRef>();

/**
 * Fonction globale pour afficher un toast.
 * Elle peut être appelée depuis n'importe où dans l'application.
 *
 * @param props Les propriétés du toast à afficher (message, variant, etc.).
 */
export const toast = (props: ToasterProps) => {
  if (toasterRef.current) {
    toasterRef.current.show(props);
  } else {
    // Fallback de sécurité si le Toaster n'est pas encore monté
    console.warn(
      "Le composant Toaster n'est pas monté, le toast ne peut pas être affiché.",
    );
  }
};
