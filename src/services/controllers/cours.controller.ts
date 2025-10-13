import { CourseEndpoints } from "@/constants/endpoints";
import {
  Courses,
  GenerateCoursResponse,
  UserCours,
  GenerateCoursPayload,
} from "./types/common/cours.type";
import { request } from "@/lib/request";

/**
 * Génère une explication de cours pour un chapitre donné.
 * Supporte deux modes:
 * - Sans document: envoi JSON classique
 * - Avec document: envoi multipart/form-data
 * @param {GenerateCoursPayload} payload - L'ID du chapitre et le fichier optionnel.
 * @returns {Promise<GenerateCoursResponse>} La réponse de l'API contenant le contenu du cours.
 */
export const expliquerCours = async (
  payload: GenerateCoursPayload,
): Promise<GenerateCoursResponse> => {
  // Si un fichier est présent, utiliser FormData
  if (payload.document_file) {
    return request.postFormData<GenerateCoursResponse>(
      CourseEndpoints.COURSES_BY_CHAPITRE,
      {
        chapter_id: payload.chapter_id,
        document_file: payload.document_file,
      },
    );
  } else {
    // Sinon, envoi JSON classique
    return request.post<GenerateCoursResponse>(
      CourseEndpoints.COURSES_BY_CHAPITRE,
      { chapter_id: payload.chapter_id },
      { timeout: 60000 }, // 60 seconds timeout
    );
  }
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
