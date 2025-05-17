import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        
        {/* add more protected routes here */}
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Login/>} />
    </Routes>
  );
}

export default App;
