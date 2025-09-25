export const PAYMENT_FREQUENCIES = ["mensuel", "annuel"];

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
      mensuel: 1000,
      annuel: 9000,
    },
    description: "Accès complet pour une année scolaire réussie.",
    features: [
      "Accès illimité à tous les cours et chapitres",
      "Exercices et quiz interactifs illimités",
      "Suivi de progression personnalisé",
      "Support prioritaire 24/7",
    ],
    cta: "S'abonner",
    popular: true,
    highlighted: true,
  },
  {
    id: "famille",
    name: "Forfait Famille",
    price: {
      mensuel: 2500,
      annuel: 25000,
    },
    description: "Pour les parents qui veulent suivre la progression de leurs enfants.",
    features: [
      "Toutes les fonctionnalités du Forfait Élève",
      "Tableau de bord parental",
      "Rapports de progression hebdomadaires",
      "Suivi de plusieurs enfants (jusqu'à 3)",
    ],
    cta: "Choisir l'offre Famille",
    popular: false,
  },
];
