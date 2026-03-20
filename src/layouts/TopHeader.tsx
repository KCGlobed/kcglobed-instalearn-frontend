

const TopHeader = () => {
    return (
        <div>
            <nav className="bg-dark px-6 h-12 flex items-center justify-between">
                {/* Left: Logo + Nav Links */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    {/* <div className="w-7 h-7 bg-blue-500 rounded-md" /> */}

                    {/* Nav Links */}
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-white text-sm font-medium">Home</a>
                        <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">Courses</a>
                        <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">About</a>
                        <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">Contact</a>
                    </div>
                </div>

                {/* Right: Currency + Language */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-gray-400 text-[13px] px-2 py-1 rounded border border-gray-700 hover:text-white transition-colors">
                        INR
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button className="flex items-center gap-1 text-gray-400 text-[13px] px-2 py-1 rounded border border-gray-700 hover:text-white transition-colors">
                        English
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default TopHeader