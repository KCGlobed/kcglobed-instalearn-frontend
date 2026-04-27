import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';

const CourseDescription = () => {
    const { courseDetail, loading, error } = useAppSelector((state: RootState) => state.courseDetail);
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            <div className="prose prose-lg text-gray-700 max-w-none space-y-6 leading-relaxed" dangerouslySetInnerHTML={{
                __html: courseDetail?.description ||
                    "3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing."
            }}>

            </div>
        </div>
    );
};

export default CourseDescription;
