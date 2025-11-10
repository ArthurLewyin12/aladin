/**
 * Types pour les notifications
 */

/**
 * Type de notification
 */
export type NotificationType =
  | "quiz_activated"
  | "grade_received"
  | "quiz_created"
  | "course_activated"
  | "group_invitation"
  | "group_quiz_created"
  | string; // Pour supporter d'autres types futurs

/**
 * Structure d'une notification
 */
export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>; // Données spécifiques au type de notification
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Pagination des notifications
 */
export interface NotificationPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/**
 * Structure d'une invitation de groupe
 */
export interface GroupInvitation {
  id: number;
  id_user_envoie: number;
  id_user_invite: number | null;
  email: string;
  groupe_id: number;
  reponse: "en attente" | "acceptée" | "refusée";
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  groupe: {
    id: number;
    nom: string;
    description: string;
    niveau_id: number;
  };
  userEnvoie: {
    id: number;
    nom: string;
    prenom: string;
    mail: string;
  };
}

/**
 * Réponse de récupération des notifications générales
 */
export interface NotificationsGeneralesResponse {
  data: Notification[];
  pagination: NotificationPagination;
  unread_count: number;
}

/**
 * Réponse de récupération de toutes les notifications (générales + invitations)
 */
export interface GetNotificationsResponse {
  notifications_generales: NotificationsGeneralesResponse;
  invitations_groupes: GroupInvitation[];
}

/**
 * Paramètres pour récupérer les notifications
 */
export interface GetNotificationsParams {
  per_page?: number;
  unread_only?: boolean;
}

/**
 * Réponse de marquage d'une notification comme lue
 */
export interface MarkNotificationAsReadResponse {
  message: string;
  notification: Notification;
}

/**
 * Réponse de marquage de toutes les notifications comme lues
 */
export interface MarkAllNotificationsAsReadResponse {
  message: string;
}

/**
 * Réponse d'acceptation d'une invitation de groupe
 */
export interface AcceptGroupInvitationResponse {
  message: string;
  invitation: GroupInvitation;
}

/**
 * Réponse de refus d'une invitation de groupe
 */
export interface DeclineGroupInvitationResponse {
  message: string;
  invitation: GroupInvitation;
}
