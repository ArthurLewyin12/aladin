export const PAYMENT_FREQUENCIES = ["annuel"];

export interface PricingTier {
  name: string;
  id: string;
  price: Record<string, number | string>;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  popular?: boolean;
}

export const TIERS: PricingTier[] = [
  {
    id: "eleve",
    name: "Forfait Élève",
    price: {
      annuel: 9000,
    },
    description: "Accès complet pour une année scolaire réussie.",
    features: [
      "Accès illimité à tous les cours et chapitres",
      "Exercices et quiz interactifs illimités",
      "Suivi de progression personnalisé",
      "Support prioritaire 24/7",
    ],
    cta: "Souscrire",
    popular: true,
    highlighted: true,
  },
  {
    id: "famille",
    name: "Forfait Famille",
    price: {
      annuel: 25000,
    },
    description:
      "Pour les parents qui veulent suivre la progression de leurs enfants.",
    features: [
      "Toutes les fonctionnalités du Forfait Élève",
      "Tableau de bord parental",
      "Rapports de progression hebdomadaires",
      "Suivi de plusieurs enfants (jusqu'à 3)",
    ],
    cta: "Souscrire",
    popular: false,
  },
  {
    id: "entreprise",
    name: "Forfait Entreprise",
    price: {
      annuel: "Sur mesure",
    },
    description: "Gestion des Coupons & Offres pour les entreprises.",
    features: [
      "Offrir des comptes à des élèves",
      "Achat de packs de codes promo (coupons)",
      "Suivi de l'utilisation des coupons",
      "Activation automatique des comptes élèves",
      "Page de gestion des coupons (tableau, tri, export CSV/PDF)",
      "Support dédié",
    ],
    cta: "Acheter",
    popular: false,
    highlighted: false,
  },
];
