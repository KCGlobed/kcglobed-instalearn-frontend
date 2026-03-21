import '../../styles/typography.css';
import { useState } from 'react';

const VerifyEmail = () => {

    const [email, setEmail] = useState("user@example.com");

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
                                Verify Your Email
                                <span> ✉️</span>
                            </h3>
                            <p className="text-[#2F2B3DB2] text-[15px]">
                                Account activation link sent to your email address: <span className='font-bold'>{email}</span> Please follow the link inside to continue.
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <button
                                type="submit"
                                className="w-full h-[38px] bg-[#7367F0] text-white rounded "
                            >
                                Skip For Now
                            </button>

                            <div className="flex flex-col items-center gap-4 mb-10">
                                <p className="text-sm text-[#2F2B3DE5]">
                                    Didn't get the mail?
                                    <a href="#"
                                        className="text-[#7367F0] pl-2">
                                        Resend
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
};

export default VerifyEmail;