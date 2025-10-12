import { CourseEndpoints } from "@/constants/endpoints";
import { Courses, GenerateCoursResponse, UserCours } from "./types/common/cours.type";
import { request } from "@/lib/request";

/**
 * Génère une explication de cours pour un chapitre donné.
 * @param {string} chapter_id - L'ID du chapitre pour lequel générer le cours.
 * @returns {Promise<GenerateCoursResponse>} La réponse de l'API contenant le contenu du cours.
 */
export const expliquerCours = async (
  chapter_id: string,
): Promise<GenerateCoursResponse> => {
  return request.post(
    CourseEndpoints.COURSES_BY_CHAPITRE,
    { chapter_id },
    { timeout: 60000 }, // 60 seconds timeout
  );
};

/**
 * cette route permet de récupérer tous les cours générés par les utilisateurs.
 * @returns une promise contenant un tableau de cours
 */
export const getAllUserGeneratedCourses = async (): Promise<Courses> => {
  return request.get(CourseEndpoints.ALL_QUIZ_GENERATED);
};

/**
 * Récupère un cours unique généré par l'utilisateur par son ID.
 * @param {number} courseId - L'ID du cours à récupérer.
 * @returns {Promise<UserCours>} Le cours complet avec son contenu.
 */
export const getOneCourse = async (courseId: number): Promise<UserCours> => {
  const endpoint = CourseEndpoints.GET_ONE_COURSE.replace(
    "{courseId}",
    courseId.toString(),
  );
  return request.get<UserCours>(endpoint);
};
