export enum AuthEndpoints {
  LOGIN = '/auth/login',
  CSRF_COOKIE = '/sanctum/csrf-cookie',
  AUTH_ME = '/auth/me',
  AUTH_LOGOUT = '/auth/logout',
  // Add other auth endpoints here
}

export enum MatiereEndpoints {
  MATIERES_BY_NIVEAU = '/niveaux/{niveau_id}/matieres',
}

export enum ChapitreEndpoints {
  CHAPITRES_BY_MATIERE = '/matieres/{matiere_id}/chapitres',
}

export enum QuizEndpoints {
  QUIZ_HISTORY = '/quizzes/history',
  QUIZ_START = '/quizzes/start',
  QUIZ_GET = '/quizzes/{quiz_id}',
  QUIZ_DELETE = '/quizzes/delete/{quiz_id}',
  QUIZ_SUBMIT = '/quizzes/{quiz_id}/submit',
  QUIZ_NOTES = '/quizzes/{quiz_id}/notes',
}
