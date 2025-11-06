/**
 * Utilitaires pour le formatage du temps d'étude
 */

/**
 * Formate le temps d'étude en secondes en un format lisible (heures et minutes)
 * @param seconds - Temps en secondes
 * @returns Temps formaté (ex: "2h 30min", "45min", "3h")
 */
export function formatStudyTime(seconds: number): string {
  if (seconds === 0) return "0min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}min`;
  }
}

/**
 * Formate un nombre d'heures décimales en un format lisible
 * Ex: 2.5 heures -> "2h 30min"
 * @param hours - Temps en heures (peut être décimal)
 * @returns Temps formaté (ex: "2h 30min", "45min", "3h")
 */
export function formatHoursToReadable(hours: number): string {
  if (hours === 0) return "0min";

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours % 1) * 60);

  if (wholeHours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}min`;
  }
}

/**
 * Convertit les secondes en heures (nombre décimal)
 * @param seconds - Temps en secondes
 * @returns Temps en heures (décimal)
 */
export function convertSecondsToHours(seconds: number): number {
  return seconds / 3600;
}

/**
 * Convertit les secondes en minutes
 * @param seconds - Temps en secondes
 * @returns Temps en minutes
 */
export function convertSecondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

/**
 * Formate le temps pour l'affichage dans un tooltip ou graphique
 * Retourne en minutes si < 1h, sinon en heures avec 1 décimale
 * @param seconds - Temps en secondes
 * @returns Temps formaté pour tooltip (ex: "45 min", "2.5h")
 */
export function formatStudyTimeForTooltip(seconds: number): string {
  const hours = seconds / 3600;

  if (hours < 1) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  }

  return `${hours.toFixed(1)}h`;
}

/**
 * Formate le temps en format court pour les cartes de statistiques
 * @param seconds - Temps en secondes
 * @returns Temps formaté (ex: "2h30", "45min", "3h")
 */
export function formatStudyTimeShort(seconds: number): string {
  if (seconds === 0) return "0min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h${minutes}`;
  }
}
