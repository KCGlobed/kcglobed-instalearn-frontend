import React, { useEffect } from "react";
import { ClipboardList, ThumbsUp, AlertCircle, Loader2, ArrowLeft, RotateCcw } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import type { RootState } from "../../store/store";
import { fetchQuizResultAction, clearActiveQuiz } from "../../store/slices/quizSlice";

interface QuizResultScreenProps {
    quizId: number | null;
    setQuizState: (state: "idle" | "starter" | "active" | "result") => void;
}

interface StatCardProps {
    label: string;
    value: string | number;
    accent: string;
}

function StatCard({ label, value, accent }: StatCardProps) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
                <ClipboardList size={18} strokeWidth={2} />
            </div>
            <div>
                <p className="text-lg font-semibold text-gray-900 leading-none">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </div>
    );
}

interface StatusBadgeProps {
    status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
    const styles =
        status === "SKIPPED"
            ? "bg-amber-100 text-amber-600"
            : status === "CORRECT"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600";
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide ${styles}`}>
            {status}
        </span>
    );
}

interface FormattedQuestion {
    number: number;
    status: string;
    prompt: string;
    yourAnswer: string;
    correctAnswer: string;
    explanation: string | null;
}

interface QuestionCardProps {
    question: FormattedQuestion;
}

function QuestionCard({ question }: QuestionCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wide text-gray-400">
                    QUESTION {question.number}
                </p>
                <StatusBadge status={question.status} />
            </div>
            <p
                className="mb-4 text-base font-medium text-gray-900"
                dangerouslySetInnerHTML={{ __html: question.prompt }}
            />

            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="mb-1 text-xs font-medium tracking-wide text-gray-400">YOUR ANSWER</p>
                <p
                    className="text-gray-800 text-sm font-medium"
                    dangerouslySetInnerHTML={{ __html: question.yourAnswer }}
                />
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3">
                <p className="mb-1 text-xs font-medium tracking-wide text-emerald-600">CORRECT ANSWER</p>
                <p
                    className="text-gray-800 text-sm font-medium"
                    dangerouslySetInnerHTML={{ __html: question.correctAnswer }}
                />
            </div>

            {question.explanation && (
                <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
                    <p className="mb-1 text-xs font-medium tracking-wide text-blue-600">EXPLANATION</p>
                    <div
                        className="text-gray-700 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: question.explanation }}
                    />
                </div>
            )}
        </div>
    );
}

interface QuizOption {
    id: number;
    option: string;
    is_correct?: boolean | number;
    correct?: boolean | number;
}

interface TestQuestionType {
    id: number;
    attempted: boolean;
    result: number;
    selected_option: number | { id: number; option: string } | null;
    question_info?: {
        id?: number;
        level?: number;
        id_number?: string;
        right_option?: number;
        question_detail?: {
            id?: number;
            question?: string;
            solution_description?: string;
        };
        options?: QuizOption[];
    };
}

export default function QuizResultScreen({ quizId, setQuizState }: QuizResultScreenProps) {
    const dispatch = useAppDispatch();

    // Grab state from Redux
    const { activeQuiz, quizResult, quizResultLoading, quizResultError, quizzes } = useAppSelector(
        (s: RootState) => s.quiz
    );

    const currentQuiz = quizzes?.find((q) => q.id === quizId);
    const passPercentage = currentQuiz?.pass_percentage || 0;

    // Retrieve result on mount using the active session test_id
    useEffect(() => {
        if (activeQuiz?.id) {
            dispatch(fetchQuizResultAction(activeQuiz.id));
        }
    }, [dispatch, activeQuiz?.id]);

    const handleRetry = () => {
        dispatch(clearActiveQuiz());
        setQuizState("starter");
    };

    const handleBackToCourse = () => {
        dispatch(clearActiveQuiz());
        setQuizState("idle");
    };


    console.log(quizResult, "quizResult")

    if (quizResultLoading) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <p className="text-sm font-semibold text-gray-500">Calculating your results...</p>
            </div>
        );
    }

    if (quizResultError) {
        return (
            <div className="mx-auto max-w-xl px-4 py-16 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
                <h2 className="mt-4 text-lg font-bold text-gray-900">Failed to load result</h2>
                <p className="mt-2 text-sm text-gray-500">{quizResultError}</p>
                <div className="mt-6 flex justify-center gap-3">
                    <button onClick={handleRetry} className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                        <RotateCcw className="h-4 w-4" /> Try Again
                    </button>
                    <button onClick={handleBackToCourse} className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
                        Back to Course
                    </button>
                </div>
            </div>
        );
    }

    const testData = quizResult || activeQuiz;

    if (!testData) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                <p className="text-sm font-semibold text-gray-500">No active test results found.</p>
                <button onClick={handleBackToCourse} className="mt-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    Back to Course
                </button>
            </div>
        );
    }

    const total = testData.total_question || 0;
    const correct = testData.total_right_answer_given || 0;
    const wrong = testData.total_wrong_answer_given || 0;
    const skipped = testData.total_never_attempt_question || 0;
    const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Customize text/badge depending on whether they scored high enough
    const passed = scorePercent >= passPercentage;

    const summaryStats = [
        { label: "Total", value: total, accent: "bg-orange-100 text-orange-500" },
        { label: "Correct", value: correct, accent: "bg-emerald-100 text-emerald-500" },
        { label: "Wrong", value: wrong, accent: "bg-rose-100 text-rose-500" },
        { label: "Skipped", value: skipped, accent: "bg-amber-100 text-amber-500" },
    ];

    // Build the dynamic question card data
    const formattedQuestions = ((testData.test_questions ?? []) as TestQuestionType[]).map((tq, idx) => {
        const questionInfo = tq.question_info || {};
        const qDetail = questionInfo.question_detail || {};
        const optionsList = questionInfo.options || [];

        // Find user's answer option text (selected_option can be object or ID number)
        let yourAnswer = "Skipped";
        let userOptId: number | null = null;
        if (tq.selected_option && typeof tq.selected_option === "object") {
            yourAnswer = tq.selected_option.option || "Skipped";
            userOptId = tq.selected_option.id;
        } else if (tq.selected_option) {
            userOptId = Number(tq.selected_option);
            const userOpt = optionsList.find((opt) => opt.id === userOptId);
            if (userOpt) yourAnswer = userOpt.option;
        }

        // Find correct answer option text (right_option from question_info or custom flags)
        const rightOptionId = questionInfo.right_option;
        let correctOpt = optionsList.find((opt) => opt.id === rightOptionId);
        
        if (!correctOpt) {
            correctOpt = optionsList.find((opt) => opt.is_correct === true || opt.is_correct === 1 || opt.correct === true || opt.correct === 1);
        }
        if (!correctOpt && tq.result === 1 && userOptId) {
            correctOpt = optionsList.find((opt) => opt.id === userOptId);
        }

        const correctAnswer = correctOpt ? correctOpt.option : "Check explanation below";

        // Determine status
        let status = "SKIPPED";
        if (tq.attempted && tq.selected_option) {
            status = tq.result === 1 ? "CORRECT" : "WRONG";
        }

        return {
            number: idx + 1,
            status,
            prompt: qDetail.question || "N/A",
            yourAnswer,
            correctAnswer,
            explanation: qDetail.solution_description || null,
        };
    });

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="mx-auto max-w-3xl space-y-6 px-4">
                {/* Header summary card */}
                <div className={`rounded-2xl p-6 ${passed ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                    <div className="mb-5 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white text-3xl shadow-sm">
                            {passed ? "🎉" : "❌"}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {passed ? "Congratulations!" : "Keep practicing!"}
                            </h1>
                            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mt-1">
                                {passed ? "You passed this round" : "You did not pass this round. Try again."}
                                {passed && <ThumbsUp size={14} className="text-amber-500 fill-amber-500" />}
                                <span className="font-bold text-gray-900">{correct}</span> / {total} ({scorePercent}%)
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {summaryStats.map((stat) => (
                            <StatCard key={stat.label} {...stat} />
                        ))}
                    </div>
                </div>

                {/* Navigation panel */}
                <div className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <button onClick={handleBackToCourse} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </button>
                    <button onClick={handleRetry} className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                        <RotateCcw className="h-4 w-4" /> Retry Quiz
                    </button>
                </div>

                {/* Question list */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 px-1">Detailed Breakdown</h2>
                    {formattedQuestions.map((q) => (
                        <QuestionCard key={q.number} question={q} />
                    ))}
                </div>
            </div>
        </div>
    );
}