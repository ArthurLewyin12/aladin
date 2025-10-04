import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactivateGroupe } from "@/services/controllers/groupe.controller";
import { toast } from "sonner";

export const useReactivateGroupe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateGroupe,
    onSuccess: () => {
      toast.success("Groupe réactivé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["groupes"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Une erreur est survenue lors de la réactivation du groupe.",
      );
    },
  });
};
