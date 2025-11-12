import { useQuery } from "@tanstack/react-query";
import { getClassMembers } from "@/services/controllers/professeur.controller";
import { GetClassMembersResponse } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

export const useGetClassMembers = (classeId: number) => {
  return useQuery<GetClassMembersResponse>({
    queryKey: createQueryKey("professeur", "classes", classeId.toString(), "members"),
    queryFn: () => getClassMembers(classeId),
    enabled: !!classeId,
  });
};
