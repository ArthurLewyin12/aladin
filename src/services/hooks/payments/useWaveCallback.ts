import { useQuery } from "@tanstack/react-query";
import {
  handleWaveSuccessCallback,
  handleWaveErrorCallback,
} from "@/services/controllers/payment.controller";
import {
  PaymentCallbackSuccessResponse,
  PaymentCallbackErrorResponse,
} from "@/services/controllers/types/common/payment.type";

import { createQueryKey } from "@/lib/request";

interface UseWaveCallbackProps {
  token: string;
  isSuccessCallback: boolean; // true pour succès, false pour erreur
}

export const useWaveCallback = ({
  token,
  isSuccessCallback,
}: UseWaveCallbackProps) => {
  return useQuery<
    PaymentCallbackSuccessResponse | PaymentCallbackErrorResponse,
    Error
  >({
    queryKey: createQueryKey("waveCallback", token, String(isSuccessCallback)),
    queryFn: async () => {
      if (isSuccessCallback) {
        return handleWaveSuccessCallback(token);
      } else {
        return handleWaveErrorCallback(token);
      }
    },
    enabled: !!token, // N'exécuter la requête que si le token est présent
    retry: false, // Ne pas réessayer en cas d'échec
  });
};
