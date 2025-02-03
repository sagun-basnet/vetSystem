import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../../utils/api";

const Post = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    console.log(data);

    const fetchData = async () => {
        const res = await get("/api/get-posts", {});
        setData(res);
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="flex-1 shadow-lg shadow-gray-300 rounded-md px-3 py-3">
            <div className="flex justify-between">
                <h1 className="font-medium text-[30px] text-primary ">
                    All Post
                </h1>
                <button className="bg-[#437EF7] py-2 px-6 rounded-md text-white">
                    Add Post
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
                                title
                            </th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                description
                            </th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                                image
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
                                    {row.title}
                                </td>
                                <td className="px-4 py-2 border-b text-sm text-gray-800">
                                    {row.description}
                                </td>
                                <td className="px-4 py-2 border-b text-sm text-gray-800">
                                    {row.image}
                                </td>
                               
                               
                                <td className="px-4 py-2 border-b text-sm text-gray-800 flex gap-4">
                                    <button className="bg-[#437EF7] text-white px-6 py-2 rounded-md">
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

export default Post;
