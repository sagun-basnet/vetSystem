import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../utils/api";
import axios from "axios";

import Cookies from "js-cookie";

const User = () => {
    
    const navigate=useNavigate();
    // const data = [
    //     { id: 1, name: "John Doe", age: 28, country: "USA" },
    //     { id: 2, name: "Jane Smith", age: 32, country: "Canada" },
    //     { id: 3, name: "Sam Brown", age: 45, country: "UK" },
    //     { id: 4, name: "Lucy Green", age: 25, country: "Australia" },
    // ];
    const [data, setData] = useState([]);
    console.log(data);
    
    const fetchData = async () => {
         const res = await get('/api/get-user', {});
        //  setData(res);
         setData(res);
        // await axios
        //     .get("http://localhost:5050/api/get-user")
        //     .then((res) => {
        //         setData(res.data);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleUpdate = (id) => {
        console.log(id)
        navigate(`/admin/updateuser/${id}`);
    };
    return (
        <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
            <div className="flex justify-between">
                <h1 className="font-medium text-[30px] text-primary ">
                    All User
                </h1>
                <button className="bg-[#437EF7] py-2 px-6 rounded-md text-white">
                    <Link to={`/admin/adduser`}>
                    Add User
                    </Link>
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
                                        onClick={() =>
                                            handleUpdate(row.id)
                                        }
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

export default User;
