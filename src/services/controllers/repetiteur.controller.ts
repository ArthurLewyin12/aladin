import { request } from "@/lib/request";
import { RepetiteurEndpoints } from "@/constants/endpoints";
import {
  GetElevesResponse,
  AjouterEleveManuelPayload,
  AjouterEleveManuelResponse,
  SelectionnerElevePayload,
  SelectionnerEleveResponse,
  GetEleveActifResponse,
  AjouterEleveUtilisateurPayload,
  AjouterEleveUtilisateurResponse,
  RetirerElevePayload,
  RetirerEleveResponse,
  RechercherElevePayload,
  RechercherEleveResponse,
  AssocierAutomatiquementResponse,
  GetRepetiteurStatsResponse,
  GetEleveGroupesResponse,
  GetEleveQuizResponse,
  GetEleveCoursResponse,
  GetEleveResumeResponse,
  GetRelationsStatistiquesResponse,
  GetNiveauxChoisisResponse,
  DefinirNiveauxPayload,
  DefinirNiveauxResponse,
  EleveDashboardStats,
} from "./types/common/repetiteur.types";
import {
  GetRepetiteurDashboardResponse,
  DashboardPeriod,
} from "./types/common/dashboard-data.types";

/**
 * Récupère tous les élèves (utilisateurs + manuels) du répétiteur.
 * @returns {Promise<GetElevesResponse>} La liste des élèves et l'élève actif.
 */
export const getEleves = async (): Promise<GetElevesResponse> => {
  return request.get<GetElevesResponse>(RepetiteurEndpoints.GET_ELEVES);
};

/**
 * Ajoute un élève manuellement.
 * @param {AjouterEleveManuelPayload} payload - Les informations de l'élève à ajouter.
 * @returns {Promise<AjouterEleveManuelResponse>} L'élève ajouté.
 */
export const ajouterEleveManuel = async (
  payload: AjouterEleveManuelPayload,
): Promise<AjouterEleveManuelResponse> => {
  return request.post<AjouterEleveManuelResponse>(
    RepetiteurEndpoints.AJOUTER_ELEVE_MANUEL,
    payload,
  );
};

/**
 * Sélectionne un élève comme élève actif.
 * @param {SelectionnerElevePayload} payload - L'ID de l'élève à sélectionner.
 * @returns {Promise<SelectionnerEleveResponse>} L'élève sélectionné.
 */
export const selectionnerEleve = async (
  payload: SelectionnerElevePayload,
): Promise<SelectionnerEleveResponse> => {
  return request.post<SelectionnerEleveResponse>(
    RepetiteurEndpoints.SELECTIONNER_ELEVE,
    payload,
  );
};

/**
 * Récupère l'élève actuellement sélectionné.
 * @returns {Promise<GetEleveActifResponse>} L'élève actif et sa classe.
 */
export const getEleveActif = async (): Promise<GetEleveActifResponse> => {
  return request.get<GetEleveActifResponse>(
    RepetiteurEndpoints.GET_ELEVE_ACTIF,
  );
};

/**
 * Ajoute un élève utilisateur existant au répétiteur.
 * @param {AjouterEleveUtilisateurPayload} payload - L'ID de l'élève utilisateur.
 * @returns {Promise<AjouterEleveUtilisateurResponse>} L'élève ajouté.
 */
export const ajouterEleveUtilisateur = async (
  payload: AjouterEleveUtilisateurPayload,
): Promise<AjouterEleveUtilisateurResponse> => {
  return request.post<AjouterEleveUtilisateurResponse>(
    RepetiteurEndpoints.ASSOCIER_AUTOMATIQUEMENT,
    payload,
  );
};

/**
 * Retire un élève de la liste du répétiteur.
 * @param {RetirerElevePayload} payload - L'ID de l'élève à retirer.
 * @returns {Promise<RetirerEleveResponse>} La réponse de l'API.
 */
export const retirerEleve = async (
  payload: RetirerElevePayload,
): Promise<RetirerEleveResponse> => {
  return request.delete<RetirerEleveResponse>(
    RepetiteurEndpoints.RETIRER_ELEVE,
    {
      data: payload,
    },
  );
};

/**
 * Recherche un élève existant par email ou numéro.
 * @param {RechercherElevePayload} payload - Email et/ou numéro de l'élève.
 * @returns {Promise<RechercherEleveResponse>} L'élève trouvé ou un message.
 */
export const rechercherEleve = async (
  payload: RechercherElevePayload,
): Promise<RechercherEleveResponse> => {
  return request.post<RechercherEleveResponse>(
    RepetiteurEndpoints.RECHERCHER_ELEVE,
    payload,
  );
};

/**
 * Associe automatiquement les élèves qui ont utilisé l'email ou le numéro du répétiteur.
 * @returns {Promise<AssocierAutomatiquementResponse>} Le nombre d'élèves associés.
 */
export const associerAutomatiquement =
  async (): Promise<AssocierAutomatiquementResponse> => {
    return request.post<AssocierAutomatiquementResponse>(
      RepetiteurEndpoints.ASSOCIER_AUTOMATIQUEMENT,
    );
  };

/**
 * Récupère les statistiques du répétiteur.
 * @param {number} repetiteurId - L'ID du répétiteur.
 * @returns {Promise<GetRepetiteurStatsResponse>} Les statistiques.
 */
export const getRepetiteurStats = async (
  repetiteurId: number,
): Promise<GetRepetiteurStatsResponse> => {
  const endpoint = RepetiteurEndpoints.GET_STATS.replace(
    "{id}",
    repetiteurId.toString(),
  );
  return request.get<GetRepetiteurStatsResponse>(endpoint);
};

/**
 * Récupère le dashboard du répétiteur.
 * @param {number} repetiteurId - L'ID du répétiteur.
 * @param {DashboardPeriod} period - La période d'analyse (week, month, quarter, semester, year). Par défaut: month
 * @returns {Promise<GetRepetiteurDashboardResponse>} Le dashboard.
 */
export const getRepetiteurDashboard = async (
  repetiteurId: number,
  period: DashboardPeriod = "month",
): Promise<GetRepetiteurDashboardResponse> => {
  const endpoint = RepetiteurEndpoints.GET_DASHBOARD.replace(
    "{id}",
    repetiteurId.toString(),
  );
  return request.get<GetRepetiteurDashboardResponse>(endpoint, {
    params: { period },
  });
};

/**
 * Récupère les groupes de l'élève sélectionné.
 * @returns {Promise<GetEleveGroupesResponse>} Les groupes de l'élève.
 */
export const getEleveGroupes = async (): Promise<GetEleveGroupesResponse> => {
  return request.get<GetEleveGroupesResponse>(
    RepetiteurEndpoints.GET_ELEVE_GROUPES,
  );
};

/**
 * Récupère les quiz de l'élève sélectionné.
 * @returns {Promise<GetEleveQuizResponse>} Les quiz de l'élève.
 */
export const getEleveQuiz = async (): Promise<GetEleveQuizResponse> => {
  return request.get<GetEleveQuizResponse>(RepetiteurEndpoints.GET_ELEVE_QUIZ);
};

/**
 * Récupère les cours de l'élève sélectionné.
 * @returns {Promise<GetEleveCoursResponse>} Les cours de l'élève.
 */
export const getEleveCours = async (): Promise<GetEleveCoursResponse> => {
  return request.get<GetEleveCoursResponse>(
    RepetiteurEndpoints.GET_ELEVE_COURS,
  );
};

/**
 * Récupère le résumé de l'élève sélectionné.
 * @returns {Promise<GetEleveResumeResponse>} Le résumé de l'élève.
 */
export const getEleveResume = async (): Promise<GetEleveResumeResponse> => {
  return request.get<GetEleveResumeResponse>(
    RepetiteurEndpoints.GET_ELEVE_RESUME,
  );
};

/**
 * Récupère les statistiques des relations répétiteur-élève.
 * @returns {Promise<GetRelationsStatistiquesResponse>} Les statistiques.
 */
export const getRelationsStatistiques =
  async (): Promise<GetRelationsStatistiquesResponse> => {
    return request.get<GetRelationsStatistiquesResponse>(
      RepetiteurEndpoints.GET_RELATIONS_STATS,
    );
  };

/**
 * Récupère les niveaux choisis par le répétiteur.
 * @returns {Promise<GetNiveauxChoisisResponse>} Les niveaux choisis.
 */
export const getNiveauxChoisis =
  async (): Promise<GetNiveauxChoisisResponse> => {
    return request.get<GetNiveauxChoisisResponse>(
      RepetiteurEndpoints.GET_NIVEAUX_CHOISIS,
    );
  };

/**
 * Définit les niveaux d'enseignement du répétiteur.
 * @param {DefinirNiveauxPayload} payload - Les IDs des niveaux à définir.
 * @returns {Promise<DefinirNiveauxResponse>} La réponse de l'API.
 */
export const definirNiveaux = async (
  payload: DefinirNiveauxPayload,
): Promise<DefinirNiveauxResponse> => {
  return request.post<DefinirNiveauxResponse>(
    RepetiteurEndpoints.DEFINIR_NIVEAUX,
    payload,
  );
};

/**
 * Récupère le résumé/statistiques pour chaque élève du répétiteur.
 * @returns {Promise<Array>} Les résumés de tous les élèves.
 */
export const getElevesResume = async (): Promise<
  Array<{ eleveId: string | number; statistiques: EleveDashboardStats }>
> => {
  try {
    const elevesResponse = await getEleves();
    const resumes = await Promise.all(
      elevesResponse.eleves.map(async (eleve) => {
        try {
          // Sélectionner l'élève d'abord
          await request.post(RepetiteurEndpoints.SELECTIONNER_ELEVE, {
            eleve_id: eleve.id,
            type: eleve.type,
          });
          // Puis récupérer son résumé
          const resumeResponse = await getEleveResume();
          const stats = resumeResponse.statistiques;
          return {
            eleveId: eleve.id,
            statistiques: {
              nombre_groupes: stats.nombre_groupes || 0,
              nombre_quiz: stats.nombre_quiz || 0,
              nombre_cours: stats.nombre_cours || 0,
              moyenne_generale: stats.moyenne_generale || null,
              heures_etude_hebdomadaires: stats.heures_etude_hebdomadaires || 0,
              tendance: stats.tendance || "stable",
              progression: stats.progression || 0,
            },
          };
        } catch (error) {
          // En cas d'erreur, retourner les valeurs par défaut
          return {
            eleveId: eleve.id,
            statistiques: {
              nombre_groupes: 0,
              nombre_quiz: 0,
              nombre_cours: 0,
              moyenne_generale: null,
              heures_etude_hebdomadaires: 0,
              tendance: "stable",
              progression: 0,
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