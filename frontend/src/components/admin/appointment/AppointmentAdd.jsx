import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { get, post } from "../../../utils/api";

const AppointmentAdd = () => {
    const { currentUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        date: "",
        service: "",
        doctor_id: "", 
        user_id: currentUser.id,
    });
    console.log(formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    
    const [doctor, setDoctor] = useState([]);
    
    const fetchDoctor = async () => {
        const res = await get("/api/get-doctors", {});
        setDoctor(res); // assume res contains an array of doctor objects
    };
    
    useEffect(() => {
        fetchDoctor();
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res=post('/api/book-appointment',formData);
        console.log(res);
        // alert('Appointment added successfully');

    };
    

    return (
        <div>
            <div className="flex items-center justify-center h-[100vh] bg-[#f3f3f3]">
                <div className="max-w-[343px] md:max-w-[550px] w-full flex flex-col gap-5 bg-white px-4 md:px-8 py-6 md:py-8 rounded-md shadow-sm shadow-slate-300">
                    <h1 className="text-center font-bold text-3xl">
                        Add Appointment
                    </h1>

                    <div className="flex flex-col w-full gap-2">
                        <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                            Date
                        </label>
                        <input
                            name="date"
                            id="date"
                            onChange={handleChange}
                            type="date"
                            value={formData.date}
                            className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                        />
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                            Service
                        </label>
                        <textarea
                            name="service"
                            id="service"
                            onChange={handleChange}
                            type="text"
                            value={formData.service}
                            className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                        />
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
                            Doctor
                        </label>
                        <select
                            name="doctor_id" 
                            id="doctor"
                            onChange={handleChange}
                            value={formData.doctor_id} 
                            className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
                        >
                            <option value="">Choose Doctor</option> {/* Default option */}
                            {doctor.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name} {/* Assuming doc has an id and name */}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-[#437EF7] text-white py-3 rounded-sm font-semibold tracking-[0.48px] "
                    >
                        Add Appointment
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

export default AppointmentAdd;
