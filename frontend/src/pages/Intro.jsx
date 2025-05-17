import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Cpu, Zap } from "lucide-react";

const cards = [
  {
    icon: <ShieldCheck size={32} />,
    title: "Real-time Guard",
    text: "Blocks jailbreak prompts the instant they’re typed.",
    style: { top: 30, left: 30 },
  },
  {
    icon: <FileText size={32} />,
    title: "Doc Scan",
    text: "PDF, DOCX & PPTX parsing with hidden-note checks.",
    style: { top: 30, right: 30 },
  },
  {
    icon: <Cpu size={32} />,
    title: "Hybrid Engine",
    text: "Heuristics + ML flag novel exploits accurately.",
    style: { bottom: 30, left: 30 },
  },
  {
    icon: <Zap size={32} />,
    title: "Multi-Model",
    text: "GPT · Claude · Llama · Qwen · Granite.",
    style: { bottom: 30, right: 30 },
  },
];

const Intro = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Update offset on mouse move - normalize around center [-1 to 1]
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
    const y = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
    setOffset({ x, y });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate background position shift (smaller movement for subtle effect)
  const bgPosX = 50 + offset.x * 5; // percentage (center 50%)
  const bgPosY = 50 + offset.y * 5;

  return (
    <div
      className="relative h-screen flex items-center justify-center overflow-hidden px-8"
      style={{
        backgroundColor: "black",
        backgroundImage:
          "linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        transition: "background-position 0.1s ease-out",
      }}
    >
      {/* Center content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative flex flex-col items-center text-center z-20 max-w-xl px-6"
      >
        <div className="flex items-center justify-center w-36 h-36 rounded-full bg-[#162916] border border-green-700/50 shadow-[0_0_50px_#00ff8877] mb-8">
          <ShieldCheck size={72} className="text-green-400 drop-shadow-lg" />
        </div>

        <h1 className="text-6xl font-extrabold font-mono text-green-400 drop-shadow-[0_0_25px_#00cc5599] mb-4">
          PromptShield
        </h1>
        <p className="text-lg text-green-200 leading-relaxed">
          Detects and neutralises prompt-injection attacks in chats and uploaded
          documents — before they ever reach your LLM.
        </p>
      </motion.div>

      {/* Feature cards */}
      {cards.map(({ icon, title, text, style }) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute w-64 p-5 rounded-2xl bg-[#0d1c0d]/90 backdrop-blur-md border border-green-700/40 shadow-[0_0_25px_#00994455] text-green-200 cursor-default hover:shadow-[0_0_40px_#00ff88] transition-shadow"
          style={style}
        >
          <div className="flex items-center gap-3 text-green-400 font-semibold mb-2">
            {icon} <span className="text-xl">{title}</span>
          </div>
          <p className="text-sm leading-snug font-mono">{text}</p>
        </motion.div>
      ))}

      <span className="absolute bottom-8 text-green-300 animate-bounce select-none z-30 text-xl font-mono">
        ↓ Scroll
      </span>
    </div>
  );
};

export default Intro;
