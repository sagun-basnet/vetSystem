import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Fingerprint,
  Shield,
  AlertCircle,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }
    console.log(formData, "formData");

    try {
      setLoading(true);
      const res = await login(formData);
      console.log(res, "res");

      if (res.success === 1) {
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        toast.success("Login successful!");
        navigate("/");
      } else {
        setError(res.message || "Login failed");
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when user types
    if (error) setError("");
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col gap-6 max-w-sm md:max-w-md lg:max-w-lg w-full px-8 py-10 rounded-xl shadow-lg shadow-gray-300 bg-white">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Fingerprint size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-primary font-bold text-3xl">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to access your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block"
            >
              Email Address
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

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block"
            >
              Password
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
                placeholder="••••••••"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div>
              <Link
                to="/forget-password"
                className="text-primary text-sm font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary border border-primary text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary/90 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
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
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
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

        <div className="flex gap-1 items-center justify-center text-center mt-2">
          <span className="text-gray-600">New to Vet System?</span>
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline flex items-center gap-1"
          >
            <span>Join Now</span>
            <UserPlus size={16} />
          </Link>
        </div>

        <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1 mt-2">
          <Shield size={14} />
          <span>Your connection is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
