import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, LogOut, LogIn, UserPlus, Gauge } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /** simple active-link helper */
  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-black via-[#0b1d0b] to-black
                 border-b border-green-800 shadow-[0_2px_10px_#00ff8899]
                 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-green-400 hover:text-green-300"
        >
          <Gauge
            size={28}
            className="drop-shadow-[0_0_6px_#00ff8899] animate-spin-slow"
          />
          <span className="font-mono text-2xl font-extrabold tracking-wider drop-shadow-[0_0_6px_#00ff8899]">
            PromptArmour
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-lg font-mono">
          {!isLoggedIn ? (
            <div className="flex gap-6 ml-4">
              <Link
                to="/login"
                className={`inline-flex items-center gap-1 transition ${
                  isActive("/login")
                    ? "text-green-400 drop-shadow-[0_0_5px_#00ff88]"
                    : "text-green-300 hover:text-green-400 hover:drop-shadow-[0_0_4px_#00ff88]"
                }`}
              >
                <LogIn size={18} /> Login
              </Link>

              <Link
                to="/signup"
                className={`inline-flex items-center gap-1 transition ${
                  isActive("/signup")
                    ? "text-green-400 drop-shadow-[0_0_5px_#00ff88]"
                    : "text-green-300 hover:text-green-400 hover:drop-shadow-[0_0_4px_#00ff88]"
                }`}
              >
                <UserPlus size={18} /> Signup
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-red-300 hover:text-red-400 hover:drop-shadow-[0_0_4px_#ff4444] transition"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
