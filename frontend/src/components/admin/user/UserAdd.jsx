import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../../utils/api";
import { toast } from "react-toastify";
import { 
  UserPlus, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  ArrowLeft,
  Loader2,
  X
} from "lucide-react";

const UserAdd = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await post("/api/add-user", formData);
      if (res.success === 1) {
        toast.success(res.message || "User added successfully");
        navigate("/admin/user");
      } else {
        toast.error(res.message || "Failed to add user");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className=" w-[80%] space-y-8 bg-white p-8 rounded-xl shadow-md">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/admin/user")}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to users</span>
            </button>
            <div className="bg-blue-100 p-2 rounded-full">
              <UserPlus size={20} className="text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Add New User</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the details of the new user below
          </p>
        </div>
        
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                    errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X size={12} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm`}
                  placeholder="user@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X size={12} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            
            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                    errors.address ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm`}
                  placeholder="itahari, sunsari, nepal"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X size={12} className="mr-1" />
                  {errors.address}
                </p>
              )}
            </div>
            
            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                    errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm`}
                  placeholder="98********"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X size={12} className="mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Adding User...
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-2" />
                  Add User
                </>
              )}
            </button>
            
            <Link
              to="/admin/user"
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAdd;