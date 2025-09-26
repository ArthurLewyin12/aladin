import { useQuery } from "@tanstack/react-query";
import { getMatieresByNiveau } from "@/services/controllers/matiere.controller";

export const useMatieresByNiveau = (niveauId: number) => {
  return useQuery({
    queryKey: ['matieres', niveauId],
    queryFn: () => getMatieresByNiveau(niveauId),
    enabled: !!niveauId, // Only run the query if niveauId is provided
  });
};
