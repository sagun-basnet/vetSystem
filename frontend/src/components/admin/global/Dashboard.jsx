import React from "react";
import { FaUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { FaBloggerB } from "react-icons/fa";

const Dashboard = () => {
    const data = [
        { id: 1, name: "John Doe", age: 28, country: "USA" },
        { id: 2, name: "Jane Smith", age: 32, country: "Canada" },
        { id: 3, name: "Sam Brown", age: 45, country: "UK" },
        { id: 4, name: "Lucy Green", age: 25, country: "Australia" },
    ];
    return (
        <div className="space-y-10">
            <div className="flex justify-between gap-5">
                <div className="flex flex-col items-center shadow-lg shadow-gray-300 gap-3 py-6 px-[50px] rounded-md">
                    <FaUser className="text-[80px] text-blue-400" />
                    <span className="text-[30px] font-medium">6</span>
                    <span className="text-[15px] text-gray-500 font-medium">
                        Total Number of Users
                    </span>
                </div>
                <div className="flex flex-col items-center shadow-lg shadow-gray-300 gap-3 py-6 px-[50px] rounded-md">
                    <FaUserDoctor className="text-[80px] text-red-400" />
                    <span className="text-[30px] font-medium">6</span>
                    <span className="text-[15px] text-gray-500 font-medium">
                        Total Number of Doctors
                    </span>
                </div>
                <div className="flex flex-col items-center shadow-lg shadow-gray-300 gap-3 py-6 px-[50px] rounded-md">
                    <FaBloggerB className="text-[80px] text-primary" />
                    <span className="text-[30px] font-medium">6</span>
                    <span className="text-[15px] text-gray-500 font-medium">
                        Total Number of Posts
                    </span>
                </div>
            </div>
            <div className="flex gap-6 ">
                <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
                    <h1 className=" font-semibold text-[30px] text-primary ">Recent Post</h1>
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
                                        Age
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                        Country
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                            {row.id}
                                        </td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                            {row.name}
                                        </td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                            {row.age}
                                        </td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                            {row.country}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
                    <h1 className="font-semibold text-[30px] text-primary ">Recent User</h1>
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
                                        Age
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                        Country
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                            {row.id}
                                        </td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                            {row.name}
                                        </td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                            {row.age}
                                        </td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                            {row.country}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Dashboard;
