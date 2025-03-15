import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../utils/api";
import { AuthContext } from "../../../context/authContext";
import { toast } from "react-toastify";
import { MdCancel, MdLogin } from "react-icons/md";

const AppointmentAdmin = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const res = await get(`/api/get-appointment`, {});
        setData(res);
    };

    useEffect(() => {
        fetchData();
    }, []);

    

   


    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-CA"); 
    };

    return (
        <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
            <div className="flex justify-between">
                <h1 className="font-medium text-[30px] text-primary">All Post</h1>
                
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

                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div>
            ) : (
                <div>No appointment found.</div>
            )}
        </div>
    );
};

export default AppointmentAdmin;
