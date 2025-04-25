import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { post, get } from "../../../utils/api";
import { User, Mail, Phone, MapPin, ArrowLeft, UserPlus } from "lucide-react";

const UserUpdate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user_id } = location?.state || {};

    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    
    const fetchData = async () => {
        try {
            const res = await get(`/api/get-single-user/${user_id}`, {});
            setData(res.result[0]);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
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
        setIsLoading(true);
        try {
            const res = await post(`/api/update-user/${user_id}`, data);
            console.log(res);
            navigate('/admin/user');
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setIsLoading(false);
        }
    };
  
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center mb-8">
                        <Link to="/admin/user" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            <span>Back to users</span>
                        </Link>
                        <div className="ml-auto">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-center mb-2">Update User</h1>
                    <p className="text-gray-500 text-center mb-8">Enter the details of the user below</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                            <input
                                name="name"
                                id="name"
                                onChange={handleChange}
                                type="text"
                                value={data.name}
                                placeholder="John Doe"
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                            <input
                                name="email"
                                id="email"
                                onChange={handleChange}
                                type="email"
                                value={data.email}
                                placeholder="user@example.com"
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Address</label>
                            <input
                                name="address"
                                id="address"
                                onChange={handleChange}
                                type="text"
                                value={data.address}
                                placeholder="123 Main St, City, Country"
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                            <input
                                name="phone"
                                id="phone"
                                onChange={handleChange}
                                type="text"
                                value={data.phone}
                                placeholder="98********"
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="pt-4 space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                {isLoading ? (
                                    <span className="inline-flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-5 w-5" />
                                        Update User
                                    </>
                                )}
                            </button>
                            <Link
                                to="/admin/user"
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserUpdate;