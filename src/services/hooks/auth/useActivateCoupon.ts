import { useMutation } from "@tanstack/react-query";
import { activateCoupon } from "@/services/controllers/auth.controller";
import {
  ActivateCouponPayload,
  ActivateCouponResponse,
} from "@/services/controllers/types/common/auth.type";

export const useActivateCoupon = () => {
  return useMutation<ActivateCouponResponse, Error, ActivateCouponPayload>({
    mutationFn: async (payload: ActivateCouponPayload) => {
      return activateCoupon(payload);
    },
  });
};
