import React, { useState, useEffect } from "react";
import { post } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

const VerifyOtpAndReset = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle input change for each OTP digit
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear OTP error if exists
    if (errors.otp) {
      setErrors({ ...errors, otp: "" });
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "" });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate OTP
    if (otp.join("").length !== 6) {
      newErrors.otp = "Please enter all 6 digits of the verification code";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await post("/api/reset-password", {
        email,
        otp: otp.join(""),
        newPassword: password,
      });

      if (res.success) {
        toast.success("Password reset successfully");
        navigate("/login");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred during password reset");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle resending OTP
  const handleResendOtp = async () => {
    if (timeLeft > 0) return;

    try {
      setLoading(true);
      const res = await post("/api/forgot-password", { email });

      if (res.success) {
        toast.success("Verification code resent successfully");
        setTimeLeft(300); // Reset timer
        setOtp(["", "", "", "", "", ""]);
      } else {
        toast.error(res.message || "Failed to resend verification code");
      }
    } catch (error) {
      toast.error("An error occurred while resending verification code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border border-indigo-100">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 p-5 rounded-full shadow-md">
            <Shield className="text-white w-8 h-8" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to
          <span className="font-medium block text-indigo-600 mt-1">
            {email || "your email"}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* OTP Input Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block pl-1">
              Verification Code
            </label>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-12 h-14 border-2 rounded-lg text-center text-xl font-bold text-gray-700 
                    ${errors.otp ? "border-red-500" : "border-indigo-200"} 
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm`}
                />
              ))}
            </div>
            {errors.otp && (
              <div className="flex items-center text-red-500 text-sm mt-1 pl-1">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {errors.otp}
              </div>
            )}

            <div className="flex items-center justify-center mt-3 text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {timeLeft > 0
                  ? `Expires in ${formatTime(timeLeft)}`
                  : "Code expired"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading || timeLeft > 0}
              className="text-indigo-600 hover:text-indigo-800 font-medium disabled:text-gray-400 text-sm flex items-center justify-center w-full mt-2"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${timeLeft > 0 ? "" : "animate-pulse"}`} />
              Resend verification code
            </button>
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block pl-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className={`w-full pl-12 py-3 border-2 ${
                  errors.password ? "border-red-500" : "border-indigo-100"
                } rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all`}
              />
              <div className="absolute left-3 top-3 bg-indigo-100 p-1 rounded">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center text-red-500 text-sm mt-1 pl-1">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 block pl-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm new password"
                className={`w-full pl-12 py-3 border-2 ${
                  errors.confirmPassword ? "border-red-500" : "border-indigo-100"
                } rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all`}
              />
              <div className="absolute left-3 top-3 bg-indigo-100 p-1 rounded">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center text-red-500 text-sm mt-1 pl-1">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-4 flex items-center justify-center transition-colors disabled:bg-indigo-300 shadow-md hover:shadow-lg mt-4"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Reset Password
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={goBack}
            className="flex items-center justify-center w-full text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reset Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpAndReset;