
const SkeltonLoader = ({ loaderType }: { loaderType: string }) => {
    return (
        <>
            {
                loaderType === "tag" ? (
                    <div className="flex justify-start items-center mb-10 overflow-x-auto no-scrollbar">
                        <div className="flex p-1 bg-white border border-[#E9EAF0] rounded-sm gap-2">

                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="px-6 py-2.5 rounded-[2px] bg-gray-200 animate-pulse"
                                >
                                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                                </div>
                            ))}

                        </div>
                    </div>
                ) :

                    loaderType === "course" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="bg-white rounded-sm shadow-sm overflow-hidden animate-pulse"
                                >
                                    <div className="h-48 bg-gray-200"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                        <div className="flex justify-between">
                                            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) :
                        loaderType === "course_detail_sidebar" ? (
                            <div>
                                <div className="bg-white border rounded-2xl shadow-xl overflow-hidden sticky top-8 max-w-sm ml-auto animate-pulse">
                                    <div className="p-6">
                                        {/* Price Skeleton */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 bg-gray-200 rounded w-28"></div>
                                            <div className="h-5 bg-gray-200 rounded w-16"></div>
                                        </div>

                                        <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>

                                        {/* List Skeleton */}
                                        <div className="space-y-5 mb-8">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 w-1/2">
                                                        <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                    </div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Buttons Skeleton */}
                                        <div className="grid gap-3 mb-8">
                                            <div className="h-[56px] bg-gray-200 rounded-xl w-full"></div>
                                            <div className="h-[56px] bg-gray-200 rounded-xl w-full"></div>
                                            <div className="flex gap-2">
                                                <div className="h-[46px] bg-gray-200 rounded-xl w-full"></div>
                                                <div className="h-[46px] bg-gray-200 rounded-xl w-full"></div>
                                            </div>
                                        </div>

                                        <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>

                                        {/* Includes Skeleton */}
                                        <div className="mb-8">
                                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-5"></div>
                                            <div className="space-y-4">
                                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Share Skeleton */}
                                        <div className="border-t pt-6">
                                            <div className="h-5 bg-gray-200 rounded w-1/3 mb-5"></div>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) :
                            loaderType === "topCategory" ? (
                                <>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                        <div
                                            key={item}
                                            className="p-4 flex items-center gap-4 min-h-[100px] bg-white rounded-sm border border-[#E9EAF0] animate-pulse"
                                        >
                                            {/* Icon Skeleton */}
                                            <div className="w-[60px] h-[60px] min-w-[60px] bg-gray-200 rounded-sm"></div>

                                            {/* Title & Count Skeleton */}
                                            <div className="flex flex-col gap-2.5 flex-1">
                                                <div className="h-4 w-3/4 bg-gray-200 rounded-sm"></div>
                                                <div className="h-3.5 w-1/2 bg-gray-200 rounded-sm"></div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) :
                                loaderType === "reminder" ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                                        {[1, 2, 3, 4].map((item) => (
                                            <div
                                                key={item}
                                                className="bg-white border border-[#E9EAF0] rounded-[4px] p-5 flex flex-col justify-between min-h-[180px] animate-pulse"
                                            >
                                                <div className="space-y-3 flex-1">
                                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-2/5"></div>
                                                </div>
                                                <div className="pt-3 border-t border-[#F1F2F4] space-y-2 mt-auto">
                                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) :
                                    (
                                        <div>SkeltonLoader</div>
                                    )
            }
        </>

    )
}

export default SkeltonLoader