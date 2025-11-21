import { CourseEndpoints } from "@/constants/endpoints";
import {
  Courses,
  GenerateCoursResponse,
  UserCours,
  GenerateCoursPayload,
  EleveCoursResponse,
  EleveCours,
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
    { timeout: 180000 }, // 180 seconds timeout for course generation
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

/**
 * Récupère les cours d'un élève avec ses classes.
 * @param {number} eleveId - L'ID de l'élève.
 * @returns {Promise<EleveCoursResponse>} Les cours et classes de l'élève.
 */
export const getEleveCours = async (eleveId: number): Promise<EleveCoursResponse> => {
  const endpoint = CourseEndpoints.ELEVE_COURS.replace(
    "{eleveId}",
    eleveId.toString(),
  );
  return request.get<EleveCoursResponse>(endpoint);
};

/**
 * Récupère un cours de classe spécifique pour un élève.
 * @param {number} eleveId - L'ID de l'élève.
 * @param {number} courseId - L'ID du cours.
 * @returns {Promise<EleveCours>} Le cours complet avec son contenu.
 */
export const getOneEleveCourse = async (
  eleveId: number,
  courseId: number
): Promise<EleveCours> => {
  const endpoint = CourseEndpoints.GET_ONE_ELEVE_COURSE
    .replace("{eleveId}", eleveId.toString())
    .replace("{coursId}", courseId.toString());

  const response = await request.get<{ type: string; cours: Omit<EleveCours, 'type'> }>(endpoint);
  return { ...response.cours, type: response.type as "manuel" | "genere" };
};
