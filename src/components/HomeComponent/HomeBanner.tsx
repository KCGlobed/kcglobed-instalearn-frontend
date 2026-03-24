

const HomeBanner = () => {
    return (
        <div>
            <div className="container mx-auto ">
                <div className="grid grid-cols-2">
                    <div>
                        <h1>
                            <span className="text-[#7367F0]">Learn</span>
                        </h1>
                    </div>
                    <div className="he">
                        <img
                            src="/hero_banner.png"
                            alt="KC Globed"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HomeBanner