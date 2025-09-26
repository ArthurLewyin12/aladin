import { request } from "@/lib/request";
import { AuthEndpoints } from "@/constants/endpoints";
import { LoginPayload, LoginResponse, User } from "./types/auth.types";

export const getCsrfCookie = async (): Promise<void> => {
  await request.get(AuthEndpoints.CSRF_COOKIE);
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return request.post<LoginResponse>(AuthEndpoints.LOGIN, payload);
};

export const getMe = async (): Promise<User> => {
  return request.get<User>(AuthEndpoints.AUTH_ME);
};

export const logout = async (): Promise<void> => {
  return request.post<void>(AuthEndpoints.AUTH_LOGOUT);
};
