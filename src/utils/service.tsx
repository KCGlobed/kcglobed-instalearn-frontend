import { API_ENDPOINTS } from "./apiEndpoints";
import { apiRequest } from "./apiRequest";

export const forgotPassword = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.FORGOT_PASSWORD, 'POST', payload);
};

export const resetPassword = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.RESET_PASSWORD, 'POST', payload);
};


export const courseTag = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.TAG, 'GET');
};
