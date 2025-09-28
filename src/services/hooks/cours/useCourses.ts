import { createQueryKey } from "@/lib/request";
import { useQuery } from "@tanstack/react-query";
import { expliquerCours } from "@/services/controllers/cours.controller";

export const useCourse = (chapter_id: string) => {
  return useQuery({
    queryKey: createQueryKey("course", chapter_id),
    queryFn: () => expliquerCours(chapter_id),
    enabled: !!chapter_id, // on ne vas seulement exécuter la request que si chapter_id est défini
  });
};
