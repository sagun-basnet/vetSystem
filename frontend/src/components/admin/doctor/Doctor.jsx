import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../utils/api";

const Doctor = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    console.log(data);

    const fetchData = async () => {
        const res = await get("/api/get-doctors", {});
        setData(res);
    };

    useEffect(() => {
        fetchData();
    }, []);
    const handleUpdate = (id) => {
        navigate(`/admin/updatedoctor/${id}`, {
            state: { user_id: id }, // Passing the row details as state
        });
    };
    return (
        <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
            <div className="flex justify-between">
                <h1 className="font-medium text-[30px] text-primary ">
                    All Doctor
                </h1>
                <button className="bg-[#437EF7] py-2 px-6 rounded-md text-white">
                    <Link to={"/admin/adddoctor"}>Add Doctor</Link>
                </button>
            </div>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full table-auto border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                ID
                            </th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                Name
                            </th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                Address
                            </th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                Email
                            </th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                Phone
                            </th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b text-sm text-gray-800">
                                    {row.id}
                                </td>
                                <td className="px-4 py-2 border-b text-sm text-gray-800">
                                    {row.name}
                                </td>
                                <td className="px-4 py-2 border-b text-sm text-gray-800">
                                    {row.address}
                                </td>
                                <td className="px-4 py-2 border-b text-sm text-gray-800">
                                    {row.email}
                                </td>
                                <td className="px-4 py-2 border-b text-sm text-gray-800">
                                    {row.phone}
                                </td>
                                <td className="px-4 py-2 border-b text-sm text-gray-800 flex gap-4">
                                    <button
                                        className="bg-[#437EF7] text-white px-6 py-2 rounded-md"
                                        onClick={() => handleUpdate(row.id)} // Pass the row object
                                    >
                                        Update
                                    </button>
                                    <button className="bg-red-500 text-white px-6 py-2 rounded-md">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Doctor;
