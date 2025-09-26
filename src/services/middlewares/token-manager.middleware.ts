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
    const responseData = response.data;
    if (!responseData.token) {
      foundInResponse = false;
    }
    if (foundInResponse) {
      authHeader = responseData.token;
      refreshTokenHeader = responseData.refresh_token;
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
