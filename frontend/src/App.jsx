import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Intro from "./pages/Intro";
import DashboardPage from "./pages/DashboardPage";


import ProtectedRoute from "../ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  const url = "http://localhost:8000";

  return (
    <>
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    <Routes>
      <Route path="/login" element={<Login url={url} />} />
      <Route path="/signup" element={<Signup url={url} />} />

      {/* /dashboard now renders the two-section page */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* …protected routes if needed … */}
      <Route element={<ProtectedRoute />}>{/* more */}</Route>

      <Route path="*" element={<Login />} />
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Add your protected routes here */}
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Login url={url} />} />
    </Routes>
    </>
  );
}
export default App;
