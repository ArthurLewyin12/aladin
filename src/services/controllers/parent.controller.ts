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
} from "./types/common/parent.types";

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
