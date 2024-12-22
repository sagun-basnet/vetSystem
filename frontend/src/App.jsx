import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/global/Navbar";
import "./app.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
const App = () => {
    const Layout = () => {
        return (
            <>
                <Navbar />
                <Outlet />
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
    ]);

    return (
        <div className="flex justify-center items-center">
            <div className="App font-heading max-w-[1240px] w-full">
                <RouterProvider router={router} />
            </div>
        </div>
    );
};

export default App;
