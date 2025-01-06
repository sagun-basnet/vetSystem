import { useState } from "react";
import { post } from "../utils/api";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        // lastName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        role_id: 3,
    });
    console.log(formData);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.address ||
            !formData.phone
        ) {
            alert("Please fill in all fields");
            return;
        }
        const res = post("/api/register", formData);
        console.log(res);

        alert(`Registration successful! Email: ${formData}`);
        navigate('/')
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    return (
        <div className="flex flex-col gap-5 items-center justify-center min-h-screen">
            <div className="flex flex-col gap-6 max-w-sm md:max-w-md lg:max-w-lg w-full px-8 py-7 rounded-lg shadow-lg shadow-gray-300 bg-white text-sm">
                <h1 className="text-primary font-semibold text-3xl text-center">
                    Sign Up
                </h1>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex gap-3">
                        <div className="relative w-full">
                            <label
                                htmlFor="password"
                                className=" text-sm text-gray-700 pl-1"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                id="firstName"
                                className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className=" text-sm text-gray-700 pl-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            id="email"
                            className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Address */}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className=" text-sm text-gray-700 pl-1"
                        >
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            id="address"
                            className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className=" text-sm text-gray-700 pl-1"
                        >
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            id="phone"
                            className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className=" text-sm text-gray-700 pl-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            id="password"
                            className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className=" text-sm text-gray-700 pl-1"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            id="confirmPassword"
                            className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Gender Selection */}


                    <button
                        type="submit"
                        className="w-full bg-primary border-2 border-primary text-[15px] text-white py-3 rounded-sm font-semibold transition-all duration-500 ease-in-out hover:bg-white hover:text-primary"
                    >
                        Sign up
                    </button>
                </form>
                <div className="flex gap-3 text-primary items-center justify-between">
                    <span className="text-sm">Already have an account?</span>
                    <span className="font-semibold text-sm">Sign In</span>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
