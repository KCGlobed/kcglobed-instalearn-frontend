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

export const getCategoryCoursesApi = async (id: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.CATEGORY_COURSES}${id}`, 'GET');
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

export const watchedVideoApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.WATCHED_VIDEO, 'POST', payload);
}

export const getCourseProgressApi = async (courseId: number): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.GET_COURSE_PROGRESS}${courseId}`, 'GET');
}

export const registerUserApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.REGISTER, 'POST', payload);
}

export const verifyOtpApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.VERIFY_OTP, 'POST', payload);
}

export const getAllNotesApi = async (courseId: number): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.ALL_LECTURE_NOTES}/${courseId}`, 'GET');
}

export const createNoteApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.CREATE_NOTE, 'POST', payload);
}

export const updateNoteApi = async (courseId: number, payload: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.UPDATE_NOTE}${courseId}`, 'POST', payload);
}

export const deleteNoteApi = async (id: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.DELETE_NOTE}${id}`, 'DELETE');
}

export const addReviewRatingApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.ADD_REVIEW_RATING, 'POST', payload);
}

export const getReviewRatingApi = async (courseId: number): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.GET_REVIEW_RATING}/${courseId}`, 'GET');
}

export const updateReviewRatingApi = async (courseId: number, payload: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.UPDATE_REVIEW_RATING}${courseId}`, 'POST', payload);
}

export const deleteReviewRatingApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.DELETE_REVIEW_RATING, 'POST', payload);
}

export const getAnnouncementsApi = async (courseId: number): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.GET_ANNOUNCEMENTS}/${courseId}`, 'GET');
}

export const addCommentOnAnnouncementsApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.ADD_COMMENT_ON_ANNOUNCEMENTS, 'POST', payload);
}

export const createReminderApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.CREATE_REMINDER, 'POST', payload);
}

export const updateReminderApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.UPDATE_REMINDER, 'POST', payload);
}

export const deleteReminderApi = async (id: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.DELETE_REMINDER}${id}`, 'DELETE');
}

export const getReminderApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.GET_REMINDER, 'GET');
}

export const getUserCourseReviewComments = async (courseId: number): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.GET_COURSE_REVIEW_COMMENTS}/${courseId}`, 'GET');
}

export const getGlobalSearchApi = async (query: string): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.GET_GLOBAL_SEARCH}?name=${query}`, 'GET');
}

export const quickContactApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.CREATE_QUICK_CONTACT, 'POST', payload);
}

export const getRelatedCourseApi = async (payload: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.RELATED_COURSE}?course_id=${payload}`, 'GET');
}

export const getBlogCategoryApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.BLOG_CATEGORY, 'GET');
}

export const getBlogByCategoryApi = async (categoryId: any): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.BLOG_BY_CATEGORY}${categoryId}`, 'GET');
}

export const getAllBlogApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.ALL_BLOG, 'GET');
}

export const getFeaturedBlogApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.FEATURED_BLOG, 'GET');
}

export const getBlogDetailApi = async (slug: string): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.BLOG_DETAIL}/${slug}`, 'GET');
}

export const getCourseCertificate = async (courseId: number): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.DOWNLOAD_CERTIFICATE}${courseId}`, 'GET');
}

export const getPurchaseHistory = async (): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.PURCHASE_HISTORY}`, 'GET');
}

export const socialLoginApi = async (payload: {
  name: string;
  email: string;
  social_id: string;
  social_type: string;
  token: string;
  role: string;
  device_id: string;
  device_type: string;
}): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.SOCIAL_LOGIN, 'POST', payload);
}

export const markCourseStartedApi = async (payload: any): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.MARK_COURSE_STARTED, 'POST', payload);
}

export const getHelpAndSupportTopicListApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.HELP_AND_SUPPORT_TOPIC_LIST, 'GET');
}

export const getHelpAndSupportSubtopicListApi = async (slug: string): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.HELP_AND_SUPPORT_SUBTOPIC_LIST}${slug}`, 'GET');
}

export const getHelpAndSupportArticleListApi = async (slug: string): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.HELP_AND_SUPPORT_ARTICLE_LIST}${slug}`, 'GET');
}

export const getHelpAndSupportArticleDetailApi = async (slug: string): Promise<any> => {
  return await apiRequest(`${API_ENDPOINTS.HELP_AND_SUPPORT_ARTICLE_DETAIL}${slug}`, 'GET');
}

export const getTopCoursesApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.GET_TOP_COURSES, 'GET');
}

export const getTopCategoriesApi = async (): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.GET_TOP_CATEGORIES, 'GET');
}

export const submitApplicationFormApi = async (payload: FormData): Promise<any> => {
  return await apiRequest(API_ENDPOINTS.SUBMIT_APPLICATION_FORM, 'POST', payload);
};








