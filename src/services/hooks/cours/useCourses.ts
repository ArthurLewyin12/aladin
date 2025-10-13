import { createQueryKey } from "@/lib/request";
import { useQuery } from "@tanstack/react-query";
import { expliquerCours } from "@/services/controllers/cours.controller";
import { GenerateCoursPayload } from "@/services/controllers/types/common/cours.type";
import { AxiosError } from "axios";

/**
 * Hook de requête pour récupérer l'explication d'un cours pour un chapitre spécifique.
 * Encapsule l'appel à l'API `expliquerCours` dans une requête TanStack Query.
 *
 * @param {string | number} chapter_id - L'ID du chapitre à récupérer.
 * @param {File} [document_file] - Fichier optionnel pour génération basée sur document.
 * @returns Une requête qui peut être utilisée pour suivre l'état de la récupération (pending, error, success).
 *          La requête est activée uniquement si `chapter_id` est fourni.
 *          Inclut une logique de "retry" avec "exponential backoff" en cas d'échec,
 *          sauf pour les erreurs 429 (Too Many Requests).
 */
export const useCourse = (
  chapter_id: string | number,
  document_file?: File,
) => {
  const payload: GenerateCoursPayload = {
    chapter_id: Number(chapter_id),
    document_file,
  };

  return useQuery({
    queryKey: createQueryKey(
      "course",
      chapter_id,
      document_file?.name || "no-doc",
    ),
    queryFn: () => expliquerCours(payload),
    enabled: !!chapter_id, // on ne vas seulement exécuter la request que si chapter_id est défini

    retry: (failureCount, error) => {
      if ((error as AxiosError)?.response?.status === 429) {
        return false;
      }
      // Retry up to 2 times (3 attempts total)
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 1s, 2s
  });
};
