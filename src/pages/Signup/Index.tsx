import '../../styles/typography.css';
import { useState } from 'react';

const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <section className="bg-[#F8F7FA] min-h-screen flex items-center justify-center overflow-hidden">
            <div className="relative">

                <div className="absolute -top-5 -left-8 w-[120px] h-[120px] rounded-[10px] bg-[#7367F0]/8"></div>
                <div className="absolute -bottom-4 -right-5 w-[100px] h-[100px] rounded-[14px] bg-[#7367F0]/8"></div>

                <div className="relative z-10 bg-white w-[460px] flex flex-col shadow-md rounded-lg items-center">
                    <div className='w-[125px] h-[25px] mt-10 mb-7'>
                        <img
                            src="/instalogo.png"
                            alt="KC Globed"
                        />
                    </div>

                    <div className="w-full px-10">
                        <div>
                            <h3 className="text-[#2F2B3DE5] text-[20px] font-semibold">
                                Adventure starts here
                                <span> 🚀</span>
                            </h3>
                            <p className="text-[#2F2B3DB2] text-[15px]">
                                Make your app management easy and fun!
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <form>
                                <div className="flex flex-col text-sm gap-1 w-full mb-4">
                                    <span className="text-[#2F2B3DE5]">
                                        Username
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Enter your email or username"
                                        className="h-[38px] w-full rounded border border-gray-300 pl-3 pr-10 text-sm outline-none"
                                    />
                                </div>

                                <div className="flex flex-col text-sm gap-1 w-full mb-4">
                                    <span className="text-[#2F2B3DE5]">
                                        Email
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Enter your email or username"
                                        className="h-[38px] w-full rounded border border-gray-300 pl-3 pr-10 text-sm outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-1 w-full mb-4">
                                    <span className="text-sm text-[#2F2B3DE5]">
                                        Password
                                    </span>

                                    <div className="relative w-full">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="h-[38px] w-full rounded border border-gray-300 pl-3 pr-10 text-sm outline-none"
                                        />
                                        <img
                                            src="/eye.svg"
                                            alt="Show password"
                                            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-row gap-2 px-2 items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-[#7367F0]"
                                        />
                                        <span className="text-sm text-[#2F2B3DE5]">
                                            I agree to 
                                        </span>
                                        <a href="#" className="text-[#7367F0]">
                                            privacy policy and terms
                                        </a>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-[38px] bg-[#7367F0] text-white rounded mt-6"
                                >
                                    Log In
                                </button>
                            </form>

                            <div className="flex flex-col items-center gap-4">
                                <p className="text-sm text-[#2F2B3DE5]">
                                    Already have an account?{" "}
                                    <a href="/login" className="text-[#7367F0] pl-1">
                                        Sign in instead
                                    </a>
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-[#2F2B3D1F]" />
                                <span className="text-sm text-[#2F2B3DE5]">or</span>
                                <div className="flex-1 h-px bg-[#2F2B3D1F]" />
                            </div>

                            <div className="flex justify-center gap-4 pb-10">
                                <a href="#">
                                    <img src="/fb-icon.svg" alt="facebook" />
                                </a>
                                <a href="#">
                                    <img src="/twitter-icon.svg" alt="twitter" />
                                </a>
                                <a href="#">
                                    <img src="/git-icon.svg" alt="github" />
                                </a>
                                <a href="#">
                                    <img src="/Google-icon.svg" alt="Google" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;