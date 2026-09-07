import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getChapterQuizApi, startChapterQuizApi, submitQuizAnswerApi, getQuizResultApi } from "../../utils/service";

// ─────────────────────────────────────────────
// Interfaces – Quiz List (chapter quiz listing)
// ─────────────────────────────────────────────

export interface QuizChapter {
    id: number;
    name: string;
}

export interface Quiz {
    id: number;
    name: string;
    description: string;
    thumbnail: string;
    chapter: QuizChapter;
    status: boolean;
    pass_percentage: number;
    total_question: number;
    created_at: string;
}

// ─────────────────────────────────────────────
// Interfaces – Start Quiz API Response
// ─────────────────────────────────────────────

export interface QuizOption {
    id: number;
    option: string;
}

export interface QuizQuestionDetail {
    id: number;
    question: string;            // may contain HTML
    solution_description: string; // may contain HTML
}

export interface QuizQuestionInfo {
    id: number;
    level: number;
    id_number: string;
    question_detail: QuizQuestionDetail;
    options: QuizOption[];
}

export interface ActiveTestQuestion {
    id: number;                   // test_question id
    question_info: QuizQuestionInfo;
    result: number;
    attempted: boolean;
    time_taken: number;
    selected_option: number | null;
}

export interface ActiveQuizData {
    id: number;                         // test / session id
    total_question: number;
    total_right_answer_given: number;
    total_wrong_answer_given: number;
    total_never_attempt_question: number;
    total_time_taken: number;
    status: boolean;
    created_at: string;
    test_questions: ActiveTestQuestion[];
}

// Per-question submission payload
export interface SubmitAnswerPayload {
    practice_test_id: number;
    question_id: number;
    selected_option_id: number | null;
    time_taken: number;
    is_completed: 0 | 1;
}

// ─────────────────────────────────────────────
// Slice State
// ─────────────────────────────────────────────

export interface QuizState {
    // Quiz listing
    quizzes: Quiz[];
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;

    // Active quiz session (after start-quiz API call)
    activeQuiz: ActiveQuizData | null;
    startQuizLoading: boolean;
    startQuizError: string | null;

    // Per-question answer submission
    submitting: boolean;
    submitError: string | null;

    // Quiz result screen data
    quizResult: ActiveQuizData | null;
    quizResultLoading: boolean;
    quizResultError: string | null;
}

const initialState: QuizState = {
    quizzes: [],
    loading: false,
    error: null,
    success: false,
    message: null,

    activeQuiz: null,
    startQuizLoading: false,
    startQuizError: null,

    submitting: false,
    submitError: null,

    quizResult: null,
    quizResultLoading: false,
    quizResultError: null,
};

// ─────────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────────

export const fetchChapterQuizzesAction = createAsyncThunk<any, string, { rejectValue: string }>(
    "quiz/fetchChapterQuizzes",
    async (chapterInfoId, { rejectWithValue }) => {
        try {
            const response = await getChapterQuizApi(chapterInfoId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch quizzes");
        }
    }
);

export const startQuizAction = createAsyncThunk<
    ActiveQuizData,
    { course_id: number; quiz_id: number },
    { rejectValue: string }
>(
    "quiz/startQuiz",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await startChapterQuizApi(payload);
            // API returns { data: ActiveQuizData }
            return (response?.data?.data ?? response?.data ?? response) as ActiveQuizData;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to start quiz. Please try again.");
        }
    }
);

export const submitAnswerAction = createAsyncThunk<
    any,
    SubmitAnswerPayload,
    { rejectValue: string }
>(
    "quiz/submitAnswer",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await submitQuizAnswerApi(payload);
            return response?.data ?? response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to submit answer. Please try again.");
        }
    }
);

export const fetchQuizResultAction = createAsyncThunk<
    ActiveQuizData,
    number,
    { rejectValue: string }
>(
    "quiz/fetchQuizResult",
    async (testId, { rejectWithValue }) => {
        try {
            const response = await getQuizResultApi(testId);
            return (response?.data?.data ?? response?.data ?? response) as ActiveQuizData;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch quiz result.");
        }
    }
);

// ─────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        clearQuizStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            state.success = false;
        },
        clearQuizzes: (state) => {
            state.quizzes = [];
        },
        clearActiveQuiz: (state) => {
            state.activeQuiz = null;
            state.startQuizLoading = false;
            state.startQuizError = null;
            state.quizResult = null;
            state.quizResultLoading = false;
            state.quizResultError = null;
            state.submitError = null;
        },
        clearSubmitError: (state) => {
            state.submitError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── Fetch chapter quizzes ──────────────────
            .addCase(fetchChapterQuizzesAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchChapterQuizzesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Quizzes fetched successfully";
                state.quizzes = action.payload?.data ?? [];
            })
            .addCase(fetchChapterQuizzesAction.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Failed to fetch quizzes";
            })

            // ── Start Quiz ────────────────────────────
            .addCase(startQuizAction.pending, (state) => {
                state.startQuizLoading = true;
                state.startQuizError = null;
                state.activeQuiz = null;
            })
            .addCase(startQuizAction.fulfilled, (state, action: PayloadAction<ActiveQuizData>) => {
                state.startQuizLoading = false;
                state.activeQuiz = action.payload;
            })
            .addCase(startQuizAction.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.startQuizLoading = false;
                state.startQuizError = action.payload || "Failed to start quiz";
            })

            // ── Submit Answer ─────────────────────────
            .addCase(submitAnswerAction.pending, (state) => {
                state.submitting = true;
                state.submitError = null;
            })
            .addCase(submitAnswerAction.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(submitAnswerAction.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.submitting = false;
                state.submitError = action.payload || "Failed to submit answer";
            })

            // ── Fetch Quiz Result ──────────────────────
            .addCase(fetchQuizResultAction.pending, (state) => {
                state.quizResultLoading = true;
                state.quizResultError = null;
            })
            .addCase(fetchQuizResultAction.fulfilled, (state, action: PayloadAction<ActiveQuizData>) => {
                state.quizResultLoading = false;
                state.quizResult = action.payload;
            })
            .addCase(fetchQuizResultAction.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.quizResultLoading = false;
                state.quizResultError = action.payload || "Failed to fetch quiz result";
            });
    },
});

export const { clearQuizStatus, clearQuizzes, clearActiveQuiz, clearSubmitError } = quizSlice.actions;
export default quizSlice.reducer;
