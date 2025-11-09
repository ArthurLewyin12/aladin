interface SimpleMatiere {
  id: number;
  libelle: string;
  label?: string;
}

interface SimpleChapitre {
  id: number;
  libelle: string;
}

export interface StudyPlan {
  id: number;
  weekday: number;
  start_time: string;
  end_time: string;
  matiere: SimpleMatiere;
  chapitre_ids: number[];
  chapitres: SimpleChapitre[];
}

export interface GetStudyPlansResponse {
  success: boolean;
  plans: StudyPlan[];
}

export interface CreateStudyPlanPayload {
  weekday: number;
  start_time: string; // "HH:mm"
  end_time: string; // "HH:mm"
  matiere_id: number;
  chapitre_ids: number[];
}

// Successful response for POST
export interface CreateStudyPlanSuccessResponse {
  success: true;
  plan: StudyPlan;
  message: string;
}

// Conflict error response for POST (422)
export interface StudyPlanConflict {
  id: number;
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface CreateStudyPlanConflictResponse {
  success: false;
  message: string;
  conflict: StudyPlanConflict;
  suggestion: string;
}

export type CreateStudyPlanResponse =
  | CreateStudyPlanSuccessResponse
  | CreateStudyPlanConflictResponse;

export type UpdateStudyPlanPayload = Partial<CreateStudyPlanPayload>;

export interface UpdateStudyPlanSuccessResponse {
  success: true;
  plan: StudyPlan;
  message: string;
}

export type UpdateStudyPlanResponse =
  | UpdateStudyPlanSuccessResponse
  | CreateStudyPlanConflictResponse;

export interface DeleteStudyPlanResponse {
  success: boolean;
  message: string;
}
