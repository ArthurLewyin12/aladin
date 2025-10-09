import { ContactAdmin } from "@/services/controllers/contact-admin.controller";
import { useMutation } from "@tanstack/react-query";

export const useContactAdmin = () => {
  return useMutation({
    mutationFn: ContactAdmin,
  });
};
