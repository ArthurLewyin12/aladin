import { request } from "@/lib/request";
import { StudyPlanEndpoints } from "@/constants/endpoints";
import {
  GetStudyPlansResponse,
  CreateStudyPlanPayload,
  CreateStudyPlanResponse,
  UpdateStudyPlanPayload,
  UpdateStudyPlanResponse,
  DeleteStudyPlanResponse,
} from "./types/common/study-plan.types";

/**
 * Récupère tous les créneaux du planning d'études de l'élève.
 * @returns {Promise<GetStudyPlansResponse>} La liste des créneaux.
 */
export const getStudyPlans = async (): Promise<GetStudyPlansResponse> => {
  return request.get<GetStudyPlansResponse>(StudyPlanEndpoints.GET_ALL);
};

/**
 * Crée un nouveau créneau dans le planning d'études.
 * @param {CreateStudyPlanPayload} payload - Les informations du créneau à créer.
 * @returns {Promise<CreateStudyPlanResponse>} Le créneau créé ou une erreur de conflit.
 */
export const createStudyPlan = async (
  payload: CreateStudyPlanPayload,
): Promise<CreateStudyPlanResponse> => {
  return request.post<CreateStudyPlanResponse>(
    StudyPlanEndpoints.CREATE,
    payload,
  );
};

/**
 * Met à jour un créneau existant dans le planning.
 * @param {number} id - L'ID du créneau à mettre à jour.
 * @param {UpdateStudyPlanPayload} payload - Les informations à modifier.
 * @returns {Promise<UpdateStudyPlanResponse>} Le créneau mis à jour ou une erreur de conflit.
 */
export const updateStudyPlan = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateStudyPlanPayload;
}): Promise<UpdateStudyPlanResponse> => {
  const endpoint = StudyPlanEndpoints.UPDATE.replace("{id}", id.toString());
  return request.put<UpdateStudyPlanResponse>(endpoint, payload);
};

/**
 * Supprime un créneau du planning.
 * @param {number} id - L'ID du créneau à supprimer.
 * @returns {Promise<DeleteStudyPlanResponse>} Une confirmation de suppression.
 */
export const deleteStudyPlan = async (
  id: number,
): Promise<DeleteStudyPlanResponse> => {
  const endpoint = StudyPlanEndpoints.DELETE.replace("{id}", id.toString());
  return request.delete<DeleteStudyPlanResponse>(endpoint);
};
