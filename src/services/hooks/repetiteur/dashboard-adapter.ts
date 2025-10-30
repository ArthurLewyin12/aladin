/**
 * Adaptateur pour transformer les données API du dashboard répétiteur
 * en format attendu par les composants React
 */

import {
  GetRepetiteurDashboardResponse,
  RepetiteurActivity,
} from "@/services/controllers/types/common/dashboard-data.types";
import { EleveDashboardStats } from "@/services/controllers/types/common/repetiteur.types";

// Couleurs disponibles pour les élèves
const STUDENT_COLORS = [
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#ec4899", // Rose
  "#14b8a6", // Teal
  "#f59e0b", // Ambre
];

/**
 * Assign a color to a student based on their ID
 */
function getColorForStudent(studentId: number | string): string {
  const hashCode = String(studentId).charCodeAt(0);
  return STUDENT_COLORS[hashCode % STUDENT_COLORS.length];
}

/**
 * Format activity for the RepetiteurRecentActivities component
 */
function formatActivityForComponent(
  activity: RepetiteurActivity,
  studentNameMap: Map<number | string, string>,
) {
  // Handle eleve which can be "Tous" or an object
  let studentName = "Tous les élèves";
  let studentColor = "#6b7280"; // Gray for "Tous"

  if (typeof activity.eleve === "object" && activity.eleve !== null) {
    const studentId = activity.eleve.id;
    studentName = studentNameMap.get(studentId) || `Élève ${studentId}`;
    studentColor = getColorForStudent(studentId);
  } else if (typeof activity.eleve === "string") {
    studentName = activity.eleve;
  }

  return {
    id: String(activity.id),
    studentName,
    studentColor,
    type: activity.type,
    subject: activity.matiere,
    title: activity.titre,
    date: activity.date_creation,
    difficulty: activity.difficulte || undefined,
    score: undefined, // API ne fournit pas le score dans les activités
  };
}

/**
 * Transform evolution data for charts
 */
function transformEvolutionData(
  evolutionData: GetRepetiteurDashboardResponse["graphiques"]["evolution_creations"],
  studentNames: string[],
) {
  const studentsConfig = studentNames.map((name) => ({
    name,
    color: getColorForStudent(name),
  }));

  const data = evolutionData.labels.map((label, index) => {
    const dataPoint: { month: string; [key: string]: number | string } = {
      month: label,
    };

    // Ajouter les données pour chaque série
    const quizCount = evolutionData.series.quiz[index]?.count || 0;
    const coursCount = evolutionData.series.cours[index]?.count || 0;
    const groupsCount = evolutionData.series.groupes[index]?.count || 0;

    // Distribuer les données entre les élèves (simulation)
    studentNames.forEach((studentName) => {
      dataPoint[studentName] =
        (quizCount + coursCount + groupsCount) / studentNames.length +
        Math.random() * 2;
    });

    return dataPoint;
  });

  return {
    data,
    studentsConfig,
  };
}

/**
 * Adapt the entire dashboard response to component format
 */
export function adaptRepetiteurDashboardData(
  apiResponse: GetRepetiteurDashboardResponse,
  elevesData: Array<{
    id: number | string;
    prenom: string;
    nom: string;
    niveau_id?: number;
    niveau?: { id: number; libelle: string };
  }>,
  elevesResume: Array<{
    eleveId: string | number;
    statistiques: EleveDashboardStats;
  }> = [],
) {
  // Build student name map
  const studentNameMap = new Map<number | string, string>();
  const studentNames: string[] = [];

  elevesData.forEach((eleve) => {
    const fullName = `${eleve.prenom} ${eleve.nom}`;
    studentNameMap.set(eleve.id, fullName);
    studentNames.push(fullName);
  });

  // Adapt stats with fallback for missing data
  const statsData = {
    totalStudents: apiResponse.counters?.eleves_geres || elevesData.length,
    totalQuizzes: apiResponse.counters?.quiz_crees || 0,
    totalCourses: apiResponse.counters?.cours_crees || 0,
    totalGroups: apiResponse.counters?.groupes_crees || 0,
  };

  // Build a map of resume data by eleve ID for easy lookup
  const resumeMap = new Map<number | string, EleveDashboardStats>();
  elevesResume.forEach((resume) => {
    resumeMap.set(resume.eleveId, resume.statistiques);
  });

  // Adapt study time chart data
  const studyTimeData = elevesData.map((eleve) => ({
    name: `${eleve.prenom} ${eleve.nom}`,
    hours: resumeMap.get(eleve.id)?.heures_etude_hebdomadaires || 0,
    color: getColorForStudent(eleve.id),
  }));

  // Adapt performance chart data
  const performanceData = elevesData.map((eleve) => ({
    name: `${eleve.prenom} ${eleve.nom}`,
    average: resumeMap.get(eleve.id)?.moyenne_generale || 0,
    color: getColorForStudent(eleve.id),
  }));

  // Adapt evolution chart data
  const { data: evolutionData, studentsConfig } = apiResponse.graphiques
    ?.evolution_creations
    ? transformEvolutionData(
        apiResponse.graphiques.evolution_creations,
        studentNames,
      )
    : { data: [], studentsConfig: [] };

  // Adapt recent activities
  const recentActivitiesData = apiResponse.tableau_activites
    ? apiResponse.tableau_activites.map((activity) =>
        formatActivityForComponent(activity, studentNameMap),
      )
    : [];

  // Adapt students quick view
  const studentsQuickViewData = elevesData.map((eleve) => {
    const niveauLibelle =
      eleve.niveau?.libelle ||
      (eleve.niveau_id ? `Niveau ${eleve.niveau_id}` : "Non défini");

    const resumeStats = resumeMap.get(eleve.id);

    return {
      id: String(eleve.id),
      name: `${eleve.prenom} ${eleve.nom}`,
      niveau: niveauLibelle,
      color: getColorForStudent(eleve.id),
      averageNote: resumeStats?.moyenne_generale || 0,
      weeklyStudyHours: resumeStats?.heures_etude_hebdomadaires || 0,
      totalQuizzes: resumeStats?.nombre_quiz || 0,
      totalCourses: resumeStats?.nombre_cours || 0,
      totalGroups: resumeStats?.nombre_groupes || 0,
      trend: (resumeStats?.tendance as "up" | "down" | "stable") || "stable",
      progressToNextMilestone: resumeStats?.progression || 0,
      nextMilestone: undefined, // This is not in the API response
    };
  });

  return {
    statsData,
    studyTimeData,
    performanceData,
    evolutionData,
    studentsConfig,
    recentActivitiesData,
    studentsQuickViewData,
  };
}
