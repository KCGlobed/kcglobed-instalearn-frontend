import '../../styles/typography.css';
import { ChevronLeft } from "lucide-react";

const ForgotPassword = () => {

    return (
        <section className="bg-[#F8F7FA] min-h-screen flex items-center justify-center overflow-hidden">
            <div className="relative">

                <div className="absolute -top-5 -left-8 w-[120px] h-[120px] rounded-[10px] bg-[#7367F0]/[8%]"></div>
                <div className="absolute -bottom-4 -right-5 w-[100px] h-[100px] rounded-[14px] bg-[#7367F0]/[8%]"></div>

                <div className="relative z-10 bg-white w-[460px] flex flex-col shadow-md rounded-lg items-center">
                    <div className='w-[125px] h-[25px] my-10'>
                        <img
                            src="/instalogo.png"
                            alt="KC Globed"
                        />
                    </div>

                    <div className="w-full px-10">
                        <div>
                            <h3 className="text-[#2F2B3DE5] text-[20px] font-semibold">
                                Forgot Password
                                <span> 🔒</span>
                            </h3>
                            <p className="text-[#2F2B3DB2] text-[15px] pr-10">
                                Enter your email address and we'll send you instructions to reset your password
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <form>
                                <div className="flex flex-col text-sm gap-1 w-full mb-4">
                                    <span className="text-[#2F2B3DE5]">
                                        Email
                                    </span>
                                    <div className="relative w-full">
                                        <input
                                            placeholder="Enter your email"
                                            className="h-[38px] w-full rounded border border-gray-300 pl-3 pr-10 text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-[38px] bg-[#7367F0] text-white rounded mt-6"
                                >
                                    Send Reset Link
                                </button>
                            </form>

                            <div className='flex justify-center align-center pb-10'>
                                <a href="/login" className="flex items-center font-medium gap-1 text-[#7367F0]">
                                <ChevronLeft />
                                Back Login
                            </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
};

export default ForgotPassword;