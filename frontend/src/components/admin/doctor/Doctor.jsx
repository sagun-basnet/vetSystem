import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../utils/api";
import { Search, RefreshCw, UserPlus, Edit, Trash2, MapPin, Mail, Phone } from "lucide-react";

const Doctor = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await get("/api/get-doctors", {});
            setData(res);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdate = (id) => {
        navigate(`/admin/updatedoctor/${id}`, {
            state: { user_id: id },
        });
    };

    const filteredData = data.filter(doctor => 
        doctor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.phone?.includes(searchQuery)
    );

    const handleRefresh = () => {
        fetchData();
    };

    // Generate initials for avatar
    const getInitials = (name) => {
        if (!name) return "DR";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    // Generate random color based on name
    const getAvatarColor = (name) => {
        if (!name) return "bg-blue-100 text-blue-600";
        const colors = [
            "bg-blue-100 text-blue-600",
            "bg-purple-100 text-purple-600",
            "bg-green-100 text-green-600",
            "bg-yellow-100 text-yellow-600",
            "bg-red-100 text-red-600",
            "bg-indigo-100 text-indigo-600"
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
                <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold">Doctor Management</h1>
                </div>
                <div className="ml-auto flex items-center space-x-3">
                    <button 
                        onClick={handleRefresh} 
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="h-5 w-5 text-gray-600" />
                    </button>
                    <Link 
                        to="/admin/adddoctor" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                    >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Add Doctor
                    </Link>
                </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search doctors by name, email, or phone..."
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="text-gray-500 ml-4">
                    {filteredData.length} doctors found
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">NAME</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">CONTACT INFORMATION</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">ADDRESS</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex justify-center">
                                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    No doctors found matching your search criteria
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        #{doctor.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(doctor.name)}`}>
                                                <span className="font-medium">{getInitials(doctor.name)}</span>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                {doctor.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                {doctor.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <MapPin className="!text-lg text-gray-400" />
                                            {doctor.address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleUpdate(doctor.id)}
                                                className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </button>
                                            <button 
                                                className="flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Doctor;