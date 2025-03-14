import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../utils/api";
import { AuthContext } from "../../../context/authContext";
import { toast } from "react-toastify";
import { MdCancel, MdLogin } from "react-icons/md";

const Appointment = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(null);
    const [singleAppointment, setSingleAppointment] = useState(null);

    const fetchData = async () => {
        const res = await get(`/api/getAppointmentByUser/${currentUser.id}`, {});
        setData(res);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchSingleAppointment = async () => {
        if (!id) return;
        const res = await get(`/api/get-appointment/${id}`, {});
        setSingleAppointment(res);
    };

    useEffect(() => {
        if (id) {
            fetchSingleAppointment();
        }
    }, [id]);

    const handleView = (rowId) => {
        setId(rowId);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        const res = await get(`/api/cancel-appointment/${id}`);
        if (res.success === 1) {
            toast.success(res.message);
            fetchData(); 
        } else {
            toast.error(res.message);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-CA"); 
    };

    return (
        <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
            <div className="flex justify-between">
                <h1 className="font-medium text-[30px] text-primary">All Post</h1>
                <Link to={"/user/addappointment"}>
                    <button className="bg-[#437EF7] py-2 px-6 rounded-md text-white">
                        Add Appointment
                    </button>
                </Link>
            </div>

            {data.length > 0 ? (
                <div className="overflow-x-auto my-6">
                    <table className="min-w-full table-auto border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">SN</th>
                                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Service</th>
                                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Date</th>
                                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Doctor Name</th>
                                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Status</th>
                                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b text-sm text-gray-800">{index + 1}</td>
                                    <td className="px-4 py-2 border-b text-sm text-gray-800">{row.service}</td>
                                    <td className="px-4 py-2 border-b text-sm text-gray-800">{formatDate(row.date)}</td>
                                    <td className="px-4 py-2 border-b text-sm text-gray-800">{row.doctor_name}</td>
                                    <td className="px-4 py-2 border-b text-sm text-gray-800">{row.status}</td>

                                    <td className="px-4 py-2 border-b text-sm text-gray-800 flex gap-4">
                                        <button
                                            className="bg-[#437EF7] text-white px-6 py-2 rounded-md"
                                            onClick={() => handleView(row.id)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-6 py-2 rounded-md"
                                            onClick={() => handleDelete(row.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {open && singleAppointment && (
                        <div className="absolute top-[40%] right-[40%] py-9 px-20 bg-gray-50 shadow-lg shadow-gray-300 rounded-md">
                            <div className="space-y-2">
                                <MdCancel
                                    className="absolute top-3 right-3 text-2xl cursor-pointer"
                                    onClick={() => {
                                        setOpen(false);
                                        setId(null);
                                    }}
                                />
                                <h3 className="font-medium text-xl text-gray-700">Appointment</h3>
                                <p className="pt-3">Service: {singleAppointment.service}</p>
                                <p>Date: {formatDate(singleAppointment.date)}</p>
                                <p>Status: {singleAppointment.status}</p>
                                <p>Doctor Name: {singleAppointment.doctor_name}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>No appointment found.</div>
            )}
        </div>
    );
};

export default Appointment;
