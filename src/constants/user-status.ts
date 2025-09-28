/**
 * Énumération représentant les différents statuts ou rôles des utilisateurs dans le système.
 */
export enum UserStatus {
  /** Rôle pour un élève. */
  ELEVE = 'eleve',
  /** Rôle pour un professeur. */
  PROFESSEUR = 'professeur',
  /** Rôle pour un parent d'élève. */
  PARENT = 'parent',
  /** Rôle pour un répétiteur ou tuteur. */
  REPETITEUR = 'repetiteur',
}