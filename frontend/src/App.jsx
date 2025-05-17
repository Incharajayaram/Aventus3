import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Intro from "./pages/Intro";
import DashboardPage from "./pages/DashboardPage";
import Layout from "./components/Layout";

const url = "http://localhost:8000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const location = useLocation();

  // Update login state on route change (covers logout)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Routes>
        {/* ----- Auth pages (no layout) ----- */}
        <Route path="/login" element={<Login url={url} />} />
        <Route path="/signup" element={<Signup url={url} />} />

        {/* ----- Routes wrapped by Layout ----- */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Intro />
            }
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <DashboardPage /> : <Navigate to="/" replace />
            }
          />
        </Route>

        {/* ----- Catch-all ----- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
