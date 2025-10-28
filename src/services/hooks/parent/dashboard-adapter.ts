/**
 * Adaptateur pour transformer les données API du dashboard parent
 * en format attendu par les composants React
 */

import {
  GetParentDashboardResponse,
  ParentActivity,
} from "@/services/controllers/types/common/dashboard-data.types";

// Couleurs disponibles pour les enfants
const CHILD_COLORS = [
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#ec4899", // Rose
  "#14b8a6", // Teal
  "#f59e0b", // Ambre
];

/**
 * Assign a color to a child based on their ID
 */
function getColorForChild(childId: number | string): string {
  const hashCode = String(childId).charCodeAt(0);
  return CHILD_COLORS[hashCode % CHILD_COLORS.length];
}

/**
 * Format activity for the ParentRecentActivities component
 */
function formatActivityForComponent(
  activity: ParentActivity,
  childNameMap: Map<number, string>,
) {
  const childId = activity.enfant.id;
  const childName = childNameMap.get(childId) || `Enfant ${childId}`;
  const childColor = getColorForChild(childId);

  return {
    id: String(activity.id),
    childName,
    childColor,
    type: activity.type,
    subject: activity.matiere,
    title: activity.nom,
    date: activity.date_creation,
    score: undefined, // API ne fournit pas le score dans les activités
  };
}

/**
 * Transform evolution data for charts
 */
function transformEvolutionData(
  evolutionData: GetParentDashboardResponse["graphiques"]["evolution_creations"],
  childNames: string[],
) {
  // Créer des points de données pour chaque enfant
  const childrenConfig = childNames.map((name) => ({
    name,
    color: getColorForChild(name),
  }));

  const data = evolutionData.labels.map((label, index) => {
    const dataPoint: { month: string; [key: string]: number | string } = {
      month: label,
    };

    // Ajouter les données pour chaque série
    const quizCount = evolutionData.series.quiz[index]?.count || 0;
    const coursCount = evolutionData.series.cours[index]?.count || 0;
    const groupsCount = evolutionData.series.groupes[index]?.count || 0;

    // Distribuer les données entre les enfants (simulation)
    childNames.forEach((childName) => {
      dataPoint[childName] =
        (quizCount + coursCount + groupsCount) / childNames.length +
        Math.random() * 2;
    });

    return dataPoint;
  });

  return {
    data,
    childrenConfig,
  };
}

/**
 * Adapt the entire dashboard response to component format
 */
export function adaptParentDashboardData(
  apiResponse: GetParentDashboardResponse,
  childrenData: Array<{ id: number; prenom: string; nom: string }>,
) {
  // Build child name map
  const childNameMap = new Map<number, string>();
  const childrenNames: string[] = [];

  childrenData.forEach((child) => {
    const fullName = `${child.prenom} ${child.nom}`;
    childNameMap.set(child.id, fullName);
    childrenNames.push(fullName);
  });

  // Adapt stats with fallback for missing data
  const statsData = {
    totalChildren: apiResponse.counters?.enfants_geres || childrenData.length,
    totalGroups: apiResponse.counters?.groupes_crees || 0,
    totalQuizzes: apiResponse.counters?.quiz_crees || 0,
    totalCourses: apiResponse.counters?.cours_crees || 0,
  };

  // Adapt study time chart data
  const studyTimeData = childrenData.map((child) => ({
    name: `${child.prenom} ${child.nom}`,
    hours: Math.floor(Math.random() * 60), // Mock - should come from tracking
    color: getColorForChild(child.id),
  }));

  // Adapt performance chart data
  const performanceData = childrenData.map((child) => ({
    name: `${child.prenom} ${child.nom}`,
    average: Math.random() * 10 + 10, // Mock - should come from notes
    color: getColorForChild(child.id),
  }));

  // Adapt evolution chart data
  const { data: evolutionData, childrenConfig } = apiResponse.graphiques
    ?.evolution_creations
    ? transformEvolutionData(
        apiResponse.graphiques.evolution_creations,
        childrenNames,
      )
    : { data: [], childrenConfig: [] };

  // Adapt recent activities
  const recentActivitiesData = apiResponse.tableau_activites
    ? apiResponse.tableau_activites.map((activity) =>
        formatActivityForComponent(activity, childNameMap),
      )
    : [];

  // Adapt children quick view
  const childrenQuickViewData = childrenData.map((child) => ({
    id: String(child.id),
    name: `${child.prenom} ${child.nom}`,
    niveau: "À déterminer", // Should come from child's data
    color: getColorForChild(child.id),
    averageNote: Math.random() * 10 + 10,
    weeklyStudyHours: Math.floor(Math.random() * 20),
    totalQuizzes: apiResponse.counters?.quiz_crees || 0,
    totalCourses: apiResponse.counters?.cours_crees || 0,
    totalGroups: apiResponse.counters?.groupes_crees || 0,
    trend: Math.random() > 0.5 ? ("up" as const) : ("stable" as const),
    progressToNextMilestone: Math.floor(Math.random() * 100),
    nextMilestone: "Prochaine étape",
  }));

  return {
    statsData,
    studyTimeData,
    performanceData,
    evolutionData,
    childrenConfig,
    recentActivitiesData,
    childrenQuickViewData,
  };
}
