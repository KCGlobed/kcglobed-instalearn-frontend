import Footer from "../../layouts/Footer";
import MainHeader from "../../layouts/MainHeader";
import TopHeader from "../../layouts/TopHeader";

const HelpCentre = () => {
    return (
        <>

            <TopHeader />
            <MainHeader />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-10 w-full max-w-xl">
                    <h2 className="text-center text-lg font-medium text-gray-800 mb-8">Helpline</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Phone Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-7 h-7 text-gray-800"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                />
                            </svg>
                            <div className="w-6 h-px bg-gray-300" />
                            <div className="text-center">
                                <p className="font-medium text-sm text-gray-800">+91 9667 583222</p>
                                <p className="text-xs text-gray-500 mt-1">Student Relations</p>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-7 h-7 text-gray-800"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                />
                            </svg>
                            <div className="w-6 h-px bg-gray-300" />
                            <div className="text-center">
                                <p className="font-medium text-sm text-gray-800">info@kcglobed.com</p>
                                <p className="text-xs text-gray-500 mt-1">Write to Us</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HelpCentre;