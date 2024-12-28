import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const UserUpdate = () => {
    // const params=useParams();
    const { id } = useParams();
    // console.log(params)

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        hobby: "",
    });
    console.log(data);
    const fetchData = async () => {
       
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setData((prevData) => ({ ...prevData, [id]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
    };

    return (
        <div className="flex items-center justify-center h-[100vh] bg-[#f3f3f3]">
            <div className="max-w-[343px] md:max-w-[550px] w-full flex flex-col gap-5 bg-white px-4 md:px-8 py-6 md:py-8 rounded-md shadow-sm shadow-slate-300">
                <h1 className="text-center font-bold text-3xl">Update User</h1>
                <div className="flex flex-col w-full gap-2">
                    <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                        Name
                    </label>
                    <input
                        name="name"
                        id="name"
                        onChange={handleChange}
                        type="text"
                        value={data.name}
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
                        value={data.email}
                        className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                    />
                </div>
                <div className="flex flex-col w-full gap-2">
                    <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                        Password
                    </label>
                    <input
                        name="password"
                        id="password"
                        onChange={handleChange}
                        type="password"
                        value={data.password}
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
                        value={data.phone}
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
                        value={data.address}
                        className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                    />
                </div>
                <div className="flex flex-col w-full gap-2">
                    <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                        Hobby
                    </label>
                    <input
                        name="hobby"
                        id="hobby"
                        onChange={handleChange}
                        type="text"
                        value={data.hobby}
                        className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-[#437EF7] text-white py-3 rounded-sm font-semibold tracking-[0.48px] "
                >
                    Update User
                </button>
                <button
                    type="submit"
                    className="text-[#437EF7] font-semibold py-3 rounded-sm border-2 border-[#437EF7]"
                >
                    <Link to={"/"}>Cancel</Link>
                </button>
            </div>
        </div>
    );
};

export default UserUpdate;