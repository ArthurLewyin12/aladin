import { request } from "@/lib/request";
import { UserEndpoint } from "@/constants/endpoints";
import {
  ActivationAccountDto,
  ActivateResponseDto,
  CreateUserDto,
  RegisterResponseDto,
} from "./types/common/user.type";

export const register = async (
  payload: CreateUserDto,
): Promise<RegisterResponseDto> => {
  return request.post(UserEndpoint.REGISTER, payload);
};

export const activateAccount = async (
  payload: ActivationAccountDto,
): Promise<ActivateResponseDto> => {
  return request.post(UserEndpoint.ACTIVATE, payload);
};
