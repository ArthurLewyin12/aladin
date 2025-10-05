import { request } from "@/lib/request";
import { PaymentEndpoint } from "@/constants/endpoints";
import {
  WaveCheckoutPayload,
  WaveCheckoutResponse,
  PaymentCallbackSuccessResponse,
  PaymentCallbackErrorResponse,
} from "./types/common/payment.type";

export const startWaveCheckout = async (
  payload: WaveCheckoutPayload,
): Promise<WaveCheckoutResponse> => {
  const response = await request.post<WaveCheckoutResponse>(
    PaymentEndpoint.WAVE_USER_CHECKOUT,
    payload,
  );
  return response;
};

export const handleWaveSuccessCallback = async (
  token: string,
): Promise<PaymentCallbackSuccessResponse> => {
  const response = await request.get<PaymentCallbackSuccessResponse>(
    `${PaymentEndpoint.WAVE_USER_SUCCESS}/${token}`,
  );
  return response;
};

export const handleWaveErrorCallback = async (
  token: string,
): Promise<PaymentCallbackErrorResponse> => {
  const response = await request.get<PaymentCallbackErrorResponse>(
    `${PaymentEndpoint.WAVE_USER_ERROR}/${token}`,
  );
  return response;
};
