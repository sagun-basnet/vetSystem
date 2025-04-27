import { createContext, useEffect, useState } from "react";
import { post } from "../utils/api";
import socket from "../components/admin/chat/socket";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await post("/api/login", inputs);
    setCurrentUser(res.others);
    console.log(res, "res");
    if (res.success === 0) return res; // If login fails, return the response
    socket.connect(); // Connect when user logs in
    socket.emit("join", res.others.id);

    return res;
  };

  const logout = async () => {
    localStorage.removeItem("user");
    await post("/api/logout");
    socket.disconnect();
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

// export { AuthContext, AuthContextProvider };
