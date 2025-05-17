import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";


const UserLogin = ({ url }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${url}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Remove credentials: "include"
        body: JSON.stringify({ email, password }),
      });      

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token); // assuming token is in data.token
        toast.success("Login successful! Redirecting...");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Error during login: " + err.message);
    }
      
      
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-black via-[#0b220b] to-black px-4">
      <motion.div
        className="bg-gradient-to-b from-[#0d1c0d] to-[#151515] p-8 rounded-2xl shadow-[0_0_25px_#00994499] w-full max-w-md border border-green-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-green-400 text-3xl font-bold mb-6 text-center font-mono tracking-wide">
          Welcome Back
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-green-400" size={20} />
            <input
              className="w-full p-3 pl-10 bg-[#162916] text-white rounded-lg outline-none focus:ring-2 focus:ring-green-400 placeholder-green-300"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-green-400" size={20} />
            <input
              className="w-full p-3 pl-10 bg-[#162916] text-white rounded-lg outline-none focus:ring-2 focus:ring-green-400 placeholder-green-300"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 font-semibold py-3 rounded-lg transition text-lg shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-green-300 text-center mt-4">
          New here?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default UserLogin;
