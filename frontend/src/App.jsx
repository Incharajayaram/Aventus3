import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "../ProtectedRoute";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const url = "http://localhost:8000";

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/login" element={<Login url={url} />} />
        <Route path="/signup" element={<Signup url={url} />} />
        <Route path="/dashboard" element={<DashboardPage/>} />

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
