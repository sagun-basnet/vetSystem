import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../../utils/api";
import { toast } from "react-toastify";

const DoctorAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [profilePic, setProfilePic] = useState(null); // For storing image

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    if (profilePic) {
      payload.append("profile", profilePic);
    }

    const res = await post(`/api/add-doctor`, payload, true); // `true` for multipart/form-data
    if (res.success === 1) {
      toast.success(res.message);
      navigate("/admin/doctor");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh] bg-[#f3f3f3]">
      <div className="max-w-[343px] md:max-w-[550px] w-full flex flex-col gap-5 bg-white px-4 md:px-8 py-6 md:py-8 rounded-md shadow-sm shadow-slate-300">
        <h1 className="text-center font-bold text-3xl">Add Doctor</h1>

        {["name", "email", "phone", "address"].map((field) => (
          <div key={field} className="flex flex-col w-full gap-2">
            <label className="font-medium text-[14px] capitalize leading-[20px] tracking-[-0.28px]">
              {field}
            </label>
            <input
              name={field}
              id={field}
              onChange={handleChange}
              type="text"
              value={formData[field]}
              className="border-2 border-[#5c5c5c] outline-none py-3 px-2 w-full rounded-sm text-[14px] leading-[20px] tracking-[-0.28px]"
            />
          </div>
        ))}

        {/* Profile Image Input */}
        <div className="flex flex-col w-full gap-2">
          <label className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]">
            Profile Picture
          </label>
          <input
            type="file"
            name="profile"
            accept="image/*"
            onChange={handleFileChange}
            className="border-2 border-[#5c5c5c] py-2 px-2 w-full rounded-sm text-[14px]"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#437EF7] text-white py-3 rounded-sm font-semibold tracking-[0.48px]"
        >
          Add Doctor
        </button>
        <button className="text-[#437EF7] font-semibold py-3 rounded-sm border-2 border-[#437EF7]">
          <Link to="/admin/doctor" className="w-full">
            Cancel
          </Link>
        </button>
      </div>
    </div>
  );
};

export default DoctorAdd;
