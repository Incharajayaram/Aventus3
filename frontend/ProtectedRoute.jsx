import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if user token exists in localStorage
  const token = localStorage.getItem("token");

  // If no token found, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child routes/components
  return <Outlet />;
};

export default ProtectedRoute;
