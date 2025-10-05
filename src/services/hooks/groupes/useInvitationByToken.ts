import { useQuery } from "@tanstack/react-query";
import { getInvitationByToken } from "@/services/controllers/groupe.controller";
import { createQueryKey } from "@/lib/request";

export const useInvitationByToken = (token: string) => {
  return useQuery({
    queryKey: createQueryKey("invitation", token),
    queryFn: () => getInvitationByToken(token),
    enabled: !!token, // Only run the query if the token exists
  });
};