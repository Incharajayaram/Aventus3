import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardPage from "./pages/DashboardPage"
import ProtectedRoute from "../ProtectedRoute";
import IntroPage from "./pages/Intro"; // Make sure this file exists
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";

function App() {
  const url = "http://localhost:8000";
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/login" element={<Login url={url} />} />
        <Route path="/signup" element={<Signup url={url} />} />

        <Route element={<Layout />}>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <IntroPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Add more protected/public layout-wrapped routes here */}
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Login url={url} />} />
      </Routes>
    </>
  );
}

export default App;
