import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-[#0e1a0e] text-green-300 text-center py-5 border-t border-green-700 font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-sm">
        © {new Date().getFullYear()} PromptShield. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;
