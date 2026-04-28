
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
                        loaderType == "recentlyAdded" ? (
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
                        ) :
                            loaderType === "filterCategory" ?
                                (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[1, 2, 3, 4].map((item) => (
                                            <div
                                                key={item}
                                                className="p-4 flex items-center gap-4 bg-gray-100 animate-pulse min-h-[100px]"
                                            >
                                                <div className="w-[60px] h-[60px] bg-gray-300 rounded"></div>
                                                <div className="flex flex-col gap-2 w-full">
                                                    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                                                    <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) :
                                loaderType === "sidebar" ? (
                                    <div className="flex flex-col gap-4 animate-pulse">
                                        {[1, 2, 3, 4, 5].map((item) => (
                                            <div key={item} className="flex items-center gap-3">
                                                {/* Icon skeleton */}
                                                <div className="w-[18px] h-[18px] bg-gray-300 rounded"></div>

                                                {/* Text line */}
                                                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) :
                                    loaderType === "recentlyAdded" ?
                                        (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                                    <div
                                                        key={item}
                                                        className="bg-white border border-[#E9EAF0] animate-pulse overflow-hidden flex flex-col"
                                                    >
                                                        <div className="aspect-[16/10] bg-gray-200"></div>

                                                        <div className="p-4 flex flex-col flex-grow space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                                                <div className="h-5 w-16 bg-gray-200 rounded"></div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                                                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                                            </div>
                                                            <div className="mt-auto pt-4 border-t border-[#E9EAF0] flex justify-between items-center">
                                                                <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>SkeltonLoader</div>
                                        )
            }
        </>

    )
}

export default SkeltonLoader