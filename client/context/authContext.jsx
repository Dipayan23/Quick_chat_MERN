import React from "react";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if the user is authenticated or not
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/auth/check-auth");
      setAuthUser(data.user);
      connectSocket(data.user);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // Login function to handle user authentication
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/auth/${state}`, credentials);
      
      setAuthUser(data.userData);
      connectSocket(data.userData);
      axios.defaults.headers.common["token"] = data.token;
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout function for user logout and socket disconnection

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logout Successfully");
    socket.disconnect();
  };

  // Update profile function to handle user profile update

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/auth/update-profile", body);
      setAuthUser(data.user);
      toast.success("Profile update Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Connect socket function
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIDs) => {
      setOnlineUsers(userIDs);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
