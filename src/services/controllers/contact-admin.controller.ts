import { ConctactAdminEndpoints } from "@/constants/endpoints";
import { request } from "@/lib/request";

export const ContactAdmin = async (motif: string): Promise<string> => {
  return request.post<string>(ConctactAdminEndpoints.CONTACT, { motif });
};
