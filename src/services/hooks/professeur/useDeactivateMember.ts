import { useMutation } from "@tanstack/react-query";
import { deactivateMember } from "@/services/controllers/professeur.controller";

interface UseDeactivateMemberProps {
  classeId: number;
  memberId: number;
}

export const useDeactivateMember = () => {
  return useMutation({
    mutationFn: ({ classeId, memberId }: UseDeactivateMemberProps) =>
      deactivateMember(classeId, memberId),
  });
};
