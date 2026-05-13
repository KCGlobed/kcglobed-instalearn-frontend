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

export const removeFromCartApi = async (id: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.REMOVE_FROM_CART}${id}`, 'DELETE');
}

export const toggleWishlistApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.TOGGLE_WISHLIST, 'POST', payload);
}

export const wishlistApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.WISHLIST, 'GET');
}

export const getCategoryFilterApi = async (): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.CATEGORY_FILTER}`, 'GET');
}

export const getCourseSearchFilteApi = async (params: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.COURSE_SEARCH_FILTER}?${params}`, 'GET');
}

export const unreadNotificationApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.UNREAD_NOTIFICATION, 'GET');
}

export const markAsReadApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.MARK_AS_READ, 'POST', payload);
}

export const allNotificationApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.ALL_NOTIFICATION, 'GET');
}

export const notificationSettingsGetApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.NOTIFICATION_SETTINGS_GET, 'GET');
}

export const notificationSettingsUpdateApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.NOTIFICATION_SETTINGS_UPDATE, 'POST', payload);
}

export const getUserProfileApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.GET_USER_PROFILE, 'GET');
}

export const updateUserProfileApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.UPDATE_USER_PROFILE, 'POST', payload);
}

export const updateProfilePictureApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.UPDATE_PROFILE_PICTURE, 'POST', payload);
}

export const myCoursesApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.MY_COURSES, 'GET');
}

export const createMyListApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.ADD_TO_MY_LIST, 'POST', payload);
}

export const getDashboardChaptersApi = async (slug: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.GET_DASHBOARD_CHAPTERS}${slug}`, 'GET');
}

export const getDashboardChapterLecturesApi = async (slug: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.GET_DASHBOARD_CHAPTER_LECTURES}/${slug}`, 'GET');
}

export const getDashboardPdfSignedUrlApi = async (lectureId: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.GET_DASHBOARD_PDF_SIGNED_URL}/${lectureId}`, 'GET');
}



