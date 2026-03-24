import { API_ENDPOINTS } from "./apiEndpoints";
import { apiRequest } from "./apiRequest";

export const forgotPassword = async(payload:any):Promise<any> => {
  return await apiRequest(API_ENDPOINTS.FORGOT_PASSWORD, 'POST', payload);
};