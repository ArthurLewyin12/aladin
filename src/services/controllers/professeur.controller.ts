import { request } from "@/lib/request";
import {
  ProfesseurEndpoints,
  EleveEndpoints,
  QuizEndpoints,
  CourseEndpoints,
} from "@/constants/endpoints";
import { PromiseExecutor } from "@/lib/promise-executor";
import {
  GetSubjectsResponse,
  GetSubjectsGenericResponse,
  SetSubjectsPayload,
  SetSubjectsResponse,
  GetClassesResponse,
  CreateClassePayload,
  CreateClasseResponse,
  GetClasseResponse,
  GetClasseRawResponse,
  UpdateClassePayload,
  UpdateClasseResponse,
  DeactivateClasseResponse,
  ReactivateClasseResponse,
  CheckEleveResponse,
  AddMemberPayload,
  AddMemberResponse,
  DeactivateMemberResponse,
  ReactivateMemberResponse,
  CreateManualQuizPayload,
  CreateManualQuizResponse,
  GenerateQuizPayload,
  GenerateQuizResponse,
  UpdateQuizPayload,
  UpdateQuizResponse,
  ActivateQuizResponse,
  DeactivateQuizResponse,
  GetQuizNotesResponse,
  CreateManualCoursePayload,
  CreateManualCourseResponse,
  GenerateCoursePayload,
  GenerateCourseResponse,
  UpdateCoursePayload,
  UpdateCourseResponse,
  ActivateCourseResponse,
  DeactivateCourseResponse,
  UploadCourseImagePayload,
  UploadCourseImageResponse,
  SaveGradesPayload,
  SaveGradesResponse,
  CreateClassEvaluationPayload,
  CreateClassEvaluationResponse,
  GetClassMembersResponse,
  CreateEvaluationPayload,
  CreateEvaluationResponse,
  GetEvaluationsResponse,
  GetEvaluationNotesResponse,
  AddGradesToEvaluationPayload,
  AddGradesToEvaluationResponse,
  UpdateEvaluationPayload,
  UpdateEvaluationResponse,
  UpdateGradePayload,
  UpdateGradeResponse,
  UpdateAllGradesPayload,
  UpdateAllGradesResponse,
  GetClassMessagesResponse,
  CreateClassMessagePayload,
  CreateClassMessageResponse,
  UpdateClassMessagePayload,
  UpdateClassMessageResponse,
  ToggleClassMessageResponse,
} from "./types/common/professeur.types";

/**
 * ===============================
 * MATIÈRES ENSEIGNÉES
 * ===============================
 */

/**
 * Récupère les matières enseignées par le professeur.
 * @returns {Promise<GetSubjectsResponse>} Liste des matières avec compteur et maximum.
 */
export const getSubjects = async (): Promise<GetSubjectsResponse> => {
  return request.get<GetSubjectsResponse>(ProfesseurEndpoints.GET_SUBJECTS);
};

/**
 * Récupère toutes les matières disponibles sans filtrage par niveau.
 * @returns {Promise<GetSubjectsGenericResponse>} Liste de toutes les matières disponibles.
 */
export const getSubjectsGeneric =
  async (): Promise<GetSubjectsGenericResponse> => {
    return request.get<GetSubjectsGenericResponse>(
      ProfesseurEndpoints.GET_SUBJECTS_GENERIC,
    );
  };

/**
 * Définit les matières enseignées par le professeur.
 * @param {SetSubjectsPayload} payload - Liste des IDs de matières (max 3).
 * @returns {Promise<SetSubjectsResponse>} Confirmation et liste mise à jour.
 */
export const setSubjects = async (
  payload: SetSubjectsPayload,
): Promise<SetSubjectsResponse> => {
  return request.post<SetSubjectsResponse>(
    ProfesseurEndpoints.SET_SUBJECTS,
    payload,
  );
};

/**
 * ===============================
 * CLASSES - CRUD
 * ===============================
 */

/**
 * Récupère toutes les classes du professeur.
 * @returns {Promise<GetClassesResponse>} Liste des classes.
 */
export const getClasses = async (): Promise<GetClassesResponse> => {
  return request.get<GetClassesResponse>(ProfesseurEndpoints.GET_CLASSES);
};

/**
 * Récupère toutes les classes du professeur avec leurs détails (membres) en parallèle.
 * Utilise PromiseExecutor pour paralléliser les appels API.
 * @returns {Promise<GetClasseResponse[]>} Liste des classes avec leurs membres.
 */
export const getClassesWithDetails = async (): Promise<GetClasseResponse[]> => {
  // Récupérer la liste des classes
  const classes = await getClasses();

  // Si aucune classe, retourner un tableau vide
  if (!classes || classes.length === 0) {
    return [];
  }

  // Filtrer les classes sans ID valide
  const validClasses = classes.filter((classe) => classe && classe.id != null);

  if (validClasses.length === 0) {
    return [];
  }

  // Créer un PromiseExecutor pour paralléliser les appels
  const executor = new PromiseExecutor();

  // Ajouter chaque appel pour récupérer les détails d'une classe
  // Gérer les erreurs individuellement pour ne pas faire échouer toutes les requêtes
  validClasses.forEach((classe) => {
    executor.add(
      `classe_${classe.id}`,
      getClasse(classe.id).catch((error) => {
        console.error(
          `Erreur lors de la récupération de la classe ${classe.id}:`,
          error,
        );
        // Retourner la classe de base sans détails en cas d'erreur
        return {
          ...classe,
          members: [],
        } as GetClasseResponse;
      }),
    );
  });

  // Exécuter tous les appels en parallèle
  const results = await executor.execute();

  // Reconstruire le tableau dans l'ordre initial avec les détails
  // Filtrer les valeurs undefined/null
  return validClasses
    .map((classe) => {
      const detail = results[`classe_${classe.id}`];
      // Si on a des détails, les utiliser, sinon retourner la classe de base avec members vide
      return detail || { ...classe, members: [] };
    })
    .filter(
      (classe): classe is GetClasseResponse =>
        classe != null && classe.id != null,
    );
};

/**
 * Crée une nouvelle classe.
 * @param {CreateClassePayload} payload - Données de la classe (nom, description, niveau, matières).
 * @returns {Promise<CreateClasseResponse>} Confirmation et données de la classe créée.
 */
export const createClasse = async (
  payload: CreateClassePayload,
): Promise<CreateClasseResponse> => {
  return request.post<CreateClasseResponse>(
    ProfesseurEndpoints.CREATE_CLASS,
    payload,
  );
};

/**
 * Récupère les détails d'une classe spécifique.
 * @param {number} classeId - ID de la classe.
 * @returns {Promise<GetClasseResponse>} Détails de la classe avec ses membres.
 */
export const getClasse = async (
  classeId: number,
): Promise<GetClasseResponse> => {
  const endpoint = ProfesseurEndpoints.GET_CLASS.replace(
    "{classe_id}",
    classeId.toString(),
  );
  const rawResponse = await request.get<GetClasseRawResponse>(endpoint);

  // Transformer la réponse brute en format normalisé
  // Si la réponse a déjà la structure attendue (avec members), la retourner telle quelle
  if ("members" in rawResponse && Array.isArray((rawResponse as any).members)) {
    return rawResponse as unknown as GetClasseResponse;
  }

  // Transformer la structure avec eleves en members
  const normalizedResponse: GetClasseResponse = {
    ...rawResponse.classe,
    members:
      rawResponse.eleves?.map((eleve: any) => ({
        id: eleve.id, // Utiliser l'id de l'élève comme id de membre temporairement
        eleve_id: eleve.id,
        classe_id: rawResponse.classe.id,
        is_active: eleve.is_active,
        eleve: {
          id: eleve.id,
          nom: eleve.nom,
          prenom: eleve.prenom,
          email: eleve.mail,
          numero: eleve.numero,
          parent_mail: eleve.parent_mail,
          parent_numero: eleve.parent_numero,
          niveau_id: eleve.niveau?.id,
          type: "utilisateur" as const,
          user_id: eleve.id,
          is_active: eleve.is_active,
        },
      })) || [],
    niveau: rawResponse.niveau
      ? {
          ...rawResponse.niveau,
          matieres: [],
          created_at: rawResponse.niveau.created_at || " ",
          updated_at: rawResponse.niveau.updated_at || " ",
        }
      : undefined,
    quizzes: rawResponse.quizzes || [],
    matieres:
      rawResponse.matieres
        ?.filter((m) => m.niveau_id !== undefined)
        .map((m) => ({
          ...m,
          niveau_id: m.niveau_id as number,
          created_at: " ",
          updated_at: " ",
        })) || [],
  };

  return normalizedResponse;
};

/**
 * Met à jour une classe existante.
 * @param {number} classeId - ID de la classe.
 * @param {UpdateClassePayload} payload - Données à mettre à jour.
 * @returns {Promise<UpdateClasseResponse>} Confirmation et données mises à jour.
 */
export const updateClasse = async (
  classeId: number,
  payload: UpdateClassePayload,
): Promise<UpdateClasseResponse> => {
  const endpoint = ProfesseurEndpoints.UPDATE_CLASS.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.put<UpdateClasseResponse>(endpoint, payload);
};

/**
 * Désactive une classe.
 * @param {number} classeId - ID de la classe.
 * @returns {Promise<DeactivateClasseResponse>} Message de confirmation.
 */
export const deactivateClasse = async (
  classeId: number,
): Promise<DeactivateClasseResponse> => {
  const endpoint = ProfesseurEndpoints.DEACTIVATE_CLASS.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.post<DeactivateClasseResponse>(endpoint);
};

/**
 * Réactive une classe.
 * @param {number} classeId - ID de la classe.
 * @returns {Promise<ReactivateClasseResponse>} Message de confirmation.
 */
export const reactivateClasse = async (
  classeId: number,
): Promise<ReactivateClasseResponse> => {
  const endpoint = ProfesseurEndpoints.REACTIVATE_CLASS.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.post<ReactivateClasseResponse>(endpoint);
};

/**
 * ===============================
 * GESTION DES ÉLÈVES
 * ===============================
 */

/**
 * Vérifie si un email correspond à un élève existant.
 * @param {string} email - Email de l'élève.
 * @returns {Promise<CheckEleveResponse>} Informations sur l'élève si existant.
 */
export const checkEleve = async (
  email: string,
): Promise<CheckEleveResponse> => {
  const endpoint = `${EleveEndpoints.CHECK_EMAIL}?email=${encodeURIComponent(email)}`;
  return request.get<CheckEleveResponse>(endpoint);
};

/**
 * Ajoute un élève à une classe (utilisateur existant ou création manuelle).
 * @param {number} classeId - ID de la classe.
 * @param {AddMemberPayload} payload - Données de l'élève.
 * @returns {Promise<AddMemberResponse>} Confirmation et données du membre ajouté.
 */
export const addMember = async (
  classeId: number,
  payload: AddMemberPayload,
): Promise<AddMemberResponse> => {
  const endpoint = ProfesseurEndpoints.ADD_MEMBER.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.post<AddMemberResponse>(endpoint, payload);
};

/**
 * Désactive un membre d'une classe.
 * @param {number} classeId - ID de la classe.
 * @param {number} memberId - ID du membre.
 * @returns {Promise<DeactivateMemberResponse>} Message de confirmation.
 */
export const deactivateMember = async (
  classeId: number,
  memberId: number,
): Promise<DeactivateMemberResponse> => {
  const endpoint = ProfesseurEndpoints.DEACTIVATE_MEMBER.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{member_id}", memberId.toString());
  return request.post<DeactivateMemberResponse>(endpoint);
};

/**
 * Réactive un membre d'une classe.
 * @param {number} classeId - ID de la classe.
 * @param {number} memberId - ID du membre.
 * @returns {Promise<ReactivateMemberResponse>} Message de confirmation.
 */
export const reactivateMember = async (
  classeId: number,
  memberId: number,
): Promise<ReactivateMemberResponse> => {
  const endpoint = ProfesseurEndpoints.REACTIVATE_MEMBER.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{member_id}", memberId.toString());
  return request.post<ReactivateMemberResponse>(endpoint);
};

/**
 * ===============================
 * QUIZ DE CLASSE
 * ===============================
 */

/**
 * Crée un quiz manuel pour une classe.
 * @param {number} classeId - ID de la classe.
 * @param {CreateManualQuizPayload} payload - Données du quiz.
 * @returns {Promise<CreateManualQuizResponse>} Confirmation et données du quiz créé.
 */
export const createManualQuiz = async (
  classeId: number,
  payload: CreateManualQuizPayload,
): Promise<CreateManualQuizResponse> => {
  const endpoint = ProfesseurEndpoints.CREATE_MANUAL_QUIZ.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.post<CreateManualQuizResponse>(endpoint, payload);
};

/**
 * Génère un quiz avec IA pour une classe.
 * @param {number} classeId - ID de la classe.
 * @param {GenerateQuizPayload} payload - Paramètres de génération (avec fichier optionnel).
 * @returns {Promise<GenerateQuizResponse>} Confirmation et données du quiz généré.
 */
export const generateQuiz = async (
  classeId: number,
  payload: GenerateQuizPayload,
): Promise<GenerateQuizResponse> => {
  // Utiliser la route standard /api/quizzes/generate avec classe_id dans le payload
  const endpoint = QuizEndpoints.QUIZ_GENERATE;

  // Si un fichier est présent, utiliser FormData
  if (payload.document_file) {
    return request.postFormData<GenerateQuizResponse>(endpoint, {
      chapter_id: payload.chapter_id,
      difficulty: payload.difficulty,
      title: payload.title,
      nombre_questions: payload.nombre_questions,
      temps: payload.temps,
      classe_id: classeId,
      document_file: payload.document_file,
    });
  } else {
    // Sinon, envoi JSON classique
    return request.post<GenerateQuizResponse>(endpoint, {
      chapter_id: payload.chapter_id,
      difficulty: payload.difficulty,
      title: payload.title,
      nombre_questions: payload.nombre_questions,
      temps: payload.temps,
      classe_id: classeId,
    });
  }
};

/**
 * Met à jour un quiz de classe.
 * @param {number} classeId - ID de la classe.
 * @param {number} quizId - ID du quiz.
 * @param {UpdateQuizPayload} payload - Données à mettre à jour.
 * @returns {Promise<UpdateQuizResponse>} Confirmation et données mises à jour.
 */
export const updateQuiz = async (
  classeId: number,
  quizId: number,
  payload: UpdateQuizPayload,
): Promise<UpdateQuizResponse> => {
  const endpoint = ProfesseurEndpoints.UPDATE_QUIZ.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{quiz_id}", quizId.toString());
  return request.put<UpdateQuizResponse>(endpoint, payload);
};

/**
 * Active un quiz de classe (envoie notifications aux élèves).
 * @param {number} classeId - ID de la classe.
 * @param {number} quizId - ID du quiz.
 * @returns {Promise<ActivateQuizResponse>} Message de confirmation.
 */
export const activateQuiz = async (
  classeId: number,
  quizId: number,
): Promise<ActivateQuizResponse> => {
  const endpoint = ProfesseurEndpoints.ACTIVATE_QUIZ.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{quiz_id}", quizId.toString());
  return request.post<ActivateQuizResponse>(endpoint);
};

/**
 * Désactive un quiz de classe.
 * @param {number} classeId - ID de la classe.
 * @param {number} quizId - ID du quiz.
 * @returns {Promise<DeactivateQuizResponse>} Message de confirmation.
 */
export const deactivateQuiz = async (
  classeId: number,
  quizId: number,
): Promise<DeactivateQuizResponse> => {
  const endpoint = ProfesseurEndpoints.DEACTIVATE_QUIZ.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{quiz_id}", quizId.toString());
  return request.post<DeactivateQuizResponse>(endpoint);
};

/**
 * Récupère les notes d'un quiz de classe.
 * @param {number} classeId - ID de la classe.
 * @param {number} quizId - ID du quiz.
 * @returns {Promise<GetQuizNotesResponse>} Détails du quiz avec les notes.
 */
export const getQuizNotes = async (
  classeId: number,
  quizId: number,
): Promise<GetQuizNotesResponse> => {
  const endpoint = ProfesseurEndpoints.GET_QUIZ_NOTES.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{quiz_id}", quizId.toString());
  return request.get<GetQuizNotesResponse>(endpoint);
};

/**
 * ===============================
 * COURS DE CLASSE
 * ===============================
 */

/**
 * Récupère la liste des cours du professeur.
 * @returns {Promise<any>} Liste des cours.
 */
export const getCourses = async (): Promise<any> => {
  return request.get<any>(ProfesseurEndpoints.GET_COURSES);
};

/**
 * Récupère un cours spécifique par son ID.
 * @param {number} coursId - ID du cours.
 * @returns {Promise<any>} Détails du cours.
 */
export const getCourse = async (coursId: number): Promise<any> => {
  const endpoint = ProfesseurEndpoints.GET_COURSE.replace(
    "{cours_id}",
    coursId.toString(),
  );
  return request.get<any>(endpoint);
};

/**
 * Crée un cours manuel pour une classe.
 * @param {number} classeId - ID de la classe.
 * @param {CreateManualCoursePayload} payload - Données du cours.
 * @returns {Promise<CreateManualCourseResponse>} Confirmation et données du cours créé.
 */
export const createManualCourse = async (
  classeId: number,
  payload: CreateManualCoursePayload,
): Promise<CreateManualCourseResponse> => {
  const endpoint = ProfesseurEndpoints.CREATE_MANUAL_COURSE.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.post<CreateManualCourseResponse>(endpoint, payload);
};

/**
 * Génère un cours avec IA pour une classe.
 * @param {number} classeId - ID de la classe.
 * @param {GenerateCoursePayload} payload - Paramètres de génération (avec fichier optionnel).
 * @returns {Promise<GenerateCourseResponse>} Confirmation et données du cours généré.
 */
export const generateCourse = async (
  classeId: number,
  payload: GenerateCoursePayload,
): Promise<GenerateCourseResponse> => {
  // Utiliser la route standard /api/cours/expliquer avec classe_id dans le payload
  const endpoint = CourseEndpoints.COURSES_BY_CHAPITRE;

  // Si un fichier est présent, utiliser FormData
  if (payload.document_file) {
    return request.postFormData<GenerateCourseResponse>(
      endpoint,
      {
        chapter_id: payload.chapter_id,
        classe_id: classeId,
        document_file: payload.document_file,
      },
      { timeout: 180000 },
    );
  } else {
    // Sinon, envoi JSON classique
    return request.post<GenerateCourseResponse>(
      endpoint,
      {
        chapter_id: payload.chapter_id,
        classe_id: classeId,
      },
      { timeout: 180000 },
    );
  }
};

/**
 * Met à jour un cours de classe.
 * @param {number} classeId - ID de la classe.
 * @param {number} coursId - ID du cours.
 * @param {UpdateCoursePayload} payload - Données à mettre à jour.
 * @returns {Promise<UpdateCourseResponse>} Confirmation et données mises à jour.
 */
export const updateCourse = async (
  classeId: number,
  coursId: number,
  payload: UpdateCoursePayload,
): Promise<UpdateCourseResponse> => {
  const endpoint = ProfesseurEndpoints.UPDATE_COURSE.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{cours_id}", coursId.toString());
  return request.put<UpdateCourseResponse>(endpoint, payload);
};

/**
 * Active un cours de classe (envoie notifications aux élèves).
 * @param {number} classeId - ID de la classe.
 * @param {number} coursId - ID du cours.
 * @returns {Promise<ActivateCourseResponse>} Message de confirmation.
 */
export const activateCourse = async (
  classeId: number,
  coursId: number,
): Promise<ActivateCourseResponse> => {
  const endpoint = ProfesseurEndpoints.ACTIVATE_COURSE.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{cours_id}", coursId.toString());
  return request.post<ActivateCourseResponse>(endpoint);
};

/**
 * Désactive un cours de classe.
 * @param {number} classeId - ID de la classe.
 * @param {number} coursId - ID du cours.
 * @returns {Promise<DeactivateCourseResponse>} Message de confirmation.
 */
export const deactivateCourse = async (
  classeId: number,
  coursId: number,
): Promise<DeactivateCourseResponse> => {
  const endpoint = ProfesseurEndpoints.DEACTIVATE_COURSE.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{cours_id}", coursId.toString());
  return request.post<DeactivateCourseResponse>(endpoint);
};

/**
 * Upload une image pour un cours.
 * @param {File} image - Fichier image à uploader.
 * @param {number} [coursId] - ID du cours (optionnel).
 * @returns {Promise<UploadCourseImageResponse>} URL et informations de l'image uploadée.
 */
export const uploadCourseImage = async (
  image: File,
  coursId?: number,
): Promise<UploadCourseImageResponse> => {
  return request.postFormData<UploadCourseImageResponse>(
    ProfesseurEndpoints.UPLOAD_COURSE_IMAGE,
    {
      image,
      ...(coursId && { cours_id: coursId }),
    },
  );
};

/**
 * ===============================
 * NOTES ET ÉVALUATIONS
 * ===============================
 */

/**
 * Enregistre les notes d'un quiz en masse.
 * @param {number} classeId - ID de la classe.
 * @param {SaveGradesPayload} payload - Données des notes.
 * @returns {Promise<SaveGradesResponse>} Confirmation et liste des notes créées.
 */
export const saveGrades = async (
  classeId: number,
  payload: SaveGradesPayload,
): Promise<SaveGradesResponse> => {
  const endpoint = ProfesseurEndpoints.SAVE_GRADES.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.post<SaveGradesResponse>(endpoint, payload);
};

/**
 * Crée une évaluation de classe (devoir, contrôle, etc.).
 * @param {number} classeId - ID de la classe.
 * @param {CreateClassEvaluationPayload} payload - Données de l'évaluation.
 * @returns {Promise<CreateClassEvaluationResponse>} Confirmation et liste des notes créées.
 */
export const createClassEvaluation = async (
  classeId: number,
  payload: CreateClassEvaluationPayload,
): Promise<CreateClassEvaluationResponse> => {
  const endpoint = ProfesseurEndpoints.CREATE_CLASS_EVALUATION.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.post<CreateClassEvaluationResponse>(endpoint, payload);
};

/**
 * Récupère les élèves d'une classe.
 * @param {number} classeId - ID de la classe.
 * @returns {Promise<GetClassMembersResponse>} Liste des élèves de la classe.
 */
export const getClassMembers = async (
  classeId: number,
): Promise<GetClassMembersResponse> => {
  const endpoint = ProfesseurEndpoints.GET_CLASS_MEMBERS.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.get<GetClassMembersResponse>(endpoint);
};

/**
 * Crée une évaluation (sans notes).
 * @param {number} classeId - ID de la classe.
 * @param {CreateEvaluationPayload} payload - Données de l'évaluation.
 * @returns {Promise<CreateEvaluationResponse>} L'évaluation créée.
 */
export const createEvaluation = async (
  classeId: number,
  payload: CreateEvaluationPayload,
): Promise<CreateEvaluationResponse> => {
  const endpoint = ProfesseurEndpoints.CREATE_CLASS_EVALUATION.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.post<CreateEvaluationResponse>(endpoint, payload);
};

/**
 * Récupère les évaluations d'une classe.
 * @param {number} classeId - ID de la classe.
 * @returns {Promise<GetEvaluationsResponse>} Liste des évaluations.
 */
export const getEvaluations = async (
  classeId: number,
): Promise<GetEvaluationsResponse> => {
  const endpoint = ProfesseurEndpoints.GET_EVALUATIONS.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.get<GetEvaluationsResponse>(endpoint);
};

/**
 * Récupère les notes d'une évaluation.
 * @param {number} classeId - ID de la classe.
 * @param {number} evaluationId - ID de l'évaluation.
 * @returns {Promise<GetEvaluationNotesResponse>} Les notes de l'évaluation.
 */
export const getEvaluationNotes = async (
  classeId: number,
  evaluationId: number,
): Promise<GetEvaluationNotesResponse> => {
  const endpoint = ProfesseurEndpoints.GET_EVALUATION_NOTES.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{evaluation_id}", evaluationId.toString());
  return request.get<GetEvaluationNotesResponse>(endpoint);
};

/**
 * Met à jour une évaluation.
 * @param {number} classeId - ID de la classe.
 * @param {number} evaluationId - ID de l'évaluation.
 * @param {UpdateEvaluationPayload} payload - Données à mettre à jour.
 * @returns {Promise<UpdateEvaluationResponse>} L'évaluation mise à jour.
 */
export const updateEvaluation = async (
  classeId: number,
  evaluationId: number,
  payload: UpdateEvaluationPayload,
): Promise<UpdateEvaluationResponse> => {
  const endpoint = ProfesseurEndpoints.UPDATE_EVALUATION.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{evaluation_id}", evaluationId.toString());
  return request.put<UpdateEvaluationResponse>(endpoint, payload);
};

/**
 * Ajoute des notes à une évaluation existante.
 * @param {number} classeId - ID de la classe.
 * @param {number} evaluationId - ID de l'évaluation.
 * @param {AddGradesToEvaluationPayload} payload - Les notes à ajouter.
 * @returns {Promise<AddGradesToEvaluationResponse>} Les notes ajoutées.
 */
export const addGradesToEvaluation = async (
  classeId: number,
  evaluationId: number,
  payload: AddGradesToEvaluationPayload,
): Promise<AddGradesToEvaluationResponse> => {
  const endpoint = ProfesseurEndpoints.ADD_GRADES_TO_EVALUATION.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{evaluation_id}", evaluationId.toString());
  return request.post<AddGradesToEvaluationResponse>(endpoint, payload);
};

/**
 * Met à jour une note individuelle.
 * @param {number} classeId - ID de la classe.
 * @param {number} noteId - ID de la note.
 * @param {UpdateGradePayload} payload - La nouvelle note.
 * @returns {Promise<UpdateGradeResponse>} La note mise à jour.
 */
export const updateGrade = async (
  classeId: number,
  noteId: number,
  payload: UpdateGradePayload,
): Promise<UpdateGradeResponse> => {
  const endpoint = ProfesseurEndpoints.UPDATE_GRADE.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{note_id}", noteId.toString());
  return request.put<UpdateGradeResponse>(endpoint, payload);
};

/**
 * Met à jour toutes les notes d'une évaluation.
 * @param {number} classeId - ID de la classe.
 * @param {number} evaluationId - ID de l'évaluation.
 * @param {UpdateAllGradesPayload} payload - Les notes à mettre à jour.
 * @returns {Promise<UpdateAllGradesResponse>} Les notes mises à jour avec erreurs éventuelles.
 */
export const updateAllGrades = async (
  classeId: number,
  evaluationId: number,
  payload: UpdateAllGradesPayload,
): Promise<UpdateAllGradesResponse> => {
  const endpoint = ProfesseurEndpoints.UPDATE_ALL_GRADES.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{evaluation_id}", evaluationId.toString());
  return request.put<UpdateAllGradesResponse>(endpoint, payload);
};

/**
 * ===============================
 * MESSAGES DE CLASSE
 * ===============================
 */

/**
 * Récupère les messages d'une classe.
 * @param {number} classeId - ID de la classe.
 * @returns {Promise<GetClassMessagesResponse>} Liste des messages.
 */
export const getClassMessages = async (
  classeId: number,
): Promise<GetClassMessagesResponse> => {
  const endpoint = ProfesseurEndpoints.GET_CLASS_MESSAGES.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.get<GetClassMessagesResponse>(endpoint);
};

/**
 * Crée un message pour une classe.
 * @param {number} classeId - ID de la classe.
 * @param {CreateClassMessagePayload} payload - Données du message.
 * @returns {Promise<CreateClassMessageResponse>} Le message créé.
 */
export const createClassMessage = async (
  classeId: number,
  payload: CreateClassMessagePayload,
): Promise<CreateClassMessageResponse> => {
  const endpoint = ProfesseurEndpoints.CREATE_CLASS_MESSAGE.replace(
    "{classe_id}",
    classeId.toString(),
  );
  return request.post<CreateClassMessageResponse>(endpoint, payload);
};

/**
 * Met à jour un message de classe.
 * @param {number} classeId - ID de la classe.
 * @param {number} messageId - ID du message.
 * @param {UpdateClassMessagePayload} payload - Données à mettre à jour.
 * @returns {Promise<UpdateClassMessageResponse>} Le message mis à jour.
 */
export const updateClassMessage = async (
  classeId: number,
  messageId: number,
  payload: UpdateClassMessagePayload,
): Promise<UpdateClassMessageResponse> => {
  const endpoint = ProfesseurEndpoints.UPDATE_CLASS_MESSAGE.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{message_id}", messageId.toString());
  return request.put<UpdateClassMessageResponse>(endpoint, payload);
};

/**
 * Active/désactive un message de classe.
 * @param {number} classeId - ID de la classe.
 * @param {number} messageId - ID du message.
 * @returns {Promise<ToggleClassMessageResponse>} Le nouveau statut du message.
 */
export const toggleClassMessage = async (
  classeId: number,
  messageId: number,
): Promise<ToggleClassMessageResponse> => {
  const endpoint = ProfesseurEndpoints.TOGGLE_CLASS_MESSAGE.replace(
    "{classe_id}",
    classeId.toString(),
  ).replace("{message_id}", messageId.toString());
  return request.post<ToggleClassMessageResponse>(endpoint);
};
