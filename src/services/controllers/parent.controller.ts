import { request } from "@/lib/request";
import { ParentEndpoints } from "@/constants/endpoints";
import {
  GetEnfantsResponse,
  AjouterEnfantManuelPayload,
  AjouterEnfantManuelResponse,
  SelectionnerEnfantPayload,
  SelectionnerEnfantResponse,
  GetEnfantActifResponse,
  AjouterEnfantUtilisateurPayload,
  AjouterEnfantUtilisateurResponse,
  RetirerEnfantPayload,
  RetirerEnfantResponse,
  AssocierAutomatiquementResponse,
  GetEnfantResumeResponse,
  EnfantDashboardStats,
} from "./types/common/parent.types";
import { GetParentDashboardResponse, DashboardPeriod } from "./types/common/dashboard-data.types";

/**
 * Récupère tous les enfants (utilisateurs + manuels) du parent.
 * @returns {Promise<GetEnfantsResponse>} La liste des enfants et l'enfant actif.
 */
export const getEnfants = async (): Promise<GetEnfantsResponse> => {
  return request.get<GetEnfantsResponse>(ParentEndpoints.GET_ENFANTS);
};

/**
 * Ajoute un enfant manuellement.
 * @param {AjouterEnfantManuelPayload} payload - Les informations de l'enfant à ajouter.
 * @returns {Promise<AjouterEnfantManuelResponse>} L'enfant ajouté.
 */
export const ajouterEnfantManuel = async (
  payload: AjouterEnfantManuelPayload,
): Promise<AjouterEnfantManuelResponse> => {
  return request.post<AjouterEnfantManuelResponse>(
    ParentEndpoints.AJOUTER_ENFANT_MANUEL,
    payload,
  );
};

/**
 * Sélectionne un enfant comme enfant actif.
 * @param {SelectionnerEnfantPayload} payload - L'ID de l'enfant à sélectionner.
 * @returns {Promise<SelectionnerEnfantResponse>} L'enfant sélectionné.
 */
export const selectionnerEnfant = async (
  payload: SelectionnerEnfantPayload,
): Promise<SelectionnerEnfantResponse> => {
  return request.post<SelectionnerEnfantResponse>(
    ParentEndpoints.SELECTIONNER_ENFANT,
    payload,
  );
};

/**
 * Récupère l'enfant actuellement sélectionné.
 * @returns {Promise<GetEnfantActifResponse>} L'enfant actif et sa classe.
 */
export const getEnfantActif = async (): Promise<GetEnfantActifResponse> => {
  return request.get<GetEnfantActifResponse>(ParentEndpoints.GET_ENFANT_ACTIF);
};

/**
 * Ajoute un enfant utilisateur existant au parent.
 * @param {AjouterEnfantUtilisateurPayload} payload - L'ID de l'enfant utilisateur.
 * @returns {Promise<AjouterEnfantUtilisateurResponse>} L'enfant ajouté.
 */
export const ajouterEnfantUtilisateur = async (
  payload: AjouterEnfantUtilisateurPayload,
): Promise<AjouterEnfantUtilisateurResponse> => {
  return request.post<AjouterEnfantUtilisateurResponse>(
    ParentEndpoints.AJOUTER_ENFANT_UTILISATEUR,
    payload,
  );
};

/**
 * Retire un enfant de la liste du parent.
 * @param {RetirerEnfantPayload} payload - L'ID de l'enfant à retirer.
 * @returns {Promise<RetirerEnfantResponse>} La réponse de l'API.
 */
export const retirerEnfant = async (
  payload: RetirerEnfantPayload,
): Promise<RetirerEnfantResponse> => {
  return request.delete<RetirerEnfantResponse>(ParentEndpoints.RETIRER_ENFANT, {
    data: payload,
  });
};

/**
 * Associe automatiquement les enfants qui ont utilisé l'email ou le numéro du parent.
 * @returns {Promise<AssocierAutomatiquementResponse>} Le nombre d'enfants associés.
 */
export const associerAutomatiquement =
  async (): Promise<AssocierAutomatiquementResponse> => {
    return request.post<AssocierAutomatiquementResponse>(
      ParentEndpoints.ASSOCIER_AUTOMATIQUEMENT,
    );
  };

/**
 * Récupère les groupes créés pour l'enfant actif.
 * @returns {Promise<GetEnfantGroupesResponse>} Les groupes de l'enfant.
 */
export const getEnfantGroupes =
  async (): Promise<import("./types/common/parent.types").GetEnfantGroupesResponse> => {
    return request.get<
      import("./types/common/parent.types").GetEnfantGroupesResponse
    >(ParentEndpoints.GET_ENFANT_GROUPES);
  };

/**
 * Récupère les quiz créés pour l'enfant actif.
 * @returns {Promise<GetEnfantQuizResponse>} Les quiz de l'enfant.
 */
export const getEnfantQuiz =
  async (): Promise<import("./types/common/parent.types").GetEnfantQuizResponse> => {
    return request.get<
      import("./types/common/parent.types").GetEnfantQuizResponse
    >(ParentEndpoints.GET_ENFANT_QUIZ);
  };

/**
 * Récupère les cours créés pour l'enfant actif.
 * @returns {Promise<GetEnfantCoursResponse>} Les cours de l'enfant.
 */
export const getEnfantCours =
  async (): Promise<import("./types/common/parent.types").GetEnfantCoursResponse> => {
    return request.get<
      import("./types/common/parent.types").GetEnfantCoursResponse
    >(ParentEndpoints.GET_ENFANT_COURS);
  };

/**
 * Récupère le résumé/statistiques de l'enfant actif.
 * @returns {Promise<GetEnfantResumeResponse>} Le résumé de l'enfant.
 */
export const getEnfantResume =
  async (): Promise<GetEnfantResumeResponse> => {
    return request.get<GetEnfantResumeResponse>(ParentEndpoints.GET_ENFANT_RESUME);
  };

/**
 * Récupère le résumé/statistiques pour chaque enfant du parent.
 * @returns {Promise<Array>} Les résumés de tous les enfants.
 */
export const getEnfantsResume = async (): Promise<
  Array<{ enfantId: string | number; statistiques: EnfantDashboardStats }>
> => {
  try {
    const enfantsResponse = await getEnfants();
    const resumes = await Promise.all(
      enfantsResponse.enfants.map(async (enfant) => {
        try {
          // Sélectionner l'enfant d'abord
          await request.post(ParentEndpoints.SELECTIONNER_ENFANT, {
            enfant_id: enfant.id,
            type: enfant.type,
          });
          // Puis récupérer son résumé
          const resumeResponse = await getEnfantResume();
          const stats = resumeResponse.statistiques;
          return {
            enfantId: enfant.id,
            statistiques: {
              nombre_groupes: stats.nombre_groupes || 0,
              nombre_quiz: stats.nombre_quiz || 0,
              nombre_cours: stats.nombre_cours || 0,
              heures_etude_hebdomadaires: stats.heures_etude_hebdomadaires || 0,
              tendance: stats.tendance || "stable",
              progression: stats.progression || 0,
              moyenne_generale: stats.moyenne_generale || null,
            },
          };
        } catch (error) {
          // En cas d'erreur, retourner les valeurs par défaut
          return {
            enfantId: enfant.id,
            statistiques: {
              nombre_groupes: 0,
              nombre_quiz: 0,
              nombre_cours: 0,
              heures_etude_hebdomadaires: 0,
              tendance: "stable",
              progression: 0,
              moyenne_generale: null,
            },
          };
        }
      }),
    );
    return resumes;
  } catch (error) {
    return [];
  }
};

/**
 * Récupère le dashboard du parent avec les statistiques, graphiques et activités récentes.
 * @param {number} parentId - L'ID du parent.
 * @param {DashboardPeriod} period - La période d'analyse (week, month, quarter, semester, year). Par défaut: month
 * @returns {Promise<GetParentDashboardResponse>} Le dashboard du parent.
 */
export const getParentDashboard = async (
  parentId: number,
  period: DashboardPeriod = "month",
): Promise<GetParentDashboardResponse> => {
  const endpoint = ParentEndpoints.GET_DASHBOARD.replace(
    "{parentId}",
    parentId.toString(),
  );
  return request.get<GetParentDashboardResponse>(endpoint, {
    params: { period },
  });
};
