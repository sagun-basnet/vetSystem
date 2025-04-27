import { useState } from "react";
import { post } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Phone,
  Eye,
  EyeOff,
  Camera,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

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
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, address, phone } = formData;

    if (!name || !email || !password || !address || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    if (passwordStrength < 2) {
      toast.error("Please use a stronger password");
      return;
    }

    // Prepare FormData for file upload
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword") {
        payload.append(key, value);
      }
    });
    if (profilePic) {
      payload.append("profile", profilePic);
    }

    try {
      setLoading(true);
      const res = await post("/api/register", payload, true);

      if (res.message === "OTP sent to your email for verification.") {
        toast.success("Check your email for OTP verification code");
        navigate(`/verify-otp?email=${email}`);
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check password strength if password field is modified
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (!formData.password) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Medium";
    if (passwordStrength === 3) return "Strong";
    if (passwordStrength === 4) return "Very Strong";
    return "";
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-50 py-8">
      <div className="flex flex-col gap-6 max-w-sm md:max-w-md lg:max-w-lg w-full px-8 py-7 rounded-xl shadow-lg shadow-gray-300 bg-white">
        <div className="text-center">
          <h1 className="text-primary font-bold text-3xl">Create Account</h1>
          <p className="text-gray-500 mt-2">
            Join us today and start your journey
          </p>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex justify-center flex-col items-center gap-2 mb-2">
          <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 overflow-hidden group">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-gray-400" />
            )}
            <label
              htmlFor="profile"
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all"
            >
              <Camera size={28} className="text-white" />
            </label>
            <input
              type="file"
              name="profile"
              accept="image/*"
              onChange={handleFileChange}
              id="profile"
              className="hidden"
            />
          </div>
          <span className="font-bold">Upload profile picture</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                id="name"
                placeholder="John Doe"
                className="w-full pl-10 outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                id="email"
                placeholder="your.email@example.com"
                className="w-full pl-10 outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Address */}
          <div className="relative">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                id="address"
                placeholder="street, City, Country"
                className="w-full pl-10 outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="relative">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                id="phone"
                placeholder="9812345678"
                className="w-full pl-10 outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                id="password"
                placeholder="Create a strong password"
                className="w-full pl-10 pr-10 outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </button>
            </div>

            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength * 25}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-500 flex justify-between">
                  <span>Password strength:</span>
                  <span
                    className={
                      passwordStrength >= 2 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {getPasswordStrengthText()}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                id="confirmPassword"
                placeholder="Confirm your password"
                className="w-full pl-10 pr-10 outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </button>
            </div>
            {formData.password && formData.confirmPassword && (
              <p
                className={`text-xs mt-1 ${
                  formData.password === formData.confirmPassword
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formData.password === formData.confirmPassword ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} />
                    Passwords match
                  </span>
                ) : (
                  "Passwords don't match"
                )}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary font-medium hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-primary font-medium hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !agreeToTerms}
            className={`w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all ${
              loading || !agreeToTerms ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-2 py-2">
          <div className="h-px flex-1 bg-gray-200"></div>
          <p className="text-sm text-gray-400">OR</p>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 border border-gray-300 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium">Google</span>
          </button>
          <button className="flex-1 border border-gray-300 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#1877F2"
            >
              <path d="M24 12.073c0-5.8-4.698-10.5-10.497-10.5s-10.5 4.7-10.5 10.5c0 5.237 3.84 9.598 8.87 10.381v-7.334H8.31v-3.047h3.562V9.748c0-3.52 2.097-5.464 5.3-5.464 1.537 0 3.142.276 3.142.276v3.458h-1.77c-1.743 0-2.287 1.08-2.287 2.19v2.627h3.89l-.624 3.047h-3.266v7.334C20.159 21.67 24 17.31 24 12.073z" />
            </svg>
            <span className="text-sm font-medium">Facebook</span>
          </button>
        </div>

        <div className="flex gap-2 items-center justify-center mt-2">
          <span className="text-gray-600">Already have an account?</span>
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
