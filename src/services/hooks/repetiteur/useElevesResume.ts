import { useQuery } from "@tanstack/react-query";
import { getElevesResume } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";

export const useElevesResume = (enabled: boolean = true) => {
  return useQuery({
    queryKey: createQueryKey("repetiteur", "eleves", "resume"),
    queryFn: getElevesResume,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
