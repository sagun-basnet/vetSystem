import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/global/Navbar";
import "./app.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Topbar from "./components/admin/TopBar";
import AdminMain from "./pages/AdminMain";
import User from "./components/admin/User";

const App = () => {
    // User Layout with Navbar
    const Layout = () => {
        return (
            <>
                <Navbar />
                <Outlet />
            </>
        );
    };

    const AdminLayout = () => {
        return (
            <>
                <AdminMain />
            </>
        );
    };

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: <HomePage />,
                },
            ],
        },
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/signup",
            element: <SignupPage />,
        },
        {
            path: "/admin",
            element: <AdminLayout />,
            children: [
                {
                    path: "user",
                    element: <User />,
                },
            ],
        },
    ]);

    return (
        <div className="flex justify-center min-h-screen">
            <div className="App font-heading w-full max-w-[343px]  md:max-w-[704px] lg:max-w-[1240px] xl:max-w-[100%]">
                <RouterProvider router={router} />
            </div>
        </div>
    );
};

export default App;
