import { request } from "@/lib/request";
import { AuthEndpoints } from "@/constants/endpoints";
import { LoginPayload, LoginResponse, User } from "./types/auth.types";

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
 * @returns {Promise<LoginResponse>} La réponse de l'API, incluant potentiellement un token.
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return request.post<LoginResponse>(AuthEndpoints.LOGIN, payload);
};

/**
 * Récupère les informations de l'utilisateur actuellement authentifié.
 * @returns {Promise<User>} Les données de l'utilisateur.
 */
export const getMe = async (): Promise<User> => {
  return request.get<User>(AuthEndpoints.AUTH_ME);
};

/**
 * Déconnecte l'utilisateur actuellement authentifié.
 * @returns {Promise<void>}
 */
export const logout = async (): Promise<void> => {
  return request.post<void>(AuthEndpoints.AUTH_LOGOUT);
};
