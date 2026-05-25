import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CoursesCard from "../Cards/CoursesCard";
import { getCategoryCoursesApi } from "../../utils/service";

const BestCourses = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Grab the name from the router state passed by TopCollege
    const categoryName = location.state?.categoryName || "Category";

    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchCourses = async () => {
            if (!id) return;
            setLoading(true);
            setError("");
            try {
                const response = await getCategoryCoursesApi(id);
                if (response?.data && Array.isArray(response.data)) {
                    setCourses(response.data);
                } else if (Array.isArray(response)) {
                    setCourses(response);
                } else {
                    setCourses([]);
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [id]);

    const handleCourseClick = (course: any) => {
        navigate(`/courses/detail/${course.id}`);
    };

    return (
        <section className="bg-[#FFFFFE] py-20 px-4 xl:px-0">
            <div className="container mx-auto">
                <div className="flex items-center justify-center mb-6">
                    <h2 className="text-2xl font-bold text-[#1D2026]">
                        Best selling courses in {categoryName}
                    </h2>
                </div>

                <CoursesCard 
                    isSidebarOpen={false} 
                    courses={courses} 
                    loading={loading} 
                    error={error} 
                    onCourseClick={handleCourseClick}
                />
            </div>
        </section>
    );
};

export default BestCourses;