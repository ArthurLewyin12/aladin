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
 * L'API attend toujours du FormData (multipart/form-data), que le document soit présent ou non.
 * @param {GenerateCoursPayload} payload - L'ID du chapitre et le fichier optionnel.
 * @returns {Promise<GenerateCoursResponse>} La réponse de l'API contenant le contenu du cours.
 */
export const expliquerCours = async (
  payload: GenerateCoursPayload,
): Promise<GenerateCoursResponse> => {
  // L'API attend toujours du FormData (avec ou sans fichier)
  const formDataPayload: Record<string, any> = {
    chapter_id: payload.chapter_id,
  };

  // Ajouter le fichier s'il est présent
  if (payload.document_file) {
    formDataPayload.document_file = payload.document_file;
  }

  return request.postFormData<GenerateCoursResponse>(
    CourseEndpoints.COURSES_BY_CHAPITRE,
    formDataPayload,
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
