import { request } from "@/lib/request";
import { GroupeEndpoints } from "@/constants/endpoints";
import {
  CreateGroupePayload,
  CreateGroupeResponse,
  GetGroupesResponse,
  GetGroupeResponse,
  UpdateGroupePayload,
  UpdateGroupeResponse,
  DeleteGroupeResponse,
  QuitGroupeResponse,
  InviteUsersToGroupePayload,
  InviteUsersToGroupeResponse,
  AcceptInvitationResponse,
  DeclineInvitationResponse,
  GetDetailedGroupeResponse,
  GetNotificationsResponse,
} from "./types/common";
import { NotificationEndpoints } from "@/constants/endpoints";

/**
 * Crée un nouveau groupe.
 * @param {CreateGroupePayload} payload - Les données pour la création du groupe.
 * @returns {Promise<CreateGroupeResponse>} Une promesse résolue avec les informations du groupe créé.
 */
export const createGroupe = async (
  payload: CreateGroupePayload,
): Promise<CreateGroupeResponse> => {
  return request.post<CreateGroupeResponse>(GroupeEndpoints.CREATE, payload);
};

/**
 * Récupère la liste de tous les groupes.
 * @returns {Promise<GetGroupesResponse>} Une promesse résolue avec la liste des groupes.
 */
export const getGroupes = async (): Promise<GetGroupesResponse> => {
  return request.get<GetGroupesResponse>(GroupeEndpoints.GET_ALL);
};

/**
 * Récupère un groupe spécifique par son ID.
 * @param {number} groupeId - L'ID du groupe.
 * @returns {Promise<GetGroupeResponse>} Une promesse résolue avec les informations du groupe.
 */
export const getGroupe = async (
  groupeId: number,
): Promise<GetGroupeResponse> => {
  const endpoint = GroupeEndpoints.GET_ONE.replace(
    "{groupeId}",
    groupeId.toString(),
  );
  return request.get<GetGroupeResponse>(endpoint);
};

/**
 * Met à jour un groupe spécifique par son ID.
 * @param {number} groupeId - L'ID du groupe à mettre à jour.
 * @param {UpdateGroupePayload} payload - Les données pour la mise à jour du groupe.
 * @returns {Promise<UpdateGroupeResponse>} Une promesse résolue avec les informations du groupe mis à jour.
 */
export const updateGroupe = async (
  groupeId: number,
  payload: UpdateGroupePayload,
): Promise<UpdateGroupeResponse> => {
  const endpoint = GroupeEndpoints.UPDATE.replace(
    "{groupeId}",
    groupeId.toString(),
  );
  return request.put<UpdateGroupeResponse>(endpoint, payload);
};

/**
 * Supprime un groupe spécifique par son ID.
 * @param {number} groupeId - L'ID du groupe à supprimer.
 * @returns {Promise<DeleteGroupeResponse>} Une promesse résolue avec un message de succès.
 */
export const deleteGroupe = async (
  groupeId: number,
): Promise<DeleteGroupeResponse> => {
  const endpoint = GroupeEndpoints.DELETE.replace(
    "{groupeId}",
    groupeId.toString(),
  );
  return request.delete<DeleteGroupeResponse>(endpoint);
};

/**
 * Permet à l'utilisateur authentifié de quitter un groupe.
 * @param {number} groupeId - L'ID du groupe à quitter.
 * @returns {Promise<QuitGroupeResponse>} Une promesse résolue avec un message de succès.
 */
export const quitGroupe = async (
  groupeId: number,
): Promise<QuitGroupeResponse> => {
  const endpoint = GroupeEndpoints.QUIT.replace(
    "{groupeId}",
    groupeId.toString(),
  );
  return request.post<QuitGroupeResponse>(endpoint);
};

/**
 * Envoie des invitations à des utilisateurs pour rejoindre un groupe.
 * @param {number} groupeId - L'ID du groupe auquel inviter des utilisateurs.
 * @param {InviteUsersToGroupePayload} payload - Les numéros de téléphone et/ou emails des utilisateurs à inviter.
 * @returns {Promise<InviteUsersToGroupeResponse>} Une promesse résolue avec un message de succès et d'éventuelles erreurs.
 */
export const inviteUsersToGroupe = async (
  groupeId: number,
  payload: InviteUsersToGroupePayload,
): Promise<InviteUsersToGroupeResponse> => {
  const endpoint = GroupeEndpoints.INVITE.replace(
    "{groupeId}",
    groupeId.toString(),
  );
  return request.post<InviteUsersToGroupeResponse>(endpoint, payload);
};

/**
 * Permet à l'utilisateur authentifié d'accepter une invitation à un groupe.
 * @param {number} invitationId - L'ID de l'invitation à accepter.
 * @returns {Promise<AcceptInvitationResponse>} Une promesse résolue avec un message de succès.
 */
export const acceptInvitation = async (
  invitationId: number,
): Promise<AcceptInvitationResponse> => {
  const endpoint = GroupeEndpoints.ACCEPT_INVITATION.replace(
    "{invitationId}",
    invitationId.toString(),
  );
  return request.post<AcceptInvitationResponse>(endpoint);
};

/**
 * Permet à l'utilisateur authentifié de décliner une invitation à un groupe.
 * @param {number} invitationId - L'ID de l'invitation à décliner.
 * @returns {Promise<DeclineInvitationResponse>} Une promesse résolue avec un message de succès.
 */
export const declineInvitation = async (
  invitationId: number,
): Promise<DeclineInvitationResponse> => {
  const endpoint = GroupeEndpoints.DECLINE_INVITATION.replace(
    "{invitationId}",
    invitationId.toString(),
  );
  return request.post<DeclineInvitationResponse>(endpoint);
};

/**
 * Récupère les détails détaillés d'un groupe spécifique par son ID.
 * @param {number} groupeId - L'ID du groupe.
 * @returns {Promise<GetDetailedGroupeResponse>} Une promesse résolue avec les informations détaillées du groupe.
 */
export const getDetailedGroupe = async (
  groupeId: number,
): Promise<GetDetailedGroupeResponse> => {
  const endpoint = GroupeEndpoints.GET_DETAILED.replace(
    "{groupeId}",
    groupeId.toString(),
  );
  return request.get<GetDetailedGroupeResponse>(endpoint);
};

/**
 * Récupère les notifications d'invitation pour l'utilisateur authentifié.
 * @returns {Promise<GetNotificationsResponse>} Une promesse résolue avec la liste des invitations.
 */
export const getNotifications = async (): Promise<GetNotificationsResponse> => {
  return request.get<GetNotificationsResponse>(
    NotificationEndpoints.GET_NOTIFICATIONS,
  );
};
