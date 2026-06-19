import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCourseSearchFilteApi } from "../../utils/service";

export interface Pagination {
    total_results: number;
    total_pages: number;
    current_page: number;
    next_page: string | null;
    previous_page: string | null;
    page_size: number;
}

export interface CourseState {
    courses: any[];
    pagination: Pagination | null;
    loading: boolean;
    isFetchingMore: boolean;
    error: string | null;
}

const initialState: CourseState = {
    courses: [],
    pagination: null,
    loading: false,
    isFetchingMore: false,
    error: null,
};

export interface FilterCourseParams {
    subcategory?: number[];
    name?: string;
    tags?: number[];
    level?: number[];
    rating?: number[];
    ordering?: string;
}

const getQueryParamsFromUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        return urlObj.search.slice(1);
    } catch (e) {
        const index = url.indexOf('?');
        return index !== -1 ? url.slice(index + 1) : '';
    }
};

export const filterCoursesListParams = createAsyncThunk<{ courses: any[], pagination: Pagination | null }, FilterCourseParams, { rejectValue: string }>(
    "course/fetchCoursesParams",
    async (filter: FilterCourseParams, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();

            if (filter?.subcategory?.length) {
                params.append("subcategories", filter.subcategory.join(","));
            }

            if (filter?.name?.length) {
                params.append("name", filter.name);
            }

            if (filter?.tags?.length) {
                params.append("tags", filter.tags.join(","));
            }

            if (filter?.level?.length) {
                params.append("level", filter.level.join(","));
            }

            if (filter?.rating?.length) {
                params.append("rating", filter.rating.join(","));
            }

            if (filter?.ordering?.length) {
                params.append("ordering", filter.ordering);
            }

            const response: any = await getCourseSearchFilteApi(params.toString());

            const courses = response?.data && Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
            const pagination = response?.pagination || null;
            return { courses, pagination };
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch courses");
        }
    }
);

export const loadMoreCourses = createAsyncThunk<{ courses: any[], pagination: Pagination | null }, string, { rejectValue: string }>(
    "course/loadMoreCourses",
    async (nextPageUrl: string, { rejectWithValue }) => {
        try {
            const queryParams = getQueryParamsFromUrl(nextPageUrl);
            const response: any = await getCourseSearchFilteApi(queryParams);

            const courses = response?.data && Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
            const pagination = response?.pagination || null;
            return { courses, pagination };
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to load more courses");
        }
    }
);

const filterCoursesParamsSlice = createSlice({
    name: "filterCourseParams",
    initialState,
    reducers: {
        clearFilterCourseStatus: (state) => {
            state.loading = false;
            state.isFetchingMore = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(filterCoursesListParams.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.courses = [];
                state.pagination = null;
            })
            .addCase(filterCoursesListParams.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.courses;
                state.pagination = action.payload.pagination;
            })
            .addCase(filterCoursesListParams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(loadMoreCourses.pending, (state) => {
                state.isFetchingMore = true;
                state.error = null;
            })
            .addCase(loadMoreCourses.fulfilled, (state, action) => {
                state.isFetchingMore = false;
                const existingIds = new Set(state.courses.map((c: any) => c.id));
                const newCourses = action.payload.courses.filter((c: any) => !existingIds.has(c.id));
                state.courses = [...state.courses, ...newCourses];
                state.pagination = action.payload.pagination;
            })
            .addCase(loadMoreCourses.rejected, (state, action) => {
                state.isFetchingMore = false;
                state.error = action.payload as string || "An error occurred";
            });
    },
});

export const { clearFilterCourseStatus } = filterCoursesParamsSlice.actions;
export default filterCoursesParamsSlice.reducer;