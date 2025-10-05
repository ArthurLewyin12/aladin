import { useState, useEffect } from "react";

/**
 * Hook personnalisé pour évaluer une media query CSS.
 * Il écoute les changements de la taille de la fenêtre et retourne si la media query donnée est active.
 *
 * @param {string} query - La chaîne de la media query (ex: "(max-width: 768px)").
 * @returns {boolean} - `true` si la media query correspond, sinon `false`.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // S'assurer que le code s'exécute uniquement côté client
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Définir l'état initial
    setMatches(mediaQueryList.matches);

    // Ajouter l'écouteur pour les changements futurs
    mediaQueryList.addEventListener("change", listener);

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
};
