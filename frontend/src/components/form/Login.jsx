import { useContext, useState } from "react";
// import { post } from "../../utils/api";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            alert("Please fill in all fields");
            return;
        }

        const res = await login(formData);
        // const res = post("/api/login", formData);
        console.log(res);

        alert(`Login Sucessfully. Email: ${formData.email}, Password: ${formData.password}`);
        navigate('/')
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    return (
        <div className="flex flex-col gap-5 items-center justify-center min-h-screen">
            <div className="flex flex-col gap-6 max-w-sm md:max-w-md lg:max-w-lg w-full px-8 py-10 rounded-lg shadow-lg shadow-gray-300 bg-white text-sm">
                <h1 className="text-primary font-semibold text-3xl text-center">
                    Sign In
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="email"
                            className="text-sm text-gray-700 pl-1"

                        >
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

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="password"
                            className=" text-sm text-gray-700 pl-1"

                        >
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

                    <div className="text-right">
                        <span className="text-primary font-medium text-sm hover:underline cursor-pointer">
                            Forgot Password?
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary border-2 border-primary text-white py-3 text-[15px] rounded-sm font-semibold transition-all duration-500 ease-in-out hover:bg-white hover:text-primary"
                    >
                        Sign In
                    </button>
                </form>
                <div className="flex gap-3 text-primary items-center justify-between">
                    <span className="text-sm">New to Vet System?</span>
                    <span className="font-semibold text-sm">Join Now</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
