import { request } from "@/lib/request";
import { DonateurEndpoint } from "@/constants/endpoints";
import {
  InitiateDonationPayload,
  InitiateDonationResponse,
} from "./types/common/donateur.type";

export const initiateDonation = async (
  payload: InitiateDonationPayload,
): Promise<InitiateDonationResponse> => {
  const response = await request.post<InitiateDonationResponse>(
    DonateurEndpoint.INITIATE,
    payload,
  );
  return response;
};
