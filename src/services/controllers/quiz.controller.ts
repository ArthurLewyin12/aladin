import { request } from "@/lib/request";
import { QuizEndpoints } from "@/constants/endpoints";
import {
  UserQuizInstance,
  QuizHistory,
  QuizNotes,
  QuizStartPayload,
  QuizSubmitPayload,
} from "./types/common";

export const getQuizHistory = async (): Promise<QuizHistory> => {
  return request.get<QuizHistory>(QuizEndpoints.QUIZ_HISTORY);
};

export const startQuiz = async (
  payload: QuizStartPayload,
): Promise<UserQuizInstance> => {
  return request.post<UserQuizInstance>(QuizEndpoints.QUIZ_START, payload);
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
): Promise<QuizNotes> => {
  const endpoint = QuizEndpoints.QUIZ_SUBMIT.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.post<QuizNotes>(endpoint, payload);
};

export const getQuizNotes = async (quizId: number): Promise<QuizNotes> => {
  const endpoint = QuizEndpoints.QUIZ_NOTES.replace(
    "{quiz_id}",
    quizId.toString(),
  );
  return request.get<QuizNotes>(endpoint);
};
