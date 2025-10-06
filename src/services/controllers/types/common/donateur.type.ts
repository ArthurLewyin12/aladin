export interface InitiateDonationPayload {
  type: "entreprise" | "particulier";
  nom: string;
  email: string;
  nombre_coupons: number;
  currency: string;
}

export interface InitiateDonationResponse {
  donateur: {
    public_id: string;
  };
}
