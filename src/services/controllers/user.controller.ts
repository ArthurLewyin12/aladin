import { request } from "@/lib/request";
import { UserEndpoint } from "@/constants/endpoints";
import {
  ActivateResponseDto,
  ActivationAccountDto,
  CreateUserDto,
  RegisterResponseDto,
  ResendActivationCodeRequest,
  ResendActivationCodeSuccessResponse,
  ResendActivationCodeAlreadyVerifiedResponse,
  ResendActivationCodeRateLimitResponse,
  UpdateUserInfoPayload,
  UpdateUserPasswordPayload,
} from "./types/common/user.type";

type ResendActivationCodeResponse =
  | ResendActivationCodeSuccessResponse
  | ResendActivationCodeAlreadyVerifiedResponse
  | ResendActivationCodeRateLimitResponse;

/**
 * Crée un nouveau compte utilisateur.
 * @param {CreateUserDto} payload - Les informations de l'utilisateur à créer.
 * @returns {Promise<RegisterResponseDto>} La réponse de l'API.
 */
export const register = async (
  payload: CreateUserDto,
): Promise<RegisterResponseDto> => {
  return request.post<RegisterResponseDto>(UserEndpoint.REGISTER, payload);
};

/**
 * Active un compte utilisateur avec un code.
 * @param {ActivationAccountDto} payload - L'email et le code d'activation.
 * @returns {Promise<ActivateResponseDto>} La réponse de l'API.
 */
export const activateAccount = async (
  payload: ActivationAccountDto,
): Promise<ActivateResponseDto> => {
  return request.post<ActivateResponseDto>(UserEndpoint.ACTIVATE, payload);
};

/**
 * Renvoie le code d'activation à l'email de l'utilisateur.
 * @param {ResendActivationCodeRequest} payload - L'email de l'utilisateur.
 * @returns {Promise<ResendActivationCodeResponse>} La réponse de l'API.
 */
export const resendActivationCode = async (
  payload: ResendActivationCodeRequest,
): Promise<ResendActivationCodeResponse> => {
  return request.post<ResendActivationCodeResponse>(
    UserEndpoint.RESEND_ACTIVATION,
    payload,
  );
};

/**
 * met à jour les infos utilisateurs
 * @param payload
 * @returns une string appelé message
 */
export const UpdateUserInfo = async (
  payload: Partial<UpdateUserInfoPayload>,
): Promise<string> => {
  return request.put(UserEndpoint.UPDATE_USER_SETTINGS, payload);
};

/**
 * met à jour le password du user
 * @param payload
 * @returns  elle retourne une promise d'un string message
 */

export const UpdateUserPassword = async (
  payload: UpdateUserPasswordPayload,
): Promise<String> => {
  return request.put(UserEndpoint.UPDATE_USER_PASSWORD, payload);
};
