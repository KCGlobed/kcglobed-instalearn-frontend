import CoursesCard from "../Cards/CoursesCard"

const BestCourses = () => {
    return (
        <section className="bg-[#FFFFFE] py-20 px-4 xl:px-0">
            < div className="container mx-auto" >
                <div className="flex items-center justify-center mb-6">
                    <h2 className="text-2xl font-bold text-[#1D2026]">Best selling courses in Web Development</h2>
                </div>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-[#E9EAF0] rounded-[4px] overflow-hidden animate-pulse"
                        >
                            <div className="relative overflow-hidden aspect-[16/10]">
                                <div className="w-full h-full bg-gray-200" />
                            </div>

                            <div className="p-4 flex flex-col min-h-[180px]">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="h-5 w-24 bg-gray-200 rounded" />
                                    <div className="h-5 w-16 bg-gray-200 rounded" />
                                </div>

                                <div className="h-10 bg-gray-200 rounded mb-4" />

                                <div className="mt-auto pt-4 border-t border-[#E9EAF0] flex items-center justify-between">
                                    <div className="h-5 w-12 bg-gray-200 rounded" />
                                    <div className="h-5 w-16 bg-gray-200 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
                <CoursesCard isSidebarOpen={false} />
            </div >
        </section >
    )
}

export default BestCourses