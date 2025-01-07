import axios from "axios";

// Debug to verify environment variable
// console.log("API Base URL:", process.env.REACT_APP_HOST);

const api = axios.create({
    baseURL: `http://${import.meta.env.VITE_HOST || 'localhost:5050'}`, // Ensure REACT_APP_HOST is defined in .env
    withCredentials: true, // For cookies/auth
    headers: {
        "Content-Type": "application/json", // Ensures proper JSON communication
    },
});

// Function to handle GET requests
export const get = async (endpoint, params = {}) => {
    try {
        const response = await api.get(endpoint, { params });
        return response.data; // Return data from the response
    } catch (error) {
        handleError(error);
        throw error; // Re-throw error for further handling
    }
};

// Function to handle POST requests
export const post = async (endpoint, body = {}) => {
    try {
        const response = await api.post(endpoint, body);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

// Function to handle PUT requests
export const put = async (endpoint, body = {}) => {
    try {
        const response = await api.put(endpoint, body);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

// Function to handle DELETE requests
export const del = async (endpoint) => {
    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

// Utility function for handling errors
const handleError = (error) => {
    console.error("API Error:", error.response || error.message);
    alert(error.response?.data?.message || "An error occurred. Please try again.");
};
