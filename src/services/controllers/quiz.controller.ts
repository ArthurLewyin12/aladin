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
  AllQuizDefinitionsResponse,
  SingleQuizResponse,
  QuizQuestion,
  ApprofondissementQuestion,
} from "./types/common/quiz.types";
import { GroupQuizzesResponse } from "./types/common/groupe-quiz.types";

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
  const response = await request.post<any>(
    QuizEndpoints.QUIZ_GENERATE,
    payload,
  );

  // Manually transform the data to fit the frontend types
  const transformedQuestions = response.questions.map(
    (question: any, index: number) => {
      // Handle cases where propositions might be an object or an array
      const propositionsArray = Array.isArray(question.propositions)
        ? question.propositions
        : Object.entries(question.propositions).map(([key, value]) => ({
            id: key,
            text: value,
          }));

      const propositions = propositionsArray.map(
        (proposition: any, propIndex: number) => ({
          id: proposition.id ?? propIndex,
          text: proposition.text || proposition,
        }),
      );

      return {
        id: `q_${index}`,
        question: question.question,
        propositions: propositions,
        bonne_reponse_id: question.bonne_reponse,
      };
    },
  );

  return {
    ...response,
    questions: transformedQuestions,
  };
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
 * Récupère tous les quiz définis dans le système pour l'année en cours pour l'utilisateur.
 * @returns QUizDefinitionsResponse - Liste de tous les quiz définis dans le système pour l'année en cours pour le user.
 */

export const getAllUserQuiz = async (): Promise<{
  quizzes: AllQuizDefinitionsResponse[];
}> => {
  return request.get<{ quizzes: AllQuizDefinitionsResponse[] }>(
    QuizEndpoints.QUIZ_GET_ALL,
  );
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
export const getQuizNotes = async (
  quizId: number,
): Promise<QuizNotesResponse> => {
  const endpoint = QuizEndpoints.QUIZ_NOTES.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.get<QuizNotesResponse>(endpoint);
};

/**
 * Desactive un quiz spécifique.
 * @param {number} quizId - L'ID du quiz à desactiver.
 * @returns {Promise<void>}
 */
export const deactivateQuiz = async (quizId: number): Promise<void> => {
  const endpoint = QuizEndpoints.DESACTIVATE_QUIZ.replace(
    "{quizId}",
    quizId.toString(),
  );
  return request.post<void>(endpoint);
};

/**
 * Reactive un quiz spécifique.
 * @param {number} quizId - L'ID du quiz à reactiver.
 * @returns {Promise<void>}
 */
export const reactivateQuiz = async (quizId: number): Promise<void> => {
  const endpoint = QuizEndpoints.REACTIVATE_QUIZ.replace(
    "{quizId}",
    quizId.toString(),
  );
  return request.post<void>(endpoint);
};

/**
 * permet de recuperer un quiz que l'utilisateur a deja généré
 * @param quizId
 * @returns un quiz unique
 */
export const singleQuiz = async (
  quizId: number,
): Promise<SingleQuizResponse> => {
  const endpoint = QuizEndpoints.GET_ONE_QUIZ.replace(
    "{quizId}",
    quizId.toString(),
  );

  const rawResponse = await request.get<any>(endpoint); // Fetch raw response

  // Transform questions
  const transformedQuestions = rawResponse.quiz.questions.map(
    (question: any, index: number) => {
      const propositionsArray = Array.isArray(question.propositions)
        ? question.propositions
        : Object.entries(question.propositions).map(([key, value]) => ({
            id: key,
            text: value,
          }));

      const propositions = propositionsArray.map(
        (proposition: any, propIndex: number) => ({
          id: proposition.id ?? propIndex,
          text: proposition.text || proposition,
        }),
      );

      return {
        id: `q_${index}`,
        question: question.question,
        propositions: propositions,
        bonne_reponse_id: question.bonne_reponse, // bonne_reponse is 'a', 'b', 'c' from API
      };
    },
  );

  // Transform questions_approfondissement
  const transformedApprofondissement =
    rawResponse.quiz.questions_approfondissement.map((q: any) => ({
      question: q.question,
      reponse: q.reponse,
    }));

  return {
    quiz: {
      ...rawResponse.quiz,
      questions: transformedQuestions,
      questions_approfondissement: transformedApprofondissement,
    },
  };
};

/**
 * Récupère tous les quiz de groupe de l'utilisateur
 * @returns {Promise<GroupQuizzesResponse>} La liste des quiz de groupe
 */
export const getGroupQuizzes = async (): Promise<GroupQuizzesResponse> => {
  return request.get<GroupQuizzesResponse>("/api/eleve/group-quizzes");
};
