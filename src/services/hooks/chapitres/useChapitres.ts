import { useQuery } from "@tanstack/react-query";
import { getChapitresByMatiere } from "@/services/controllers/chapitre.controller";

export const useChapitresByMatiere = (matiereId: number) => {
  return useQuery({
    queryKey: ['chapitres', matiereId],
    queryFn: () => getChapitresByMatiere(matiereId),
    enabled: !!matiereId, // Only run the query if matiereId is provided
  });
};
