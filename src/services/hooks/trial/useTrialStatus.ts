import { useQuery } from "@tanstack/react-query";
import { getTrialStatus } from "@/services/controllers/trial.controller";
import { TrialStatusResponse } from "@/services/controllers/types/common/trial.type";
import { createQueryKey } from "@/lib/request";

export const useTrialStatus = () => {
  return useQuery<TrialStatusResponse, Error>({
    queryKey: createQueryKey("trialStatus"),
    queryFn: async () => {
      return getTrialStatus();
    },
  });
};
