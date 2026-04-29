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

export const courseById = async (payload: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.COURSE_BY_ID}/${payload}`, 'GET');
};

export const courseList = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.COURSE_LIST, 'GET');
};

export const courseDetailById = async (payload: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.COURSE_DETAIL}${payload}`, 'GET');
};

export const addToCart = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.ADD_TO_CART, 'POST', payload);
};

export const checkCourseCart = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.CHECK_COURSE_CART, 'POST', payload);
};

export const viewCart = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.VIEW_CART, 'POST', payload);
};

export const homepageRecentlyAddedApi = async (): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.HOMEPAGE_RECENTLY_ADDED}`, 'GET');
}

export const startPayment = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.START_PAYMENT, 'POST', payload);
}

export const completePayment = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.COMPLETE_PAYMENT, 'POST', payload);
}
