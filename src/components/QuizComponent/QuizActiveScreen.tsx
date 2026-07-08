import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import type { RootState } from "../../store/store";
import type { ActiveTestQuestion } from "../../store/slices/quizSlice";
import { submitAnswerAction, clearSubmitError } from "../../store/slices/quizSlice";
import type { Chapter } from "../../store/slices/courseDashboardChapterSlice";

interface QuizActiveScreenProps {
    currentChapter: Chapter | null;
    state: "idle" | "starter" | "active" | "result";
    quizId: number | null;
    setQuizState: (state: "idle" | "starter" | "active" | "result") => void;
}

// Maps test_question.id → selected option id (number)
type Answers = Record<number, number>;

const QuizActiveScreen: React.FC<QuizActiveScreenProps> = ({ setQuizState }) => {
    const dispatch = useAppDispatch();
    const { activeQuiz, submitting, submitError } = useAppSelector(
        (s: RootState) => s.quiz
    );

    const questions: ActiveTestQuestion[] = activeQuiz?.test_questions ?? [];
    const totalQuestions = questions.length;

    const [currentIdx, setCurrentIdx] = useState<number>(0);
    const [answers, setAnswers] = useState<Answers>({});

    // Clear previous submit errors when active screen loads
    useEffect(() => {
        dispatch(clearSubmitError());
    }, [dispatch]);

    const currentQuestion = questions[currentIdx];

    // ── Global Countdown Timer ───────────────────────────────
    const calculateTimeLeft = useCallback(() => {
        if (!activeQuiz?.created_at) return 1800; // 30 minutes in seconds

        let createdAtStr = activeQuiz.created_at.replace(" ", "T");
        // Ensure timezone offset is correctly defined for standard browsers
        if (!createdAtStr.includes("Z") && !createdAtStr.includes("+") && !/-\d{2}:\d{2}$/.test(createdAtStr)) {
            if (!createdAtStr.endsWith("Z")) {
                createdAtStr += "Z";
            }
        }

        const startTime = new Date(createdAtStr).getTime();
        // Defensive check: if start time parsing fails, fallback to full timer
        if (isNaN(startTime)) {
            console.error("Failed to parse activeQuiz.created_at date:", createdAtStr);
            return 1800;
        }

        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        return Math.max(0, 1800 - elapsedSeconds);
    }, [activeQuiz?.created_at]);

    const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft);

    // Keep stable references of current values for the interval callback
    const currentQuestionRef = useRef(currentQuestion);
    const answersRef = useRef(answers);

    useEffect(() => {
        currentQuestionRef.current = currentQuestion;
    }, [currentQuestion]);

    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const handleAutoSubmit = useCallback(async () => {
        const currQ = currentQuestionRef.current;
        if (activeQuiz && currQ) {
            const selectedOptionId = answersRef.current[currQ.id] ?? null;
            await dispatch(
                submitAnswerAction({
                    practice_test_id: activeQuiz.id,
                    question_id: currQ.id,
                    selected_option_id: selectedOptionId,
                    time_taken: 0,
                    is_completed: 1, // mark quiz as completed
                })
            );
        }
        setQuizState("result");
    }, [activeQuiz, dispatch, setQuizState]);

    useEffect(() => {
        // Sync time left on mount/load
        setTimeLeft(calculateTimeLeft());

        const intervalId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [calculateTimeLeft, handleAutoSubmit]);

    // Sync timer dynamically if activeQuiz updates
    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
    }, [activeQuiz, calculateTimeLeft]);

    // ─────────────────────────────────────────────────────────

    const selectOption = (optionId: number) => {
        if (!currentQuestion) return;
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: optionId,
        }));
    };

    const goTo = (idx: number) => {
        if (idx >= 0 && idx < totalQuestions) setCurrentIdx(idx);
    };

    /**
     * Called when the user clicks "Next" (or "Finish" on the last question).
     * Only fires the API if the question was answered; skipped questions just
     * advance the index without a network call.
     */
    const handleNext = async () => {
        if (submitting) return; // Prevent double-clicks
        const isLast = currentIdx === totalQuestions - 1;
        const selectedOptionId = answers[currentQuestion?.id ?? -1] ?? null;

        if (activeQuiz && currentQuestion) {
            // Call API if an option is selected OR if it's the last question (to mark is_completed: 1)
            if (selectedOptionId !== null || isLast) {
                const result = await dispatch(
                    submitAnswerAction({
                        practice_test_id: activeQuiz.id,
                        question_id: currentQuestion.id,
                        selected_option_id: selectedOptionId,
                        time_taken: timeLeft, // Send remaining seconds
                        is_completed: isLast ? 1 : 0,
                    })
                );

                if (!submitAnswerAction.fulfilled.match(result)) {
                    // Keep the user on the same question so they can retry
                    return;
                }
            }
        }

        // Navigate: last question → result screen; others → next question
        if (isLast) {
            setQuizState("result");
        } else {
            setCurrentIdx((prev) => prev + 1);
        }
    };

    /** Prev just moves to the previous question without any API call */
    const handlePrev = () => {
        if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
    };

    const statusFor = (idx: number) => {
        const q = questions[idx];
        if (!q) return "unanswered";
        if (idx === currentIdx) return "current";
        if (answers[q.id] !== undefined) return "answered";
        return "unanswered";
    };

    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    // ── Fallback: no quiz data ────────────────────────────────
    if (!currentQuestion) {
        return (
            <div className="flex items-center justify-center py-24 text-gray-400">
                No questions available.
            </div>
        );
    }

    const { question_detail, options } = currentQuestion.question_info;
    const selectedOptionId = answers[currentQuestion.id];
    const isOptionSelected = selectedOptionId !== undefined && selectedOptionId !== null;
    const isLast = currentIdx === totalQuestions - 1;

    return (
        <div className="bg-gray-50 px-4 py-8 sm:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">

                {/* ── Question Panel ──────────────────────────────────── */}
                <div className="flex-1 rounded-2xl bg-white p-6 shadow">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="font-semibold text-orange-500">
                            Question {currentIdx + 1} / {totalQuestions}
                        </h2>

                        <div className="flex items-center gap-3">
                            {/* Live timer countdown */}
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 tabular-nums">
                                ⏱ {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                                {String(timeLeft % 60).padStart(2, "0")}
                            </span>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                Single Select
                            </span>
                        </div>
                    </div>

                    {/* Question text (may contain HTML) */}
                    <div className="mb-6 rounded-xl bg-gray-50 p-5">
                        <h3
                            className="text-lg font-semibold"
                            dangerouslySetInnerHTML={{ __html: question_detail.question }}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {options.map((option, idx) => {
                            const active = selectedOptionId === option.id;
                            const optionLabel = String.fromCharCode(65 + idx); // A, B, C …

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => selectOption(option.id)}
                                    disabled={submitting}
                                    className={`flex w-full items-center justify-between rounded-xl border p-4 transition disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${active
                                        ? "border-orange-500 bg-orange-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? "border-orange-500" : "border-gray-300"
                                                }`}
                                        >
                                            {active && (
                                                <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                                            )}
                                        </div>
                                        <span>{option.option}</span>
                                    </div>

                                    <div
                                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-orange-500 text-white" : "bg-gray-100"
                                            }`}
                                    >
                                        {optionLabel}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Submission error */}
                    {submitError && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 animate-fade-in">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {submitError} — please try again.
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-8 flex justify-end gap-3">
                        {currentIdx > 0 && (
                            <button
                                onClick={handlePrev}
                                disabled={submitting}
                                className="rounded-lg border px-5 py-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Prev
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            disabled={submitting || !isOptionSelected}
                            className="flex min-w-[90px] items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving…
                                </>
                            ) : isLast ? (
                                "Finish"
                            ) : (
                                "Next"
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Navigation Sidebar ──────────────────────────────── */}
                <div className="w-full rounded-2xl bg-white p-6 shadow lg:w-80">
                    <h3 className="mb-4 font-semibold">Question Navigation</h3>

                    <div className="grid grid-cols-5 gap-3">
                        {questions.map((_, idx) => {
                            const status = statusFor(idx);

                            return (
                                <button
                                    key={idx}
                                    onClick={() => goTo(idx)}
                                    disabled={submitting}
                                    className={`h-10 rounded-lg border text-sm font-semibold transition disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${status === "current"
                                        ? "border-orange-500 bg-orange-500 text-white"
                                        : status === "answered"
                                            ? "border-green-300 bg-green-100 text-green-700"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6">
                        <div className="mb-2 flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{answeredCount}/{totalQuestions}</span>
                        </div>

                        <div className="h-2 rounded-full bg-gray-200">
                            <div
                                className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                                style={{
                                    width: `${totalQuestions ? (answeredCount / totalQuestions) * 100 : 0}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-5 space-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-orange-500" />
                            Current
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-green-100 border border-green-300" />
                            Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm border border-gray-200 bg-white" />
                            Not visited
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QuizActiveScreen;
