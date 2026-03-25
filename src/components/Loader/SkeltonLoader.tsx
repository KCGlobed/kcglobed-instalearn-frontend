
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
                ) : (
                    <div>SkeltonLoader</div>
                )
            }
        </>

    )
}

export default SkeltonLoader