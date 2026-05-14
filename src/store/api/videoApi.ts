import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, API_ENDPOINTS } from "../../utils/apiEndpoints";
import { getToken } from "../../utils/tokenStorage";

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    watchVideo: builder.mutation<any, { course_id: number; lecture_id: number; duration: number }>({
      query: (payload) => ({
        url: API_ENDPOINTS.WATCHED_VIDEO,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useWatchVideoMutation } = videoApi;
