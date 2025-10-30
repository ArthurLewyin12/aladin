import { useQuery } from "@tanstack/react-query";
import { getRepetiteurDashboard, getEleves } from "@/services/controllers/repetiteur.controller";
import { createQueryKey } from "@/lib/request";
import { DashboardPeriod } from "@/services/controllers/types/common/dashboard-data.types";
import { adaptRepetiteurDashboardData } from "./dashboard-adapter";
import { useElevesResume } from "./useElevesResume";

/**
 * Hook de requête pour récupérer le dashboard du répétiteur avec données transformées.
 *
 * @param repetiteurId - L'ID du répétiteur
 * @param period - La période d'analyse (week, month, quarter, semester, year). Par défaut: month
 * @returns Les données du dashboard adaptées pour les composants
 */
export const useRepetiteurDashboard = (
  repetiteurId: number,
  period: DashboardPeriod = "month",
) => {
  // Récupère les données du dashboard
  const dashboardQuery = useQuery({
    queryKey: createQueryKey("repetiteur-dashboard", repetiteurId, period),
    queryFn: () => getRepetiteurDashboard(repetiteurId, period),
    enabled: !!repetiteurId,
  });

  // Récupère la liste des élèves pour les noms et ID
  const elevesQuery = useQuery({
    queryKey: createQueryKey("repetiteur-eleves"),
    queryFn: () => getEleves(),
    enabled: !!repetiteurId,
  });

  // Récupère les résumés de tous les élèves
  const elevesResumeQuery = useElevesResume(!!repetiteurId);

  // Combine et transforme les données
  const isLoading = dashboardQuery.isLoading || elevesQuery.isLoading || elevesResumeQuery.isLoading;
  const error = dashboardQuery.error || elevesQuery.error || elevesResumeQuery.error;

  let data = null;
  if (
    dashboardQuery.data &&
    elevesQuery.data &&
    elevesQuery.data.eleves &&
    elevesQuery.data.eleves.length > 0 &&
    elevesResumeQuery.data
  ) {
    data = adaptRepetiteurDashboardData(
      dashboardQuery.data,
      elevesQuery.data.eleves.map((eleve) => ({
        id: eleve.id,
        prenom: eleve.prenom,
        nom: eleve.nom,
        niveau_id: eleve.niveau_id,
        niveau: eleve.niveau,
      })),
      elevesResumeQuery.data || [],
    );
  }

  return {
    data,
    isLoading,
    error,
    isFetching: dashboardQuery.isFetching || elevesQuery.isFetching || elevesResumeQuery.isFetching,
    isError: !!error,
  };
};