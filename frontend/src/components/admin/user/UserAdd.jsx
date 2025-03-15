
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../../utils/api";
import { toast } from "react-toastify";

const UserAdd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
    });
    console.log(formData);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("I am here")
        const res = await post("/api/add-user", formData);
        if (res.success === 1) {
            toast.success(res.message);
            navigate("/admin/user");
        } else {
            toast.error(res.message);
        }
        
    };

    return (
        <div>
            <div className="flex items-center justify-center h-[90vh]">
                <div className="max-w-[343px] md:max-w-[550px] w-full flex flex-col gap-5 bg-white px-4 md:px-8 py-6 md:py-8 rounded-md shadow-sm shadow-slate-300">
                    <h1 className="text-center font-bold text-3xl">Add User</h1>

                    <div className="flex flex-col w-full gap-2">
                        <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                            Name
                        </label>
                        <input
                            name="name"
                            id="name"
                            onChange={handleChange}
                            type="text"
                            value={formData.name}
                            className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                        />
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                            Email
                        </label>
                        <input
                            name="email"
                            id="email"
                            onChange={handleChange}
                            type="text"
                            value={formData.email}
                            className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                        />
                    </div>
                   
                    <div className="flex flex-col w-full gap-2">
                        <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                            Address
                        </label>
                        <input
                            name="address"
                            id="address"
                            onChange={handleChange}
                            type="text"
                            value={formData.address}
                            className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                        />
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                            Phone
                        </label>
                        <input
                            name="phone"
                            id="phone"
                            onChange={handleChange}
                            type="text"
                            value={formData.phone}
                            className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                        />
                    </div>
                    

                    <button
                        onClick={handleSubmit}
                        className="bg-[#437EF7] text-white py-3 rounded-sm font-semibold tracking-[0.48px] "
                    >
                        Add User
                    </button>
                    <button className="text-[#437EF7] font-semibold py-3 rounded-sm border-2 border-[#437EF7]">
                        <Link to="/" className="w-full">
                            Cancel
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserAdd;