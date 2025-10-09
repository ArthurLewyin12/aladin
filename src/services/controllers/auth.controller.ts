import { request } from "@/lib/request";
import { AuthEndpoints, UserEndpoint } from "@/constants/endpoints";
import {
  LoginPayload,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendPasswordResetLinkRequest,
  SendPasswordResetLinkResponse,
  User,
  GetMeResponse,
} from "./types/auth.types";
import {
  ActivateCouponPayload,
  ActivateCouponResponse,
  RefreshTokenResponse,
} from "./types/common/auth.type";

/**
 * Récupère le cookie CSRF en initialisant une session sécurisée.
 * @returns {Promise<void>}
 */
export const getCsrfCookie = async (): Promise<void> => {
  await request.get(AuthEndpoints.CSRF_COOKIE);
};

/**
 * Tente de connecter un utilisateur avec ses identifiants.
 * @param {LoginPayload} payload - Les informations de connexion (email, mot de passe).
 * @returns {Promise<LoginResponse>} La réponse de l'API.
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return request.post<LoginResponse>(AuthEndpoints.LOGIN, payload);
};

/**
 * Récupère les informations de l'utilisateur actuellement authentifié.
 * @returns {Promise<GetMeResponse>} Les données de l'utilisateur.
 */
export const getMe = async (): Promise<GetMeResponse> => {
  return request.get<GetMeResponse>(AuthEndpoints.AUTH_ME);
};

/**
 * Déconnecte l'utilisateur actuellement authentifié.
 * @returns {Promise<void>}
 */
export const logout = async (): Promise<void> => {
  return request.post<void>(AuthEndpoints.AUTH_LOGOUT);
};

/**
 * Active un abonnement utilisateur via un code promo.
 * @param {ActivateCouponPayload} payload - Le code promo à activer.
 * @returns {Promise<ActivateCouponResponse>} La réponse de l'API, incluant les détails de l'abonnement.
 */
export const activateCoupon = async (
  payload: ActivateCouponPayload,
): Promise<ActivateCouponResponse> => {
  const response = await request.post<ActivateCouponResponse>(
    UserEndpoint.ACTIVATE_COUPON,
    payload,
  );
  return response;
};

/**
 * Envoie un lien de réinitialisation de mot de passe à l'email de l'utilisateur.
 * @param {SendPasswordResetLinkRequest} payload - L'email de l'utilisateur.
 * @returns {Promise<SendPasswordResetLinkResponse>} La réponse de l'API.
 */
export const sendPasswordResetLink = async (
  payload: SendPasswordResetLinkRequest,
): Promise<SendPasswordResetLinkResponse> => {
  return request.post<SendPasswordResetLinkResponse>(
    AuthEndpoints.RESET_LINK,
    payload,
  );
};

/**
 * Réinitialise le mot de passe de l'utilisateur.
 * @param {ResetPasswordRequest} payload - Le token, l'email et le nouveau mot de passe.
 * @returns {Promise<ResetPasswordResponse>} La réponse de l'API.
 */
export const resetPassword = async (
  payload: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  return request.post<ResetPasswordResponse>(
    AuthEndpoints.PASSWORD_RESET,
    payload,
  );
};

/**
 * Rafraîchit le token d'authentification en utilisant un token de rafraîchissement.
 * @param refresh_token
 * @returns {Promise<RefreshTokenResponse>}
 */
export const refreshToken = async (
  refresh_token: string,
): Promise<RefreshTokenResponse> => {
  return request.post<RefreshTokenResponse>(AuthEndpoints.REFRESH_TOKEN, {
    refresh_token,
  });
};
