import { createContext, useEffect, useState } from "react";
import { post } from "../utils/api";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (inputs) => {
        const res = await post('/api/login', inputs);
        setCurrentUser(res.data);
    };

    const logout = async () => {
        localStorage.removeItem("user");
        await post('/api/logout');
        setCurrentUser(null);
    };

    useEffect(() => {
        // Only set the item in localStorage if currentUser is not null
        if (currentUser) {
            localStorage.setItem("user", JSON.stringify(currentUser));
        }
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };
