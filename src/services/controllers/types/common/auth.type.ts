export interface ActivateCouponPayload {
  coupon_code: string;
}

export interface SubscriptionDetails {
  start: string;
  end: string;
}

export interface ActivateCouponResponse {
  success: boolean;
  message: string;
  subscription: SubscriptionDetails;
}

export type RefreshTokenSuccesResponse = {
  succes: true;
  token: string;
  refresh_token: string;
};

export type RefreshTokenErrorResponse = {
  succes: false;
  message: string;
};

export type RefreshTokenResponse =
  | RefreshTokenSuccesResponse
  | RefreshTokenErrorResponse;
