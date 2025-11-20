import { getAllUserGeneratedCourses, getEleveCours } from "@/services/controllers/cours.controller";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/services/hooks/auth/useSession";

/**
 * hook pour récupérer toutes les courses générées par les utilisateurs.
 * @returns  return une queryFn composé des courses
 */

export const useGetAllCourses = () => {
  return useQuery({
    queryKey: ["allCourses"],
    queryFn: getAllUserGeneratedCourses,
  });
};

/**
 * Hook pour récupérer les cours selon le type (personnel ou classe).
 * Utilise la nouvelle API pour les cours de classe, l'ancienne pour les cours personnels.
 * @param type - Type de cours ("personnel" ou "classe")
 * @returns Query result avec les cours adaptés
 */
export const useGetCoursesByType = (type: "personnel" | "classe") => {
  const { user } = useSession();

  if (type === "personnel") {
    return useQuery({
      queryKey: ["courses", "personnel"],
      queryFn: getAllUserGeneratedCourses,
    });
  } else {
    // Cours de classe - utilise la nouvelle API
    return useQuery({
      queryKey: ["courses", "classe", user?.id],
      queryFn: async () => {
        console.log("🔍 Récupération des cours de classe pour userId:", user?.id);
        const result = await getEleveCours(user?.id || 0);
        console.log("✅ Cours de classe récupérés:", result);
        return result;
      },
      enabled: !!user?.id,
    });
  }
};

/**
 * Hook pour récupérer les cours d'un élève avec ses classes.
 * @param eleveId - L'ID de l'élève
 * @returns Query result avec les cours et classes de l'élève
 */
export const useGetEleveCours = (eleveId: number | null) => {
  console.log("🔍 Hook useGetEleveCours appelé avec eleveId:", eleveId);

  return useQuery({
    queryKey: ["eleveCours", eleveId],
    queryFn: async () => {
      console.log("🔍 Exécution de getEleveCours pour eleveId:", eleveId);
      const result = await getEleveCours(eleveId!);
      console.log("✅ Hook useGetEleveCours succès, data:", result);
      return result;
    },
    enabled: !!eleveId,
  });
};
