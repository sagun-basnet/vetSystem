import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { post, get } from "../../../utils/api";
import { toast } from "react-toastify";

const DoctorUpdate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user_id } = location?.state || {};
    console.log(user_id);

    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    console.log(data);

    const fetchData = async () => {
        const res = await get(`/api/get-single-user/${user_id}`, {});
        setData(res.result[0]);
    };

    useEffect(() => {
        fetchData();
    }, [user_id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setData((prevData) => ({ ...prevData, [id]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await post(`/api/update-doctor/${user_id}`, data);
        if(res.success===1){
            toast.success("Doctor Update successfully!");
            navigate("/admin/doctor");
        }else{
            toast.error(res.message);
        }
        console.log(res)
    };

    return (
        <div className="flex items-center justify-center h-[100vh] bg-[#f3f3f3]">
            <div className="max-w-[343px] md:max-w-[550px] w-full flex flex-col gap-5 bg-white px-4 md:px-8 py-6 md:py-8 rounded-md shadow-sm shadow-slate-300">
                <h1 className="text-center font-bold text-3xl">
                    Update Doctor
                </h1>
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

                <button
                    onClick={handleSubmit}
                    className="bg-primary text-white py-3 rounded-sm font-semibold tracking-[0.48px] "
                >
                    Update Doctor
                </button>
                <button
                    type="submit"
                    className="text-primary font-semibold py-3 rounded-sm border-2 border-primary"
                >
                    <Link to={"/admin/doctor"}>Cancel</Link>
                </button>
            </div>
        </div>
    );
};

export default DoctorUpdate;
