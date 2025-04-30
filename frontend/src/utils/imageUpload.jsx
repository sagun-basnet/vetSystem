import { post } from "./api";

// utils/imageUpload.js
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = post("/api/upload");
    console.log(response);

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    return response.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
