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