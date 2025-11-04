import { useMutation } from "@tanstack/react-query";
import { reactivateMember } from "@/services/controllers/professeur.controller";

interface UseReactivateMemberProps {
  classeId: number;
  memberId: number;
}

export const useReactivateMember = () => {
  return useMutation({
    mutationFn: ({ classeId, memberId }: UseReactivateMemberProps) =>
      reactivateMember(classeId, memberId),
  });
};
