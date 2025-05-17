import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, LogIn, UserPlus, Gauge } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <motion.header
      className="bg-gradient-to-r from-black via-[#0b1d0b] to-black shadow-[0_2px_10px_#00ff8899] border-b border-green-800"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Aesthetic glowing icon */}
        <div className="text-green-400 hover:text-green-300 transition duration-300">
          <Gauge size={28} className="drop-shadow-[0_0_6px_#00ff8899]" />
        </div>

        {/* Nav Links */}
        <nav className="space-x-6 text-green-300 text-lg font-medium">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 hover:text-green-400 hover:drop-shadow-[0_0_4px_#00ff88] transition"
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1 hover:text-green-400 hover:drop-shadow-[0_0_4px_#00ff88] transition"
              >
                <UserPlus size={18} />
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-red-300 hover:text-red-400 hover:drop-shadow-[0_0_4px_#ff4444] transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
