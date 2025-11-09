/**
 * Utilitaires pour le calcul des scores et notes des quiz
 *
 * Système de notation :
 * - Les scores sont calculés en fonction du nombre de bonnes réponses
 * - Les notes sont toujours converties sur 20
 * - Le pourcentage de réussite est calculé pour l'affichage
 */

import { QuizQuestion } from "@/services/controllers/types/common";

/**
 * Résultat du calcul de score d'un quiz
 */
export interface QuizScoreResult {
  /** Nombre de réponses correctes */
  correctAnswers: number;
  /** Nombre total de questions */
  totalQuestions: number;
  /** Note convertie sur 20 */
  noteSur20: number;
  /** Pourcentage de réussite (0-100) */
  percentage: number;
  /** Score brut pour l'API (nombre de bonnes réponses) */
  scoreForApi: number;
}

/**
 * Calcule le score d'un quiz en comparant les réponses de l'utilisateur
 * avec les bonnes réponses
 *
 * @param questions - Liste des questions du quiz avec les bonnes réponses
 * @param userAnswers - Réponses de l'utilisateur (clé = ID question, valeur = ID réponse)
 * @returns Résultat détaillé du calcul de score
 *
 * @example
 * ```typescript
 * const result = calculateQuizScore(questions, {
 *   "q_0": "a",
 *   "q_1": "b",
 *   "q_2": "c"
 * });
 *
 * console.log(result.noteSur20); // 13.33
 * console.log(result.percentage); // 66.67
 * ```
 */
export function calculateQuizScore(
  questions: QuizQuestion[],
  userAnswers: Record<string | number, string | number>,
): QuizScoreResult {
  if (!questions || questions.length === 0) {
    return {
      correctAnswers: 0,
      totalQuestions: 0,
      noteSur20: 0,
      percentage: 0,
      scoreForApi: 0,
    };
  }

  let correctAnswers = 0;

  // Compter les bonnes réponses
  // Les questions non répondues sont automatiquement comptées comme incorrectes
  for (const question of questions) {
    const userAnswerId = userAnswers[question.id];

    // Comparaison flexible (== au lieu de ===) pour gérer les types number/string
    if (userAnswerId != null && userAnswerId == question.bonne_reponse_id) {
      correctAnswers++;
    }
    // Si la question n'a pas été répondu (userAnswerId est undefined/null),
    // elle n'est pas ajoutée à correctAnswers, donc elle compte comme incorrecte
  }

  const totalQuestions = questions.length;
  const percentage = (correctAnswers / totalQuestions) * 100;
  const noteSur20 = (correctAnswers / totalQuestions) * 20;

  return {
    correctAnswers,
    totalQuestions,
    noteSur20: Math.round(noteSur20 * 100) / 100, // Arrondi à 2 décimales
    percentage: Math.round(percentage * 100) / 100, // Arrondi à 2 décimales
    scoreForApi: correctAnswers, // Le backend attend le nombre de bonnes réponses
  };
}

/**
 * Convertit une note brute en note sur 20
 *
 * @param score - Score obtenu (nombre de bonnes réponses)
 * @param totalQuestions - Nombre total de questions
 * @returns Note sur 20 arrondie à 2 décimales
 *
 * @example
 * ```typescript
 * const note = convertScoreToNote(4, 6); // 13.33
 * ```
 */
export function convertScoreToNote(
  score: number,
  totalQuestions: number,
): number {
  if (totalQuestions === 0) return 0;

  const noteSur20 = (score / totalQuestions) * 20;
  return Math.round(noteSur20 * 100) / 100; // Arrondi à 2 décimales
}

/**
 * Calcule le pourcentage de réussite
 *
 * @param score - Score obtenu (nombre de bonnes réponses)
 * @param totalQuestions - Nombre total de questions
 * @returns Pourcentage arrondi à 2 décimales
 *
 * @example
 * ```typescript
 * const percentage = calculatePercentage(4, 6); // 66.67
 * ```
 */
export function calculatePercentage(
  score: number,
  totalQuestions: number,
): number {
  if (totalQuestions === 0) return 0;

  const percentage = (score / totalQuestions) * 100;
  return Math.round(percentage * 100) / 100; // Arrondi à 2 décimales
}

/**
 * Obtient un message de félicitation basé sur le pourcentage de réussite
 *
 * @param percentage - Pourcentage de réussite (0-100)
 * @returns Objet contenant emoji, titre et message
 *
 * @example
 * ```typescript
 * const message = getScoreMessage(85);
 * console.log(message.title); // "Bien joué !"
 * ```
 */
export function getScoreMessage(percentage: number) {
  if (percentage >= 90) {
    return {
      emoji: "🏆",
      title: "Excellent !",
      message:
        "Tu maîtrises parfaitement ce chapitre ! Continue comme ça, tu es sur la bonne voie pour devenir un expert.",
      titleEmoji: "🌟",
    };
  } else if (percentage >= 70) {
    return {
      emoji: "👏",
      title: "Bien joué !",
      message:
        "Tu as bien travaillé ! Tu maîtrises déjà beaucoup de choses, quelques petites révisions et ce sera parfait.",
      titleEmoji: "🎉",
    };
  } else if (percentage >= 50) {
    return {
      emoji: "💪",
      title: "Bon début !",
      message:
        "Tu es sur la bonne voie ! Quelques notions sont à revoir, mais tu progresses. Continue à t'entraîner.",
      titleEmoji: "📚",
    };
  } else {
    return {
      emoji: "🎯",
      title: "Continue tes efforts !",
      message:
        "Ce chapitre demande encore du travail, mais ne te décourage pas ! Révise bien les corrections et réessaie, tu vas y arriver.",
      titleEmoji: "💡",
    };
  }
}

/**
 * Obtient la couleur du badge en fonction de la note
 *
 * @param noteSur20 - Note sur 20
 * @returns Classe CSS Tailwind pour la couleur
 *
 * @example
 * ```typescript
 * const color = getNoteBadgeColor(15); // "bg-blue-500"
 * ```
 */
export function getNoteBadgeColor(noteSur20: number): string {
  if (noteSur20 >= 16) return "bg-green-500";
  if (noteSur20 >= 14) return "bg-blue-500";
  if (noteSur20 >= 12) return "bg-yellow-500";
  if (noteSur20 >= 10) return "bg-orange-500";
  return "bg-red-500";
}

/**
 * Obtient le badge de performance basé sur la note
 *
 * @param noteSur20 - Note sur 20
 * @returns Objet contenant le label et la couleur du badge
 *
 * @example
 * ```typescript
 * const badge = getPerformanceBadge(17);
 * console.log(badge.label); // "Excellent"
 * console.log(badge.color); // "bg-green-500"
 * ```
 */
export function getPerformanceBadge(noteSur20: number) {
  if (noteSur20 >= 16) return { label: "Excellent", color: "bg-green-500" };
  if (noteSur20 >= 14) return { label: "Très bien", color: "bg-blue-500" };
  if (noteSur20 >= 12) return { label: "Bien", color: "bg-yellow-500" };
  if (noteSur20 >= 10) return { label: "Passable", color: "bg-orange-500" };
  return { label: "À améliorer", color: "bg-red-500" };
}

/**
 * Obtient le niveau de performance basé sur le pourcentage de réussite
 *
 * @param correctAnswers - Nombre de bonnes réponses
 * @param totalQuestions - Nombre total de questions
 * @returns Objet contenant le label et la couleur du badge
 *
 * @example
 * ```typescript
 * const performance = getPerformanceLevel(5, 10); // 50% -> "Passable"
 * const performance = getPerformanceLevel(9, 10); // 90% -> "Excellent"
 * ```
 */
export function getPerformanceLevel(correctAnswers: number, totalQuestions: number) {
  if (totalQuestions === 0) {
    return { label: "Mauvais", color: "bg-red-500" };
  }

  const percentage = (correctAnswers / totalQuestions) * 100;

  if (percentage >= 80) {
    return { label: "Excellent", color: "bg-green-500" };
  } else if (percentage >= 60) {
    return { label: "Assez bien", color: "bg-blue-500" };
  } else if (percentage >= 40) {
    return { label: "Passable", color: "bg-yellow-500" };
  } else if (percentage >= 20) {
    return { label: "Médiocre", color: "bg-orange-500" };
  } else {
    return { label: "Mauvais", color: "bg-red-500" };
  }
}
