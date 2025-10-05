import { useMutation } from "@tanstack/react-query";
import { initiateDonation } from "@/services/controllers/donateur.controller";
import {
  InitiateDonationPayload,
  InitiateDonationResponse,
} from "@/services/controllers/types/common/donateur.type";

export const useInitiateDonation = () => {
  return useMutation<InitiateDonationResponse, Error, InitiateDonationPayload>({
    mutationFn: async (payload: InitiateDonationPayload) => {
      return initiateDonation(payload);
    },
  });
};
