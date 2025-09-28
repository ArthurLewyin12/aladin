/**
 * Type de base pour les champs d'audit présents dans de nombreux modèles de données.
 * Inclut les dates de création et de mise à jour.
 */
export type AuditFields = {
  /**
   * La date et l'heure de création de l'enregistrement (format ISO 8601).
   */
  created_at: string;
  /**
   * La date et l'heure de la dernière mise à jour de l'enregistrement (format ISO 8601).
   */
  updated_at: string;
};