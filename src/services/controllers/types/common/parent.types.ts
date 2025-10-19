import type { Niveau } from "../auth.types";

/**
 * Type d'enfant
 */
export enum EnfantType {
  UTILISATEUR = "utilisateur",
  MANUEL = "manuel",
}

/**
 * Enfant utilisateur (a créé son propre compte)
 */
export type EnfantUtilisateur = {
  id: string | number;
  nom: string;
  prenom: string;
  niveau_id: number;
  niveau?: Niveau;
  type: EnfantType.UTILISATEUR;
  email: string;
  numero: string;
};

/**
 * Enfant ajouté manuellement par le parent
 */
export type EnfantManuel = {
  id: string; // Format: "manuel_456"
  nom: string;
  prenom: string;
  niveau_id: number;
  niveau?: Niveau;
  type: EnfantType.MANUEL;
  email: string;
  numero: string;
};

/**
 * Union type pour n'importe quel type d'enfant
 */
export type Enfant = EnfantUtilisateur | EnfantManuel;

/**
 * Classe de l'enfant actif
 */
export type ClasseEnfantActif = {
  id: number;
  libelle: string;
  // Ajouter d'autres champs si nécessaire
};

/**
 * Réponse GET /api/parent/enfants
 */
export type GetEnfantsResponse = {
  success: boolean;
  enfants: Enfant[];
  count: number;
  enfant_actif: Enfant | null;
  classe_enfant_actif: ClasseEnfantActif | null;
};

/**
 * Payload POST /api/parent/enfants/ajouter-manuel
 */
export type AjouterEnfantManuelPayload = {
  nom: string;
  prenom: string;
  niveau_id: number;
  email: string;
  numero: string;
};

/**
 * Réponse POST /api/parent/enfants/ajouter-manuel
 */
export type AjouterEnfantManuelResponse = {
  success: boolean;
  message: string;
  enfant: EnfantManuel;
};

/**
 * Payload POST /api/parent/enfants/selectionner
 */
export type SelectionnerEnfantPayload = {
  enfant_id: string | number; // "123" ou "manuel_456"
};

/**
 * Réponse POST /api/parent/enfants/selectionner
 */
export type SelectionnerEnfantResponse = {
  success: boolean;
  message: string;
  enfant_actif: Enfant;
};

/**
 * Réponse GET /api/parent/enfant-actif
 */
export type GetEnfantActifResponse = {
  success: boolean;
  enfant_actif: Enfant | null;
  classe_enfant_actif: ClasseEnfantActif | null;
};

/**
 * Payload POST /api/parent/enfants/ajouter
 */
export type AjouterEnfantUtilisateurPayload = {
  enfant_id: number;
};

/**
 * Réponse POST /api/parent/enfants/ajouter
 */
export type AjouterEnfantUtilisateurResponse = {
  success: boolean;
  message: string;
  enfant: EnfantUtilisateur;
};

/**
 * Payload DELETE /api/parent/enfants/retirer
 */
export type RetirerEnfantPayload = {
  enfant_id: number;
};

/**
 * Réponse DELETE /api/parent/enfants/retirer
 */
export type RetirerEnfantResponse = {
  success: boolean;
  message: string;
};

/**
 * Réponse POST /api/parent/enfants/associer-automatiquement
 */
export type AssocierAutomatiquementResponse = {
  success: boolean;
  message: string;
  enfants_associes: number; // Nombre d'enfants associés automatiquement
};
