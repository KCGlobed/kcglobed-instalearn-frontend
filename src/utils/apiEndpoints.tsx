
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_ENDPOINTS = {
    HOMEPAGE_CATEGORY: "course/homepage-category-list/",
    LOGIN: "user/login/",
    FORGOT_PASSWORD: "user/forgot-password/",
    RESET_PASSWORD: "user/reset-password/",
    TAG: "course/homepage-tags/",
    COURSE_BY_ID: "course/homepage-tag-wise-courses",
    COURSE_LIST: "course/search/course/",
    COURSE_DETAIL: "course/course-detail/",
    ADD_TO_CART: "subscription/add-to-cart/",
    CHECK_COURSE_CART: "subscription/check-course-cart/",
    VIEW_CART: "subscription/view-cart/",
    HOMEPAGE_RECENTLY_ADDED: "course/homepage-recent-courses/",
    START_PAYMENT: "subscription/start-course-payment/",
    COMPLETE_PAYMENT: "subscription/complete-course-payment/",
    REMOVE_FROM_CART: "subscription/remove-to-cart/",
    WISHLIST: "user_study/get-user-wishlist/",
    TOGGLE_WISHLIST: "user_study/update-wishlist/",

    // -----------Abhishek Work--------------------
    CATEGORY_FILTER: "course/search/filters-list/",
    COURSE_SEARCH_FILTER: "course/search/course/",



}