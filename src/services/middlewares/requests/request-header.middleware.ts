import ENVIRONNEMENTS from "@/constants/environnement";
import Cookies from "js-cookie";
import { RequestMiddleware } from "../types/request.middleware";

export const requestHeaderMiddleware: RequestMiddleware = async (
  config,
  next,
) => {
  const token = Cookies.get("token_" + ENVIRONNEMENTS.UNIVERSE);

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return next(config);
};
