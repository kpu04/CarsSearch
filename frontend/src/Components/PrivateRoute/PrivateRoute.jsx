import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const userRole = sessionStorage.getItem("role");

  if (!allowedRoles.includes(userRole)) {
    alert("You don't have permission");

    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
