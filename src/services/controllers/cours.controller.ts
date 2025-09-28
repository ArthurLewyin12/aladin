import { CourseEndpoints } from "@/constants/endpoints";
import { GenerateCoursResponse } from "./types/common/cours.type";
import { request } from "@/lib/request";

export const expliquerCours = async (
  chapter_id: string,
): Promise<GenerateCoursResponse> => {
  return request.post(
    CourseEndpoints.COURSES_BY_CHAPITRE,
    { chapter_id },
    { timeout: 60000 }, // 60 seconds timeout
  );
};
