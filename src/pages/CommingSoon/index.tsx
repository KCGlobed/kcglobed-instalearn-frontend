import Footer from "../../layouts/Footer";
import MainHeader from "../../layouts/MainHeader";

const ComingSoon = () => {
    return (
        <>
            <MainHeader />
            <div className="flex items-center justify-center min-h-[500px] bg-gray-100">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        Coming Soon
                    </h1>
                    <p className="text-gray-500 text-lg mb-6">
                        We are working hard to bring something amazing. Stay tuned!
                    </p>

                    <div className="flex justify-center gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Notify Me
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ComingSoon;