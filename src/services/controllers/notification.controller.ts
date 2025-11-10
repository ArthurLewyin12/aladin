import { request } from "@/lib/request";
import { NotificationEndpoints, GroupeEndpoints } from "@/constants/endpoints";
import {
  GetNotificationsResponse,
  GetNotificationsParams,
  MarkNotificationAsReadResponse,
  MarkAllNotificationsAsReadResponse,
  AcceptGroupInvitationResponse,
  DeclineGroupInvitationResponse,
} from "./types/common/notification.types";

/**
 * Récupère toutes les notifications de l'utilisateur connecté.
 * @param {GetNotificationsParams} params - Paramètres de pagination et de filtrage.
 * @returns {Promise<GetNotificationsResponse>} Une promesse résolue avec les notifications.
 */
export const getNotifications = async (
  params?: GetNotificationsParams,
): Promise<GetNotificationsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.per_page !== undefined) {
    queryParams.append("per_page", params.per_page.toString());
  }
  if (params?.unread_only !== undefined) {
    queryParams.append("unread_only", params.unread_only.toString());
  }

  const url = `${NotificationEndpoints.GET_NOTIFICATIONS}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return request.get<GetNotificationsResponse>(url);
};

/**
 * Récupère les notifications d'un élève spécifique.
 * Accessible par l'élève, son parent, son répétiteur ou son professeur.
 * @param {number} eleveId - ID de l'élève.
 * @param {GetNotificationsParams} params - Paramètres de pagination et de filtrage.
 * @returns {Promise<GetNotificationsResponse>} Une promesse résolue avec les notifications de l'élève.
 */
export const getEleveNotifications = async (
  eleveId: number,
  params?: GetNotificationsParams,
): Promise<GetNotificationsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.per_page !== undefined) {
    queryParams.append("per_page", params.per_page.toString());
  }
  if (params?.unread_only !== undefined) {
    queryParams.append("unread_only", params.unread_only.toString());
  }

  const endpoint = NotificationEndpoints.GET_ELEVE_NOTIFICATIONS.replace(
    "{eleveId}",
    eleveId.toString(),
  );

  const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return request.get<GetNotificationsResponse>(url);
};

/**
 * Marque une notification spécifique comme lue.
 * @param {number} notificationId - ID de la notification à marquer comme lue.
 * @returns {Promise<MarkNotificationAsReadResponse>} Une promesse résolue avec la notification mise à jour.
 */
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<MarkNotificationAsReadResponse> => {
  const endpoint = NotificationEndpoints.MARK_AS_READ.replace(
    "{notificationId}",
    notificationId.toString(),
  );

  return request.post<MarkNotificationAsReadResponse>(endpoint);
};

/**
 * Marque toutes les notifications non lues de l'utilisateur connecté comme lues.
 * @returns {Promise<MarkAllNotificationsAsReadResponse>} Une promesse résolue avec un message de succès.
 */
export const markAllNotificationsAsRead =
  async (): Promise<MarkAllNotificationsAsReadResponse> => {
    return request.post<MarkAllNotificationsAsReadResponse>(
      NotificationEndpoints.MARK_ALL_AS_READ,
    );
  };

/**
 * Accepte une invitation de groupe.
 * @param {number} invitationId - ID de l'invitation à accepter.
 * @returns {Promise<AcceptGroupInvitationResponse>} Une promesse résolue avec l'invitation acceptée.
 */
export const acceptGroupInvitation = async (
  invitationId: number,
): Promise<AcceptGroupInvitationResponse> => {
  const endpoint = GroupeEndpoints.ACCEPT_INVITATION.replace(
    "{invitationId}",
    invitationId.toString(),
  );

  return request.post<AcceptGroupInvitationResponse>(endpoint);
};

/**
 * Refuse une invitation de groupe.
 * @param {number} invitationId - ID de l'invitation à refuser.
 * @returns {Promise<DeclineGroupInvitationResponse>} Une promesse résolue avec l'invitation refusée.
 */
export const declineGroupInvitation = async (
  invitationId: number,
): Promise<DeclineGroupInvitationResponse> => {
  const endpoint = GroupeEndpoints.DECLINE_INVITATION.replace(
    "{invitationId}",
    invitationId.toString(),
  );

  return request.post<DeclineGroupInvitationResponse>(endpoint);
};
