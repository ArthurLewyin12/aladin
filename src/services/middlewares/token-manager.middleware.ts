import ENVIRONNEMENTS from "@/constants/environnement";
import Cookies from "js-cookie";
import { ResponseMiddleware } from "./types/response.middleware";

export const tokenMiddleware: ResponseMiddleware = (response, next) => {
  let authHeader =
    response.headers["Authorization"] || response.headers["authorization"];
  let refreshTokenHeader =
    response.headers["RefreshToken"] || response.headers["refreshToken"];

  let foundInResponse = true;
  if (response.data) {
    const responseData = response.data.data;
    if (!responseData.token) {
      foundInResponse = false;
    }
    if (foundInResponse) {
      const tokenResult: any = responseData.token;
      authHeader = tokenResult.access_token;
      refreshTokenHeader = tokenResult.refresh_token;
    }
  }

  if (authHeader) {
    Cookies.set("token_" + ENVIRONNEMENTS.UNIVERSE, authHeader);
  }
  if (refreshTokenHeader) {
    Cookies.set("refreshToken_" + ENVIRONNEMENTS.UNIVERSE, refreshTokenHeader);
  }

  return next(response);
};
