/**
 * Endpoints relatifs à l'authentification des utilisateurs.
 */
export enum AuthEndpoints {
  LOGIN = "/api/auth/login",
  CSRF_COOKIE = "/sanctum/csrf-cookie",
  AUTH_ME = "/api/auth/me",
  AUTH_LOGOUT = "/api/auth/logout",
  PASSWORD_RESET = "/api/auth/password/reset",
  RESET_LINK = "api/auth/password/email",
  REFRESH_TOKEN = "/api/auth/refresh-token",
}

/**
 * Endpoints relatifs à la gestion des users
 */
export enum UserEndpoint {
  REGISTER = "api/auth/register",
  ACTIVATE = "/api/auth/activate",
  ACTIVATE_COUPON = "/api/auth/activate/coupon",
  RESEND_ACTIVATION = "/api/auth/activate/resend",
  UPDATE_USER_SETTINGS = "/api/settings/profile",
  UPDATE_USER_PASSWORD = "/api/settings/password",
}

/**
 * Endpoints relatifs à la gestion des paiements.
 */
export enum PaymentEndpoint {
  WAVE_USER_CHECKOUT = "/api/payments/wave/user/checkout",
  WAVE_USER_SUCCESS = "/api/payments/wave/user/success", // {token} sera ajouté dynamiquement
  WAVE_USER_ERROR = "/api/payments/wave/user/error", // {token} sera ajouté dynamiquement
}

/**
 * Endpoints relatifs à la gestion des donateurs.
 */
export enum DonateurEndpoint {
  INITIATE = "/api/donateurs/initiate",
  WAVE_DONATEUR_SUCCESS = "/api/donateurs/wave/success", // {public_id} sera ajouté dynamiquement
  WAVE_DONATEUR_ERROR = "/api/donateurs/wave/error", // {public_id} sera ajouté dynamiquement
}

/**
 * Endpoints relatifs au statut d'essai et d'abonnement.
 */
export enum TrialEndpoint {
  STATUS = "/api/trial/status",
}

/**
 * Endpoints relatifs à la gestion des matières.
 */
export enum MatiereEndpoints {
  MATIERES_BY_NIVEAU = "/api/niveaux/{niveau_id}/matieres",
}

/**
 * Endpoints relatifs à la gestion des chapitres.
 */
export enum ChapitreEndpoints {
  CHAPITRES_BY_MATIERE = "/api/matieres/{matiere_id}/chapitres",
}

/**
 * Endpoints relatifs à la gestion des quiz.
 */
export enum QuizEndpoints {
  QUIZ_GENERATE = "/api/quizzes/generate",
  QUIZ_HISTORY = "/api/quizzes/history",
  QUIZ_START = "/api/quizzes/{quizId}/start",
  QUIZ_GET = "/api/quizzes/{quiz_id}",
  QUIZ_DELETE = "/api/quizzes/delete/{quiz_id}",
  QUIZ_SUBMIT = "/api/quizzes/{quiz_id}/submit",
  QUIZ_NOTES = "/api/quizzes/{quiz_id}/notes",
  DESACTIVATE_QUIZ = "/api/quizzes/{quizId}/deactivate",
  REACTIVATE_QUIZ = "/api/quizzes/{quizId}/reactivate",
  QUIZ_GET_ALL = "/api/quizzes/my-generated",
}

/**
 * Endpoints relatifs à la gestion des cours.
 */
export enum CourseEndpoints {
  COURSES_BY_CHAPITRE = "/api/cours/expliquer",
}

/**
 * Endpoints relatifs à la gestion des groupes.
 */
export enum GroupeEndpoints {
  CREATE = "/api/groupes",
  GET_ALL = "/api/groupes",
  GET_ONE = "/api/groupes/{groupeId}",
  UPDATE = "/api/groupes/{groupeId}",
  DELETE = "/api/groupes/{groupeId}",
  QUIT = "/api/groupes/{groupeId}/quit",
  INVITE = "/api/groupes/{groupeId}/invitations",
  ACCEPT_INVITATION = "/api/invitations/{invitationId}/accept",
  DECLINE_INVITATION = "/api/invitations/{invitationId}/decline",
  GET_INVITATION_BY_TOKEN = "/api/invitations/{token}",
  GET_DETAILED = "/api/groupes/{groupeId}/detailed",
  DESACTIVATE_GROUPE = "api/groupes/{groupeId}/deactivate",
  REACTIVATE_GROUPE = "api/groupes/{groupeId}/reactivate",
  CREATE_QUIZ = "api/quizzes/generate/group",
  START_GROUP_QUIZ = "/api/groupes/{groupeId}/quizzes/{quizId}/start",
  GROUP_QUIZ_NOTES = "api/groupes/{groupeId}/quizzes/{quizId}/notes/all",
}

/**
 * Endpoints relatifs à la gestion des notifications.
 */
export enum NotificationEndpoints {
  GET_NOTIFICATIONS = "/api/notifications",
}

/**
 * route pour la gestion des niveaux
 */
export enum NiveauEndpoints {
  GET_ALL = "/api/niveaux",
  GET_ONE = "/api/niveaux/{niveauId}",
}

/**
 * route pour la gestion des contacts sur la page settings
 */
export enum ConctactAdminEndpoints {
  CONTACT = "/api/settings/contact-admin",
}

export enum DashboardEndpoints {
  STATS = "/api/eleve/stats/{eleveId}",
  DASHBOARD = "/api/eleve/{eleveId}?period={period}",
  CLASSES = "/api/eleve/classes/{eleveId}",
}
