import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-black via-[#0b220b] to-black px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="bg-gradient-to-b from-[#0d1c0d] to-[#151515] p-8 rounded-2xl shadow-[0_0_25px_#00994499] w-full max-w-md border border-green-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-green-400 text-3xl font-bold mb-6 text-center font-mono tracking-wide">
          Create an Account
        </h2>
        <form className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 text-green-400" size={20} />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 pl-10 bg-[#162916] text-white rounded-lg outline-none focus:ring-2 focus:ring-green-400 placeholder-green-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-green-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 pl-10 bg-[#162916] text-white rounded-lg outline-none focus:ring-2 focus:ring-green-400 placeholder-green-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-green-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 bg-[#162916] text-white rounded-lg outline-none focus:ring-2 focus:ring-green-400 placeholder-green-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 font-semibold py-3 rounded-lg transition text-lg shadow-md"
          >
            Sign Up
          </button>
        </form>
        <p className="text-green-300 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
