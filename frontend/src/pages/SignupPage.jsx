import { useState } from "react";
import { post } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    role_id: 3,
    confirmPassword: "",
  });
  const [profilePic, setProfilePic] = useState(null); // separate state for profile picture

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, address, phone } = formData;

    if (!name || !email || !password || !address || !phone) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Prepare FormData for file upload
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    if (profilePic) {
      payload.append("profile", profilePic);
    }

    try {
      const res = await post("/api/register", payload, true); // third param `true` for multipart
      if (res.success == 1) {
        toast.success(res.message);
        navigate("/verify-otp", { state: { email } });
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen">
      <div className="flex flex-col gap-6 max-w-sm md:max-w-md lg:max-w-lg w-full px-8 py-7 rounded-lg shadow-lg shadow-gray-300 bg-white text-sm">
        <h1 className="text-primary font-semibold text-3xl text-center">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <div className="relative w-full">
              <label htmlFor="password" className=" text-sm text-gray-700 pl-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                id="firstName"
                className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label htmlFor="password" className=" text-sm text-gray-700 pl-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              id="email"
              className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <label htmlFor="password" className=" text-sm text-gray-700 pl-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              id="address"
              className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <label htmlFor="password" className=" text-sm text-gray-700 pl-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              id="phone"
              className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className=" text-sm text-gray-700 pl-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              id="password"
              className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="password" className=" text-sm text-gray-700 pl-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              id="confirmPassword"
              className="w-full outline-none border-2 border-gray-300 px-4 py-3 rounded-sm focus:ring-2 focus:border-none focus:ring-primary transition-all"
            />
          </div>
          <div className="relative">
            <label htmlFor="profile" className="text-sm text-gray-700 pl-1">
              Profile Picture
            </label>
            <input
              type="file"
              name="profile"
              accept="image/*"
              onChange={handleFileChange}
              id="profile"
              className="w-full border-2 border-gray-300 px-4 py-2 rounded-sm text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-sm font-semibold"
          >
            Sign up
          </button>
        </form>
        <div className="flex gap-3 text-primary items-center justify-between">
          <span className="text-sm">Already have an account?</span>
          <Link to="/login">
            <span className="font-semibold text-sm">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
