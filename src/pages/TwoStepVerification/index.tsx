import '../../styles/typography.css';
import { useState } from 'react';

const TwoStepVerification = () => {
    const [code, setCode] = useState<string[]>(Array(6).fill(''));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (isNaN(Number(e.target.value))) return;
        setCode([...code.map((data, i) => (i === index ? e.target.value : data))]);
        if (e.target.value && e.target.nextSibling) {
            (e.target.nextSibling as HTMLInputElement).focus();
        }
    } 

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && e.currentTarget.previousSibling) {
            (e.currentTarget.previousSibling as HTMLInputElement).focus();
        }
    } 

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData('text').slice(0, 6).split('');
        if (paste.every(c => !isNaN(Number(c)))) {
            setCode(paste.concat(Array(6 - paste.length).fill('')));
        }
    }

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
                                Two Step Verification
                                <span>💬</span>
                            </h3>
                            <p className="text-[#2F2B3DB2] text-[15px]">
                                We sent a verification code to your email. Please check your inbox and enter the code below to verify your account.
                            </p>
                        </div>

                        <div className="flex flex-col text-sm gap-1 w-full mt-5 mb-4">
                            <p className="text-[#2F2B3DB2] py-2">
                                Type your 6 digit security code
                            </p>

                            <div className='flex flex-row'>
                                {code.map((digit, index) => (
                                    <input
                                        className='border w-[55px] h-[55px] text-center mx-1 rounded focus:outline-none focus:ring-2 focus:ring-[#7367F0]'
                                        key={index}
                                        type="text"
                                        value={digit}
                                        maxLength={1}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e)}
                                        onPaste={handlePaste} />

                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <button
                                type="submit"
                                className="w-full h-[38px] bg-[#7367F0] text-white rounded "
                            >
                                Verify My Account
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
export default TwoStepVerification;