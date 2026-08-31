import {
    ChevronLeft,
    FileText,
    Target,
    Clock,
    ListChecks,
    Repeat,
    Trophy,
    Share2,
    Play,
    Loader2,
    AlertCircle,
    RotateCcw,
} from "lucide-react";
import type { RootState } from "../../store/store";
import { useAppSelector } from "../../hooks/useRedux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { startQuizAction } from "../../store/slices/quizSlice";
import { useEffect, useState } from "react";
import { getQuizHistoryApi } from "../../utils/service";
import type { Chapter } from "../../store/slices/courseDashboardChapterSlice";

const rules = [
    "Complete the quiz within 30 minutes.",
    "Each question can be revisited before final submission.",
    "You need the minimum score shown above to pass this round.",
];

export default function QuizStartScreen({
    currentChapter,
    state,
    quizId,
    courseId,
    setQuizState,
}: {
    currentChapter: Chapter | null;
    state: "idle" | "starter" | "active" | "result";
    quizId: number | null;
    courseId: number;
    setQuizState: (state: "idle" | "starter" | "active" | "result") => void;
}) {
    const dispatch = useAppDispatch();
    const [attempts, setAttempts] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState<boolean>(false);
    const { quizzes } = useAppSelector((s: RootState) => s.quiz);
    const { startQuizLoading, startQuizError } = useAppSelector(
        (s: RootState) => s.quiz
    );

    const currentQuiz = quizzes?.find((q) => q.id === quizId);
    const passPercentage = currentQuiz?.pass_percentage || 0;

    const stats = [
        { icon: FileText, label: "Total", value: `${currentQuiz?.total_question || 0} Qs` },
        { icon: Target, label: "Pass %", value: `Min ${currentQuiz?.pass_percentage || 0}%` },
        { icon: Clock, label: "Time Limit", value: "30 min" },
    ];

    const handleStartQuiz = async () => {
        if (!quizId) return;
 
        const result = await dispatch(
            startQuizAction({ course_id: courseId, quiz_id: quizId })
        );
 
        // Only transition to active screen if the API call succeeded and questions exist
        if (startQuizAction.fulfilled.match(result)) {
            const questionsList = result.payload?.test_questions ?? [];
            if (questionsList.length === 0) {
                return;
            }
            setQuizState("active");
        }
    };

    const handleFetchQuizHistory = async () => {
        if (!quizId || !currentChapter?.chapter_info?.id) return;
        setHistoryLoading(true);
        try {
            const result = await getQuizHistoryApi(courseId, currentChapter.chapter_info.id, quizId);
            if (result?.success && Array.isArray(result?.data)) {
                setAttempts(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch quiz history:", error);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (quizId && currentChapter?.chapter_info?.id && courseId) {
            handleFetchQuizHistory();
        }
    }, [courseId, currentChapter?.chapter_info?.id, quizId]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const mainContainer = document.querySelector("main");
        if (mainContainer) {
            mainContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [quizId]);

    return (
        <div className=" bg-gray-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Back link */}
                <button
                    onClick={() => setQuizState("idle")}
                    className="mb-6 flex items-center gap-1 text-xs font-medium tracking-wide text-gray-400 hover:text-gray-600"
                >
                    <ChevronLeft className="h-4 w-4" />
                    BACK
                </button>

                {/* Header card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {currentQuiz?.name}
                            </h1>

                            <div className="mt-4 flex flex-wrap gap-6">
                                {stats.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                                            <Icon className="h-5 w-5 text-orange-500" />
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {value}
                                            </p>
                                            <p className="text-xs text-gray-400">{label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleStartQuiz}
                                disabled={startQuizLoading || !currentQuiz?.total_question || Number(currentQuiz?.total_question) === 0}
                                className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {startQuizLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {attempts.length >= 1 ? "Restarting…" : "Starting…"}
                                    </>
                                ) : attempts.length >= 1 ? (
                                    <>
                                        <RotateCcw className="h-4 w-4" />
                                        Restart Quiz
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 fill-white" />
                                        Start Quiz
                                    </>
                                )}
                            </button>
                            <button
                                aria-label="Share quiz"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:text-gray-600"
                            >
                                <Share2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* API Error banner */}
                    {startQuizError && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 animate-fade-in">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {startQuizError}
                        </div>
                    )}
                </div>

                {/* Rules + Attempt history */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Quiz rules */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                        <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-orange-500">
                            <ListChecks className="h-4 w-4" />
                            Quiz rules
                        </h2>
                        <ul>
                            {rules.map((rule, i) => (
                                <li
                                    key={rule}
                                    className={`flex items-start gap-4 py-4 ${i !== rules.length - 1 ? "border-b border-gray-100" : ""
                                        }`}
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-gray-700">{rule}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Attempt history / empty state */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                        <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-orange-500">
                            <Repeat className="h-4 w-4" />
                            Attempt history
                        </h2>

                        {historyLoading ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                                <p className="text-xs text-gray-400">Loading attempt history...</p>
                            </div>
                        ) : attempts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-gray-50 py-12 text-center">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                                    <Trophy className="h-6 w-6 text-orange-400" />
                                </span>
                                <p className="text-sm font-medium text-gray-700">
                                    No attempts yet
                                </p>
                                <p className="max-w-[220px] text-xs text-gray-400">
                                    Start the quiz to see your attempt history and score here.
                                </p>
                            </div>
                        ) : (
                            <div className="max-h-[280px] overflow-y-auto pr-1 space-y-3">
                                {attempts.map((attempt) => {
                                    const isCompleted = attempt.status === true;
                                    const isPassed = attempt.score >= passPercentage;
                                    const attemptDate = new Date(attempt.created_at).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });

                                    return (
                                        <div
                                            key={attempt.id}
                                            className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:bg-gray-50"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    Score: {attempt.score}%
                                                </p>
                                                <p className="text-xs text-gray-400">{attemptDate}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* Status Badge */}
                                                <span
                                                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                        isCompleted
                                                            ? "border-blue-200 bg-blue-50 text-blue-700"
                                                            : "border-amber-200 bg-amber-50 text-amber-700"
                                                    }`}
                                                >
                                                    {isCompleted ? "Completed" : "Incomplete"}
                                                </span>

                                                {/* Result Badge */}
                                                {(isCompleted || attempt.result) && (
                                                    <span
                                                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                            isPassed
                                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                : "border-rose-200 bg-rose-50 text-rose-700"
                                                        }`}
                                                    >
                                                        {attempt.result || (isPassed ? "Pass" : "Fail")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}