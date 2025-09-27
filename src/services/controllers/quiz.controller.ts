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

export const getQuizHistory = async (): Promise<QuizHistory> => {
  return request.get<QuizHistory>(QuizEndpoints.QUIZ_HISTORY);
};

export const generateQuiz = async (
  payload: QuizGeneratePayload,
): Promise<QuizGenerateResponse> => {
  return request.post<QuizGenerateResponse>(
    QuizEndpoints.QUIZ_GENERATE,
    payload,
  );
};

export const startQuiz = async (quizId: number): Promise<QuizStartResponse> => {
  const endpoint = QuizEndpoints.QUIZ_START.replace(
    "{quizId}",
    quizId.toString(),
  );
  return request.get<QuizStartResponse>(endpoint);
};

export const getQuiz = async (quizId: number): Promise<UserQuizInstance> => {
  const endpoint = QuizEndpoints.QUIZ_GET.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.get<UserQuizInstance>(endpoint);
};

export const deleteQuiz = async (quizId: number): Promise<void> => {
  const endpoint = QuizEndpoints.QUIZ_DELETE.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.delete<void>(endpoint);
};

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

export const getQuizNotes = async (quizId: number): Promise<QuizNotesResponse> => {
  const endpoint = QuizEndpoints.QUIZ_NOTES.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.get<QuizNotesResponse>(endpoint);
};