import '../../styles/typography.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <section className="bg-[#F8F7FA] min-h-screen flex items-center justify-center overflow-hidden">
            <div className="relative">

                <div className="absolute -top-5 -left-8 w-[120px] h-[120px] rounded-[10px] bg-[#7367F0]/8"></div>
                <div className="absolute -bottom-4 -right-5 w-[100px] h-[100px] rounded-[14px] bg-[#7367F0]/8"></div>

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
                                Welcome to KCG InstaLearn!
                                <span>👋🏻</span>
                            </h3>
                            <p className="text-[#2F2B3DB2] text-[15px] pr-20">
                                Please log in to account and start the adventure
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <form>
                                <div className="flex flex-col text-sm gap-1 w-full mb-4">
                                    <span className="text-[#2F2B3DE5]">
                                        Email or Username
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
                                    <div className="flex flex-row gap-2 items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-[#7367F0]"
                                        />
                                        <span className="text-sm text-[#2F2B3DE5]">
                                            Remember me
                                        </span>
                                    </div>

                                    <a href="#" className="text-sm text-[#7367F0]">
                                        Forgot password?
                                    </a>
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
                                    New on our platform?
                                    <a href="/signup"
                                     className="text-[#7367F0] pl-1">
                                        Create an account
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