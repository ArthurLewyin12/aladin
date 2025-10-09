"use client";

import Toaster from "@/components/ui/toast";
import { toasterRef } from "@/lib/toast";

/**
 * Ce composant est un "Client Component" qui a pour seul but de rendre notre Toaster.
 * En l'isolant ici, on s'assure que la ref et le composant ne sont jamais rendus côté serveur,
 * ce qui corrige l'erreur de build de Next.js.
 */
export function ToasterProvider() {
  return <Toaster ref={toasterRef} />;
}
