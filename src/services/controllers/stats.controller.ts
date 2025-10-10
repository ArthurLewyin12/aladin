import { request } from "@/lib/request";
import {
  EleveStatsResponse,
  DashboardResponse,
  ClassesResponse,
} from "./types/common/stats.type";
import { DashboardEndpoints } from "@/constants/endpoints";

/**
 * Récupère les statistiques d'évolution des notes et les meilleures matières pour un élève donné.
 * @param {number} eleveId - L'ID de l'élève.
 * @returns {Promise<EleveStatsResponse>} Une promesse qui se résout avec les statistiques de l'élève.
 */
export const getEleveStats = async (
  eleveId: number,
): Promise<EleveStatsResponse> => {
  const endpoint = DashboardEndpoints.STATS.replace(
    "{eleveId}",
    eleveId.toString(),
  );
  return request.get<EleveStatsResponse>(endpoint);
};

/**
 * Récupère les données complètes du tableau de bord pour un élève, avec un filtre de période optionnel.
 * @param {number} eleveId - L'ID de l'élève.
 * @param {'week' | 'month' | 'quarter' | 'semester' | 'year'} [period='week'] - La période pour laquelle récupérer les données (par défaut : 'week').
 * @returns {Promise<DashboardResponse>} Une promesse qui se résout avec les données du tableau de bord.
 */
export const getEleveDashboard = async (
  eleveId: number,
  period: "week" | "month" | "quarter" | "semester" | "year" = "week",
): Promise<DashboardResponse> => {
  const endpoint = DashboardEndpoints.DASHBOARD.replace(
    "{eleveId}",
    eleveId.toString(),
  ).replace("{period}", period);
  return request.get<DashboardResponse>(endpoint);
};

/**
 * Récupère la liste des classes auxquelles un élève est inscrit.
 * @param {number} eleveId - L'ID de l'élève.
 * @returns {Promise<ClassesResponse>} Une promesse qui se résout avec la liste des classes de l'élève.
 */
export const getEleveClasses = async (
  eleveId: number,
): Promise<ClassesResponse> => {
  const endpoint = DashboardEndpoints.CLASSES.replace(
    "{eleveId}",
    eleveId.toString(),
  );
  return request.get<ClassesResponse>(endpoint);
};
