import { SubscriptionDetails } from "./auth.type";

export interface WaveCheckoutPayload {
  amount: number;
  currency: string;
}

export interface WaveCheckoutResponse {
  launch_url: string;
  payment_token: string;
}

export interface PaymentCallbackSuccessResponse {
  status: "success";
  subscription: SubscriptionDetails;
}

export interface PaymentCallbackErrorResponse {
  status: "error";
  message: string;
}
