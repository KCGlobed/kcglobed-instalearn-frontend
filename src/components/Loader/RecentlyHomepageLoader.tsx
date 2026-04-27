const RecentlyAddedCourseLoader = ({ loaderType }: { loaderType: string }) => {
    return (
        <>
            {loaderType === "recentlyAdded" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div
                            key={item}
                            className="p-4 flex items-center gap-4 bg-gray-100 animate-pulse min-h-[100px]"
                        >
                            {/* Icon Skeleton */}
                            <div className="w-[60px] h-[60px] bg-gray-300 rounded"></div>

                            {/* Text Skeleton */}
                            <div className="flex flex-col gap-2 w-full">
                                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                                <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>RecentlyAddedCourseLoader</div>
            )}
        </>
    );
};

export default RecentlyAddedCourseLoader;