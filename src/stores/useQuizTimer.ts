import { create } from "zustand";

/**
 * Store pour tracker le temps réel passé sur chaque question d'un quiz
 */

interface QuestionTimer {
  questionId: string | number;
  startTime: number; // timestamp en ms
  endTime?: number; // timestamp en ms
  duration?: number; // durée en secondes
}

interface QuizTimerState {
  quizId: number | null;
  questionTimers: QuestionTimer[];
  currentQuestionId: string | number | null;
  currentQuestionStartTime: number | null;

  // Actions
  startQuiz: (quizId: number) => void;
  startQuestion: (questionId: string | number) => void;
  endQuestion: (questionId: string | number) => void;
  getTotalTime: () => number; // Retourne le temps total en secondes
  getQuestionTime: (questionId: string | number) => number | null; // Retourne le temps pour une question spécifique
  reset: () => void;
}

export const useQuizTimer = create<QuizTimerState>((set, get) => ({
  quizId: null,
  questionTimers: [],
  currentQuestionId: null,
  currentQuestionStartTime: null,

  startQuiz: (quizId) => {
    set({
      quizId,
      questionTimers: [],
      currentQuestionId: null,
      currentQuestionStartTime: null,
    });
  },

  startQuestion: (questionId) => {
    const state = get();

    // Si une question est déjà en cours, la terminer d'abord
    if (state.currentQuestionId !== null) {
      get().endQuestion(state.currentQuestionId);
    }

    set({
      currentQuestionId: questionId,
      currentQuestionStartTime: Date.now(),
    });
  },

  endQuestion: (questionId) => {
    const state = get();

    // Vérifier si c'est bien la question en cours
    if (state.currentQuestionId !== questionId) {
      console.warn(
        `Trying to end question ${questionId} but current question is ${state.currentQuestionId}`
      );
      return;
    }

    if (state.currentQuestionStartTime === null) {
      console.warn(`No start time found for question ${questionId}`);
      return;
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - state.currentQuestionStartTime) / 1000); // en secondes

    const newTimer: QuestionTimer = {
      questionId,
      startTime: state.currentQuestionStartTime,
      endTime,
      duration,
    };

    set({
      questionTimers: [...state.questionTimers, newTimer],
      currentQuestionId: null,
      currentQuestionStartTime: null,
    });

    console.log(`Question ${questionId} completed in ${duration}s`);
  },

  getTotalTime: () => {
    const state = get();
    const total = state.questionTimers.reduce(
      (acc, timer) => acc + (timer.duration || 0),
      0
    );
    return total; // en secondes
  },

  getQuestionTime: (questionId) => {
    const state = get();
    const timer = state.questionTimers.find((t) => t.questionId === questionId);
    return timer?.duration || null;
  },

  reset: () => {
    set({
      quizId: null,
      questionTimers: [],
      currentQuestionId: null,
      currentQuestionStartTime: null,
    });
  },
}));
