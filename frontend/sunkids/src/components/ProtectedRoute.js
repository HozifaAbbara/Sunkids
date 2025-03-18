import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("access_token"); // Check if token exists

    return token ? <Outlet /> : <Navigate to="/login" />;
    // return <Outlet /> 
};

export default ProtectedRoute;
