import { ClipboardList, Target, ChevronRight } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizHistoryApi } from "../../utils/service";
import { fetchChapterQuizzesAction } from "../../store/slices/quizSlice";
import type { RootState } from "../../store/store";
import type { Chapter } from "../../store/slices/courseDashboardChapterSlice";

interface MyQuizProps {
    onStartQuiz: (quizId: number) => void;
    currentChapter: Chapter | null;
}

const QuizCardSkeleton = () => {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm animate-pulse">
            <div className="h-44 bg-gray-200" />
            <div className="p-5 space-y-4">
                <div className="h-6 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />
                <div className="h-10 w-full rounded bg-gray-200 mt-2" />
                <div className="border-t border-gray-100 my-4" />
                <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gray-200" />
                        <div className="space-y-2">
                            <div className="h-4 w-16 rounded bg-gray-200" />
                            <div className="h-3 w-20 rounded bg-gray-200" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gray-200" />
                        <div className="space-y-2">
                            <div className="h-4 w-16 rounded bg-gray-200" />
                            <div className="h-3 w-20 rounded bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuizCard = ({ currentChapter, onStartQuiz }: MyQuizProps) => {
    const { quizzes, loading } = useAppSelector((state: RootState) => state.quiz);
    const dispatch = useAppDispatch();
    const { slug } = useParams<{ slug: string }>();
    const courseId = Number(slug);

    const [attemptsMap, setAttemptsMap] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const chapterId = currentChapter?.chapter_info?.id;
        if (chapterId) {
            dispatch(fetchChapterQuizzesAction(String(chapterId)));
        }
    }, [dispatch, currentChapter?.chapter_info?.id]);

    useEffect(() => {
        const fetchAllHistories = async () => {
            const chapterId = currentChapter?.chapter_info?.id;
            if (!chapterId || !quizzes || quizzes.length === 0 || !courseId) return;

            const newAttemptsMap: Record<number, boolean> = {};
            await Promise.all(
                quizzes.map(async (quiz) => {
                    try {
                        const res = await getQuizHistoryApi(courseId, chapterId, quiz.id);
                        const list = res?.data?.data ?? res?.data ?? [];
                        newAttemptsMap[quiz.id] = Array.isArray(list) && list.length >= 1;
                    } catch (e) {
                        console.error(`Failed to fetch history for quiz ${quiz.id}`, e);
                        newAttemptsMap[quiz.id] = false;
                    }
                })
            );
            setAttemptsMap(newAttemptsMap);
        };

        fetchAllHistories();
    }, [quizzes, currentChapter?.chapter_info?.id, courseId]);

    if (loading) {
        return (
            <div>
                <div className="mb-6">
                    <h1 className="text-[24px] font-bold text-[#2d2f31] mb-2">Lesson quizzes</h1>
                    <p className="text-[14.5px] text-[#6a6f73] leading-relaxed">
                        Test your understanding and challenge yourself with practice tests.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <QuizCardSkeleton />
                    <QuizCardSkeleton />
                    <QuizCardSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-[24px] font-bold text-[#2d2f31] mb-2">Lesson quizzes</h1>
                <p className="text-[14.5px] text-[#6a6f73] leading-relaxed">
                    Test your understanding and challenge yourself with practice tests.
                </p>
            </div>
            {(!quizzes || quizzes.length === 0) ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center">
                    <p className="text-sm font-semibold text-gray-500">No quizzes available for this chapter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizzes.map((item) => (
                        <div
                            key={item?.id}
                            className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-sm transition hover:shadow-md"
                        >
                            {/* Top Section */}
                            <div className="h-44 bg-gray-50">
                                <img
                                    src={
                                        item?.thumbnail || "https://placehold.co/600x400?text=Question+Image"
                                    }
                                    alt={item?.name || "Quiz Thumbnail"}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Bottom */}
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">{item?.name}</h2>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">{item?.description}</p>

                                <div className="w-full mt-2">
                                    <button 
                                        onClick={() => onStartQuiz(item?.id)} 
                                        className="w-full justify-center flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                    >
                                        {attemptsMap[item?.id] ? "Restart" : "Start"}
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                <div className="my-5 border-t border-gray-100"></div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                                            <ClipboardList size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{item?.total_question} Questions</h3>
                                            <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                Total Questions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-12 w-px bg-gray-100"></div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                            <Target size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Min {item?.pass_percentage || 0}%</h3>
                                            <p className="text-[11px] uppercase tracking-wider text-gray-400">
                                                Pass Percentage
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizCard;
