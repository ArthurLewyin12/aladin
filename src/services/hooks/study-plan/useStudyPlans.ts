import { useQuery } from "@tanstack/react-query";
import { getStudyPlans } from "@/services/controllers/study-plan.controller";
import { createQueryKey } from "@/lib/request";
import { MOCK_STUDY_PLANS } from "@/mock/study-plans"; // Import mock data

/**
 * Hook de requête pour récupérer le planning d'études de l'élève.
 *
 * @param useMockData - Si true, retourne des données mockées au lieu d'appeler l'API.
 * @returns Le résultat de la requête TanStack Query ou des données mockées.
 */
export const useStudyPlans = (useMockData: boolean = false) => {
  if (useMockData) {
    return {
      data: { success: true, plans: MOCK_STUDY_PLANS },
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  return useQuery({
    queryKey: createQueryKey("study-plans"),
    queryFn: getStudyPlans,
  });
};