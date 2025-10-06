import { useMutation } from "@tanstack/react-query";
import { startWaveCheckout } from "@/services/controllers/payment.controller";
import {
  WaveCheckoutPayload,
  WaveCheckoutResponse,
} from "@/services/controllers/types/common/payment.type";

export const useWaveCheckout = () => {
  return useMutation<WaveCheckoutResponse, Error, WaveCheckoutPayload>({
    mutationFn: async (payload: WaveCheckoutPayload) => {
      return startWaveCheckout(payload);
    },
  });
};
