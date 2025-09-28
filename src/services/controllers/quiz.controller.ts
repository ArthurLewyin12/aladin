import { request } from "@/lib/request";
import { QuizEndpoints } from "@/constants/endpoints";
import {
  UserQuizInstance,
  QuizHistory,
  QuizSubmitPayload,
  QuizGeneratePayload,
  QuizGenerateResponse,
  QuizStartResponse,
  QuizSubmitResponse,
  QuizNotesResponse,
} from "./types/common";

/**
 * Récupère l'historique des quiz passés par l'utilisateur.
 * @returns {Promise<QuizHistory>} L'historique des quiz.
 */
export const getQuizHistory = async (): Promise<QuizHistory> => {
  return request.get<QuizHistory>(QuizEndpoints.QUIZ_HISTORY);
};

/**
 * Génère un nouveau quiz basé sur les paramètres fournis.
 * @param {QuizGeneratePayload} payload - Les options de génération du quiz (matière, chapitres, etc.).
 * @returns {Promise<QuizGenerateResponse>} La réponse de l'API contenant les informations du quiz généré.
 */
export const generateQuiz = async (
  payload: QuizGeneratePayload,
): Promise<QuizGenerateResponse> => {
  return request.post<QuizGenerateResponse>(
    QuizEndpoints.QUIZ_GENERATE,
    payload,
  );
};

/**
 * Démarre une session de quiz.
 * @param {number} quizId - L'ID du quiz à démarrer.
 * @returns {Promise<QuizStartResponse>} La réponse de l'API, incluant les détails de la session.
 */
export const startQuiz = async (quizId: number): Promise<QuizStartResponse> => {
  const endpoint = QuizEndpoints.QUIZ_START.replace(
    "{quizId}",
    quizId.toString(),
  );
  return request.get<QuizStartResponse>(endpoint);
};

/**
 * Récupère les détails d'une instance de quiz spécifique.
 * @param {number} quizId - L'ID du quiz à récupérer.
 * @returns {Promise<UserQuizInstance>} Les détails de l'instance du quiz.
 */
export const getQuiz = async (quizId: number): Promise<UserQuizInstance> => {
  const endpoint = QuizEndpoints.QUIZ_GET.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.get<UserQuizInstance>(endpoint);
};

/**
 * Supprime un quiz spécifique.
 * @param {number} quizId - L'ID du quiz à supprimer.
 * @returns {Promise<void>}
 */
export const deleteQuiz = async (quizId: number): Promise<void> => {
  const endpoint = QuizEndpoints.QUIZ_DELETE.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.delete<void>(endpoint);
};

/**
 * Soumet les réponses d'un quiz pour évaluation.
 * @param {number} quizId - L'ID du quiz à soumettre.
 * @param {QuizSubmitPayload} payload - Les réponses de l'utilisateur.
 * @returns {Promise<QuizSubmitResponse>} La réponse de l'API après soumission.
 */
export const submitQuiz = async (
  quizId: number,
  payload: QuizSubmitPayload,
): Promise<QuizSubmitResponse> => {
  const endpoint = QuizEndpoints.QUIZ_SUBMIT.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.post<QuizSubmitResponse>(endpoint, payload);
};

/**
 * Récupère les notes et résultats d'un quiz terminé.
 * @param {number} quizId - L'ID du quiz.
 * @returns {Promise<QuizNotesResponse>} Les notes et résultats du quiz.
 */
export const getQuizNotes = async (quizId: number): Promise<QuizNotesResponse> => {
  const endpoint = QuizEndpoints.QUIZ_NOTES.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.get<QuizNotesResponse>(endpoint);
};
