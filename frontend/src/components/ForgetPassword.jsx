import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state
    setEmailError("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await post("/api/forgot-password", { email });

      if (res.success) {
        toast.success("OTP sent to your email");
        navigate(`/verify-otp-reset?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred while requesting OTP");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border border-indigo-100">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 p-5 rounded-full shadow-md">
            <Mail className="text-white w-8 h-8" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-8 px-4">
          Enter your email address and we'll send you a verification code
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block pl-1"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full pl-12 py-3 border-2 ${
                  emailError ? "border-red-500" : "border-indigo-100"
                } rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all`}
              />
              <div className="absolute left-3 top-3 bg-indigo-100 p-1 rounded">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            {emailError && (
              <div className="flex items-center text-red-500 text-sm mt-1 pl-1">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {emailError}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-4 flex items-center justify-center transition-colors disabled:bg-indigo-300 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Sending verification code...
              </>
            ) : (
              <>
                Send verification code
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={goToLogin}
            className="flex items-center justify-center w-full text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;