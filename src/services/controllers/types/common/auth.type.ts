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
