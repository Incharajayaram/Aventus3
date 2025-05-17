import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Intro from "./pages/Intro";
import DashboardPage from "./pages/DashboardPage";



function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* /dashboard now renders the two-section page */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* …protected routes if needed … */}
      <Route element={<ProtectedRoute />}>{/* more */}</Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
}
export default App;
