import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // Don't forget to install this package if you haven't already

const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem("token");

  // Check if the token exists and is valid
  if (!token) {
    // Redirect to the sign-in page if the user is not logged in
    return <Navigate to="/signin" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      // Token is expired, clear local storage and redirect to sign-in
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("groupid");
      localStorage.removeItem("assessment");
      localStorage.removeItem("therapists");
      localStorage.removeItem("therapistsData");
      return <Navigate to="/signin" />;
    }
  } catch (error) {
    console.error("Error decoding JWT:", error);
    // Redirect to the sign-in page if the token is invalid
    return <Navigate to="/signin" />;
  }

  // Render the component if the user is authenticated
  return <Component {...rest} />;
};

export default PrivateRoute;
