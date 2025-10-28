import { useQuery } from "@tanstack/react-query";
import { getParentDashboard, getEnfants } from "@/services/controllers/parent.controller";
import { createQueryKey } from "@/lib/request";
import { DashboardPeriod } from "@/services/controllers/types/common/dashboard-data.types";
import { adaptParentDashboardData } from "./dashboard-adapter";
import { useEnfantsResume } from "./useEnfantsResume";

/**
 * Hook de requête pour récupérer le dashboard du parent avec données transformées.
 *
 * @param parentId - L'ID du parent
 * @param period - La période d'analyse (week, month, quarter, semester, year). Par défaut: month
 * @returns Les données du dashboard adaptées pour les composants
 */
export const useParentDashboard = (
  parentId: number,
  period: DashboardPeriod = "month",
) => {
  // Récupère les données du dashboard
  const dashboardQuery = useQuery({
    queryKey: createQueryKey("parent-dashboard", parentId, period),
    queryFn: () => getParentDashboard(parentId, period),
    enabled: !!parentId,
  });

  // Récupère la liste des enfants pour les noms et ID
  const enfantsQuery = useQuery({
    queryKey: createQueryKey("parent-enfants"),
    queryFn: () => getEnfants(),
    enabled: !!parentId,
  });

  // Récupère les résumés de tous les enfants
  const enfantsResumeQuery = useEnfantsResume(!!parentId);

  // Combine et transforme les données
  const isLoading = dashboardQuery.isLoading || enfantsQuery.isLoading || enfantsResumeQuery.isLoading;
  const error = dashboardQuery.error || enfantsQuery.error || enfantsResumeQuery.error;

  let data = null;
  if (
    dashboardQuery.data &&
    enfantsQuery.data &&
    enfantsQuery.data.enfants &&
    enfantsQuery.data.enfants.length > 0
  ) {
    data = adaptParentDashboardData(
      dashboardQuery.data,
      enfantsQuery.data.enfants.map((enfant) => ({
        id: typeof enfant.id === "string" ? parseInt(enfant.id) : enfant.id,
        prenom: enfant.prenom,
        nom: enfant.nom,
        niveau_id: enfant.niveau_id,
        niveau: enfant.niveau,
      })),
      enfantsResumeQuery.data || [],
    );
  }

  return {
    data,
    isLoading,
    error,
    isFetching: dashboardQuery.isFetching || enfantsQuery.isFetching || enfantsResumeQuery.isFetching,
    isError: !!error,
  };
};
