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
  GET_ONE_QUIZ = "/api/quizzes/eleves/my-generated/{quizId}",
}

/**
 * Endpoints relatifs à la gestion des cours.
 */
export enum CourseEndpoints {
  COURSES_BY_CHAPITRE = "/api/cours/expliquer",
  ALL_QUIZ_GENERATED = "/api/cours/my-generated",
  GET_ONE_COURSE = "/api/cours/{courseId}",
  ELEVE_COURS = "/api/eleves/{eleveId}/classes/cours",
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
  SUBMIT_GROUP_QUIZ = "/api/groupes/{groupeId}/quizzes/{quizId}/submit",
  GROUP_QUIZ_NOTES = "api/groupes/{groupeId}/quizzes/{quizId}/notes/all",
}

/**
 * Endpoints relatifs à la gestion des notifications.
 */
export enum NotificationEndpoints {
  GET_NOTIFICATIONS = "/api/notifications",
  GET_ELEVE_NOTIFICATIONS = "/api/notifications/eleve/{eleveId}",
  MARK_AS_READ = "/api/notifications/{notificationId}/read",
  MARK_ALL_AS_READ = "/api/notifications/read-all",
}

/**
 * route pour la gestion des niveaux
 */
export enum NiveauEndpoints {
  GET_ALL = "/api/niveaux",
  GET_ONE = "/api/niveaux/{niveauId}",
  UPDATE = "api/profile/update_niveau",
}

/**
 * route pour la gestion des contacts sur la page settings
 */
export enum ConctactAdminEndpoints {
  CONTACT = "/api/settings/contact-admin",
}

export enum DashboardEndpoints {
  STATS = "/api/eleves/{eleveId}/stats",
  DASHBOARD = "/api/eleves/{eleveId}/dashboard?period={period}",
  CLASSES = "/api/eleves/{eleveId}/classes",
}

/**
 * Endpoints relatifs au tracking du temps d'étude.
 */
export enum TrackingEndpoints {
  SAVE_TIME = "/api/tracking/time",
}

/**
 * Endpoints relatifs à la gestion des enfants pour les parents.
 */
export enum ParentEndpoints {
  GET_ENFANTS = "/api/parent/enfants",
  AJOUTER_ENFANT_MANUEL = "/api/parent/enfants/ajouter-manuel",
  SELECTIONNER_ENFANT = "/api/parent/enfants/selectionner",
  GET_ENFANT_ACTIF = "/api/parent/enfant-actif",
  AJOUTER_ENFANT_UTILISATEUR = "/api/parent/enfants/ajouter",
  RETIRER_ENFANT = "/api/parent/enfants/retirer",
  ASSOCIER_AUTOMATIQUEMENT = "/api/parent/enfants/associer-automatiquement",
  // Récupération de contenu pour l'enfant actif
  GET_ENFANT_GROUPES = "/api/parent/enfant/groupes",
  GET_ENFANT_QUIZ = "/api/parent/enfant/quiz",
  GET_ENFANT_COURS = "/api/parent/enfant/cours",
  GET_ENFANT_RESUME = "/api/parent/enfant/resume",
  // Dashboard parent
  GET_DASHBOARD = "/api/parents/{parentId}/dashboard",
}

/**
 * Endpoints relatifs à la gestion des notes de classe (élèves).
 */
export enum NoteClasseEndpoints {
  GET_ALL = "/api/notes-classe",
  CREATE = "/api/notes-classe",
  GET_ONE = "/api/notes-classe/{id}",
  UPDATE = "/api/notes-classe/{id}",
  GET_STATS = "/api/notes-classe/statistiques",
}

/**
 * Endpoints relatifs à la consultation des notes par les parents.
 */
export enum ParentNoteClasseEndpoints {
  GET_ALL = "/api/parent/notes-classe",
  GET_STATS = "/api/parent/notes-classe/statistiques",
  GET_ENFANTS = "/api/parent/notes-classe/enfants",
  GET_ENFANT_NOTES = "/api/parent/notes-classe/enfant/{enfantId}",
}

/**
 * Endpoints relatifs à la gestion des élèves pour les répétiteurs.
 */
export enum RepetiteurEndpoints {
  // Gestion des élèves
  GET_ELEVES = "/api/repetiteur/eleves",
  AJOUTER_ELEVE_MANUEL = "/api/repetiteur/eleves/ajouter-manuel",
  ASSOCIER_AUTOMATIQUEMENT = "/api/repetiteur/eleves/associer-automatiquement",
  RECHERCHER_ELEVE = "/api/repetiteur/eleves/rechercher",
  RETIRER_ELEVE = "/api/repetiteur/eleves/retirer",

  // Sélection d'élève
  SELECTIONNER_ELEVE = "/api/repetiteur/eleves/selectionner",
  GET_ELEVE_ACTIF = "/api/repetiteur/eleve-actif",

  // Statistiques et dashboard
  GET_STATS = "/api/repetiteurs/{id}/stats",
  GET_DASHBOARD = "/api/repetiteurs/{id}/dashboard",

  // Contenus de l'élève sélectionné
  GET_ELEVE_GROUPES = "/api/repetiteur/eleve/groupes",
  GET_ELEVE_QUIZ = "/api/repetiteur/eleve/quiz",
  GET_ELEVE_COURS = "/api/repetiteur/eleve/cours",
  GET_ELEVE_RESUME = "/api/repetiteur/eleve/resume",

  // Relations
  GET_REPETITEURS_ELEVE = "/api/eleve/repetiteurs",
  GET_RELATIONS_STATS = "/api/relations-repetiteur/statistiques",

  // Niveaux du répétiteur
  GET_NIVEAUX_CHOISIS = "/api/repetiteur/niveaux/choisis",
  DEFINIR_NIVEAUX = "/api/repetiteur/niveaux/definir",
}

/**
 * Endpoints relatifs à la gestion des élèves.
 */
export enum EleveEndpoints {
  CHECK_EMAIL = "/api/eleves/check",
}

/**
 * Endpoints relatifs à la gestion du planning d'études.
 */
export enum StudyPlanEndpoints {
  GET_ALL = "/api/study-plans",
  CREATE = "/api/study-plans",
  UPDATE = "/api/study-plans/{id}",
  DELETE = "/api/study-plans/{id}",
}

/**
 * Endpoints relatifs à la gestion des professeurs.
 */
export enum ProfesseurEndpoints {
  // Matières enseignées
  GET_SUBJECTS = "/api/prof/subjects",
  GET_SUBJECTS_GENERIC = "/api/prof/subjects/generic",
  SET_SUBJECTS = "/api/prof/subjects",

  // Classes - CRUD
  GET_CLASSES = "/api/prof/classes",
  CREATE_CLASS = "/api/prof/classes",
  GET_CLASS = "/api/prof/classes/{classe_id}",
  UPDATE_CLASS = "/api/prof/classes/{classe_id}",
  DEACTIVATE_CLASS = "/api/prof/classes/{classe_id}/deactivate",
  REACTIVATE_CLASS = "/api/prof/classes/{classe_id}/reactivate",

  // Gestion des élèves
  ADD_MEMBER = "/api/prof/classes/{classe_id}/members/add",
  DEACTIVATE_MEMBER = "/api/prof/classes/{classe_id}/members/{member_id}/deactivate",
  REACTIVATE_MEMBER = "/api/prof/classes/{classe_id}/members/{member_id}/reactivate",

  // Quiz de classe
  CREATE_MANUAL_QUIZ = "/api/prof/classes/{classe_id}/quizzes/manual",
  GENERATE_QUIZ = "/api/prof/classes/{classe_id}/quizzes/generate",
  UPDATE_QUIZ = "/api/prof/classes/{classe_id}/quizzes/{quiz_id}",
  ACTIVATE_QUIZ = "/api/prof/classes/{classe_id}/quizzes/{quiz_id}/activate",
  DEACTIVATE_QUIZ = "/api/prof/classes/{classe_id}/quizzes/{quiz_id}/deactivate",
  GET_QUIZ_NOTES = "/api/prof/quizzes/{quiz_id}/notes-eleves",

  // Cours de classe
  GET_COURSES = "/api/prof/cours",
  GET_COURSE = "/api/prof/cours/{cours_id}",
  CREATE_MANUAL_COURSE = "/api/prof/classes/{classe_id}/cours",
  GENERATE_COURSE = "/api/prof/classes/{classe_id}/courses/generate",
  // Cours Manuel
  UPDATE_COURSE_MANUAL = "/api/prof/classes/{classe_id}/cours/{cours_id}",
  // Cours IA
  UPDATE_COURSE_IA = "/api/prof/classes/{classe_id}/courses/{cours_id}",
  ACTIVATE_COURSE = "/api/prof/classes/{classe_id}/courses/{cours_id}/activate",
  DEACTIVATE_COURSE = "/api/prof/classes/{classe_id}/courses/{cours_id}/deactivate",
  UPLOAD_COURSE_IMAGE = "/api/prof/cours/upload-image",

  // Notes et évaluations
  SAVE_GRADES = "/api/prof/classes/{classe_id}/grades",
  CREATE_CLASS_EVALUATION = "/api/prof/classes/{classe_id}/class-evaluation",

  // Évaluations - CRUD
  CREATE_EVALUATION = "/api/prof/classes/{classe_id}/evaluations",
  GET_EVALUATIONS = "/api/prof/classes/{classe_id}/evaluations",
  GET_EVALUATION_NOTES = "/api/prof/classes/{classe_id}/evaluations/{evaluation_id}/notes",
  UPDATE_EVALUATION = "/api/prof/classes/{classe_id}/evaluations/{evaluation_id}",
  ADD_GRADES_TO_EVALUATION = "/api/prof/classes/{classe_id}/evaluations/{evaluation_id}/grades",

  // Grades - Modification
  UPDATE_GRADE = "/api/prof/classes/{classe_id}/grades/{note_id}",
  UPDATE_ALL_GRADES = "/api/prof/classes/{classe_id}/evaluations/{evaluation_id}/grades",

  // Membres de classe
  GET_CLASS_MEMBERS = "/api/prof/classes/{classe_id}/members",

  // Messages de classe
  GET_CLASS_MESSAGES = "/api/prof/classes/{classe_id}/messages",
  CREATE_CLASS_MESSAGE = "/api/prof/classes/{classe_id}/messages",
  UPDATE_CLASS_MESSAGE = "/api/prof/classes/{classe_id}/messages/{message_id}",
  TOGGLE_CLASS_MESSAGE = "/api/prof/classes/{classe_id}/messages/{message_id}/toggle",

  // Dashboard
  GET_DASHBOARD = "/api/prof/dashboard",
}
