import React, { useState } from "react";
import { Link } from "react-router-dom";
import { post } from "../../../utils/api";
import { toast } from "react-toastify";

const PostAdd = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("image", formData.image);

    try {
      const response = await post("/api/create-post", form, true);
      console.log(response, "response");
      if (response.success === 1) {
        // alert(response.message);
        toast.success(response.message);
        setFormData({
          title: "",
          description: "",
          image: null,
        });
        setPreview(null);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh] bg-[#f3f3f3]">
      <div className="max-w-[343px] md:max-w-[550px] w-full flex flex-col gap-5 bg-white px-4 md:px-8 py-6 md:py-8 rounded-md shadow-sm shadow-slate-300">
        <h1 className="text-center font-bold text-3xl">Add Post</h1>

        {/* Title */}
        <div className="flex flex-col w-full gap-2">
          <label className="font-medium text-[14px]">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border-2 border-gray-500 outline-none py-3 px-2 rounded-sm text-[14px]"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col w-full gap-2">
          <label className="font-medium text-[14px]">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border-2 border-gray-500 outline-none py-3 px-2 rounded-sm text-[14px]"
            rows={4}
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col w-full gap-2">
          <label className="font-medium text-[14px]">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-40 object-cover rounded-md border"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#437EF7] text-white py-3 rounded-sm font-semibold tracking-[0.48px]"
        >
          Add Post
        </button>
        <button className="text-[#437EF7] font-semibold py-3 rounded-sm border-2 border-[#437EF7]">
          <Link to="/admin" className="w-full">
            Cancel
          </Link>
        </button>
      </div>
    </div>
  );
};

export default PostAdd;
