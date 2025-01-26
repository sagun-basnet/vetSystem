import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { post } from "../../utils/api";

const OTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location?.state || {};
    const [formData, setFormData] = useState({
        otp: "",
        email: email,
    });
    const [otpVerify,setOtpVerify] = useState();
    console.log(otpVerify);
    console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = post("/api/verify-otp", formData);

        alert(`Email verified sucessfully`);
        setOtpVerify(res.message);
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col gap-5 items-center justify-center min-h-screen mx-4">
            <div className="flex flex-col gap-6 max-w-sm md:max-w-md lg:max-w-lg w-full px-8 py-7 rounded-lg shadow-lg shadow-gray-300 bg-white text-sm">
                <h1 className="text-purple-800 font-semibold text-3xl text-center">
                    OTP Verification
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* OTP */}
                    <input
                        type="email"
                        name="email"
                        value={email}
                        id="email"
                        disabled
                        className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                    />
                    <div className="space-y-1">
                        <label
                            htmlFor="otp"
                            className="text-sm text-gray-700 pl-1"
                        >
                            OTP
                        </label>
                        <input
                            type="number"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            id="otp"
                            class="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary border-2 border-primary text-white py-3 text-[15px] rounded-sm font-semibold transition-all duration-500 ease-in-out hover:bg-white hover:text-primary"
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OTP;
