import { request } from "@/lib/request";
import { GroupeEndpoints, QuizEndpoints } from "@/constants/endpoints";
import {
  CreateGroupePayload,
  CreateGroupeResponse,
  GetGroupesResponse,
  GetGroupeResponse,
  UpdateGroupePayload,
  UpdateGroupeResponse,
  QuitGroupeResponse,
  InviteUsersToGroupePayload,
  InviteUsersToGroupeResponse,
  AcceptInvitationResponse,
  DeclineInvitationResponse,
  GetDetailedGroupeResponse,
  GetNotificationsResponse,
  StartGroupQuizResponse,
  SubmitGroupQuizResponse,
  QuizSubmitPayload,
  InvitationDetails,
  GetAllQuizNotesSuccessResponse,
} from "./types/common";
import {
  GenerateGroupQuizPayload,
  GenerateGroupQuizResponse,
} from "./types/common/groupe-quiz.types";
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

/**
 * Crée/Génère un nouveau quiz pour un groupe (réservé au chef du groupe).
 * Supporte deux modes:
 * - Sans document: envoi JSON classique, génération basée sur le chapitre
 * - Avec document: envoi multipart/form-data, génération basée sur le fichier uploadé
 * @param {GenerateGroupQuizPayload} payload - Les données pour la création du quiz (avec document_file optionnel).
 * @returns {Promise<GenerateGroupQuizResponse>} Une promesse résolue avec les informations du quiz créé.
 */
export const createGroupQuiz = async (
  payload: GenerateGroupQuizPayload,
): Promise<GenerateGroupQuizResponse> => {
  // Si un fichier est présent, utiliser FormData
  if (payload.document_file) {
    return request.postFormData<GenerateGroupQuizResponse>(
      GroupeEndpoints.CREATE_QUIZ,
      {
        group_id: payload.group_id,
        chapter_id: payload.chapter_id,
        difficulty: payload.difficulty,
        title: payload.title,
        nombre_questions: payload.nombre_questions,
        temps: payload.temps,
        document_file: payload.document_file,
      },
    );
  } else {
    // Sinon, envoi JSON classique
    return request.post<GenerateGroupQuizResponse>(
      GroupeEndpoints.CREATE_QUIZ,
      {
        group_id: payload.group_id,
        chapter_id: payload.chapter_id,
        difficulty: payload.difficulty,
        title: payload.title,
        nombre_questions: payload.nombre_questions,
        temps: payload.temps,
      },
    );
  }
};

/**
 * Desactive un groupe spécifique.
 * @param {number} groupeId - L'ID du groupe à desactiver.
 * @returns {Promise<void>}
 */
export const deactivateGroupe = async (groupeId: number): Promise<void> => {
  const endpoint = GroupeEndpoints.DESACTIVATE_GROUPE.replace(
    "{groupeId}",
    groupeId.toString(),
  );
  return request.post<void>(endpoint);
};

/**
 * Reactive un groupe spécifique.
 * @param {number} groupeId - L'ID du groupe à reactiver.
 * @returns {Promise<void>}
 */
export const reactivateGroupe = async (groupeId: number): Promise<void> => {
  const endpoint = GroupeEndpoints.REACTIVATE_GROUPE.replace(
    "{groupeId}",
    groupeId.toString(),
  );
  return request.post<void>(endpoint);
};

/**
 * Récupère une invitation par son token.
 * @param {string} token - Le token de l'invitation.
 * @returns {Promise<any>} Une promesse résolue avec les informations de l'invitation.
 */
export const getInvitationByToken = async (
  token: string,
): Promise<InvitationDetails> => {
  const endpoint = GroupeEndpoints.GET_INVITATION_BY_TOKEN.replace(
    "{token}",
    token,
  );
  console.log("Requesting endpoint:", endpoint);
  return request.get<InvitationDetails>(endpoint);
};

/**
 * Démarre une session de quiz pour un groupe.
 * @param {number} groupeId - L'ID du groupe.
 * @param {number} quizId - L'ID du quiz à démarrer.
 * @returns {Promise<StartGroupQuizResponse>} Une promesse résolue avec les données du quiz à démarrer.
 */
export const startGroupQuiz = async ({
  groupeId,
  quizId,
}: {
  groupeId: number;
  quizId: number;
}): Promise<StartGroupQuizResponse> => {
  const endpoint = GroupeEndpoints.START_GROUP_QUIZ.replace(
    "{groupeId}",
    groupeId.toString(),
  ).replace("{quizId}", quizId.toString());
  return request.post<StartGroupQuizResponse>(endpoint);
};

/**
 * Soumet les réponses d'un quiz de groupe.
 * @param {number} quizId - L'ID du quiz à soumettre.
 * @param {QuizSubmitPayload} payload - Le score de l'utilisateur.
 * @returns {Promise<SubmitGroupQuizResponse>} Une promesse résolue avec les corrections.
 */
export const submitGroupQuiz = async ({
  quizId,
  payload,
}: {
  quizId: number;
  payload: QuizSubmitPayload;
}): Promise<SubmitGroupQuizResponse> => {
  const endpoint = QuizEndpoints.QUIZ_SUBMIT.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.post<SubmitGroupQuizResponse>(endpoint, payload);
};

/**
 * Récupère toutes les notes d'un quiz de groupe.
 * @param {number} groupeId - L'ID du groupe.
 * @param {number} quizId - L'ID du quiz.
 * @returns {Promise<GetAllQuizNotesSuccessResponse>} Une promesse résolue avec les notes et corrections.
 */
export const getGroupQuizNotes = async ({
  groupeId,
  quizId,
}: {
  groupeId: number;
  quizId: number;
}): Promise<GetAllQuizNotesSuccessResponse> => {
  const endpoint = GroupeEndpoints.GROUP_QUIZ_NOTES.replace(
    "{groupeId}",
    groupeId.toString(),
  ).replace("{quizId}", quizId.toString());
  return request.get<GetAllQuizNotesSuccessResponse>(endpoint);
};
