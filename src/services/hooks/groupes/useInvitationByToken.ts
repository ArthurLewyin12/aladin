import { useQuery } from "@tanstack/react-query";
import { getInvitationByToken } from "@/services/controllers/groupe.controller";
import { createQueryKey } from "@/lib/request";
import { InvitationDetails } from "@/services/controllers/types/common";

export const useInvitationByToken = (token: string) => {
  return useQuery<InvitationDetails>({
    queryKey: createQueryKey("invitation", token),
    queryFn: () => getInvitationByToken(token),
    enabled: !!token, // Only run the query if the token exists
  });
};