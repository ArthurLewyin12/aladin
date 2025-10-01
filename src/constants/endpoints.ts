/**
 * Endpoints relatifs à l'authentification des utilisateurs.
 */
export enum AuthEndpoints {
  LOGIN = "/api/auth/login",
  CSRF_COOKIE = "/sanctum/csrf-cookie",
  AUTH_ME = "/api/auth/me",
  AUTH_LOGOUT = "/api/auth/logout",
}

/**
 * Endpoint api pour la gestion des users
 */
export enum UserEndpoint {
  REGISTER = "api/auth/register",
  ACTIVATE = "/api/auth/activate",
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
  GET_DETAILED = "/api/groupes/{groupeId}/detailed",
}

/**
 * Endpoints relatifs à la gestion des notifications.
 */
export enum NotificationEndpoints {
  GET_NOTIFICATIONS = "/api/notifications",
}
