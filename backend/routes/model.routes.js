import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text input required" });
  }

  try {
    // Forward to Flask
    const flaskRes = await axios.post("http://localhost:5000/analyze", { text });
    return res.json(flaskRes.data); // Send Flask's response to the client
  } catch (err) {
    console.error("Flask error:", err.message);
    return res.status(500).json({ error: "Flask model service error" });
  }
});

export default router;
