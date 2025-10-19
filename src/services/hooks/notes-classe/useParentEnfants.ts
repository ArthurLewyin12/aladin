import { useQuery } from "@tanstack/react-query";
import { getParentEnfants } from "@/services/controllers/note.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook pour récupérer la liste des enfants du parent
 * @returns Query result avec la liste des enfants
 */
export const useParentEnfants = () => {
  return useQuery({
    queryKey: createQueryKey("parent-enfants"),
    queryFn: getParentEnfants,
  });
};
