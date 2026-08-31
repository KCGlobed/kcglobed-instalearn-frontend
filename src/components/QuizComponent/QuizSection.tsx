import QuizActiveScreen from "./QuizActiveScreen";
import QuizResultScreen from "./QuizResultScreen";
import QuizStartScreen from "./QuizStartScreen";
import type { Chapter } from "../../store/slices/courseDashboardChapterSlice";

interface QuizSectionProps {
    currentChapter: Chapter | null;
    state: "idle" | "starter" | "active" | "result";
    quizId: number | null;
    courseId: number;
    setQuizState: (state: "idle" | "starter" | "active" | "result") => void;
}

const QuizSection = ({
    currentChapter,
    state,
    quizId,
    courseId,
    setQuizState,
}: QuizSectionProps) => {
    return (
        <div>
            {state === "starter" ? (
                <QuizStartScreen 
                    currentChapter={currentChapter} 
                    state={state} 
                    quizId={quizId} 
                    courseId={courseId} 
                    setQuizState={setQuizState} 
                />
            ) : state === "active" ? (
                <QuizActiveScreen 
                    currentChapter={currentChapter} 
                    state={state} 
                    quizId={quizId} 
                    setQuizState={setQuizState} 
                />
            ) : (
                <QuizResultScreen 
                    quizId={quizId} 
                    setQuizState={setQuizState} 
                />
            )}
        </div>
    );
};

export default QuizSection;