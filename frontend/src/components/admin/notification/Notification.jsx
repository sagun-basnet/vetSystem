import React, { useState } from "react";
import { post } from "../../../utils/api";
import { toast } from "react-toastify";
import { FaBell, FaLink, FaSpinner, FaPaperPlane } from "react-icons/fa";

const Notification = () => {
  const initialState = {
    message: "",
    link: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [charactersLeft, setCharactersLeft] = useState(300);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length > 300) {
      newErrors.message = "Message cannot exceed 300 characters";
    }
    
    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = "Please enter a valid URL (e.g., https://example.com)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url) => {
    if (!url.trim()) return true; // Empty link is valid
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before sending");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await post("/send-notification", formData);
      
      if (res && res.success) {
        toast.success("Notification sent successfully!");
        setFormData(initialState);
        setCharactersLeft(300);
      } else {
        toast.error(res?.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("An error occurred while sending the notification");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === "message") {
      setCharactersLeft(300 - value.length);
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <FaBell className="text-blue-500 text-2xl mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">
          Send Notification
        </h1>
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-sm text-blue-700">
              Use this form to send important notifications to all users. Keep messages clear and concise.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Notification Message*
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Enter your notification message here..."
                  className={`w-full resize-none border ${errors.message ? 'border-red-500' : 'border-gray-300'} 
                    rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                  <span className={charactersLeft < 0 ? 'text-red-500 font-medium' : ''}>
                    {charactersLeft}
                  </span> characters left
                </div>
              </div>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                Action Link (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="link"
                  name="link"
                  placeholder="https://example.com/page"
                  className={`w-full border ${errors.link ? 'border-red-500' : 'border-gray-300'} 
                    rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  value={formData.link}
                  onChange={handleChange}
                />
                <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.link && (
                <p className="mt-1 text-sm text-red-600">{errors.link}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Add a URL where users will be directed when they click on the notification
              </p>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setFormData(initialState)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-6 rounded-md mr-3 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isLoading}
              >
                Clear
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tips for effective notifications:</h3>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>Keep messages concise and direct</li>
              <li>Include a clear call to action</li>
              <li>Avoid sending too many notifications in a short time period</li>
              <li>Consider the urgency level - is this notification truly important?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;