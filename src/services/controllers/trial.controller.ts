import { request } from "@/lib/request";
import { TrialEndpoint } from "@/constants/endpoints";
import { TrialStatusResponse } from "./types/common/trial.type";

export const getTrialStatus = async (): Promise<TrialStatusResponse> => {
  const response = await request.get<TrialStatusResponse>(TrialEndpoint.STATUS);
  return response;
};
