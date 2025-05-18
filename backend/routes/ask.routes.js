// askRouter.js
import express from "express";
import axios from "axios";

const askRouter = express.Router();

askRouter.post("/ask", async (req, res) => {
  const { prompt, stream = false } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    if (stream) {
      // Stream response from Flask directly to client
      const flaskStream = await axios.post(
        "http://localhost:5000/ask",
        { prompt, stream: true },
        { responseType: "stream" }
      );

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      // Optionally set other headers like Cache-Control, etc.

      flaskStream.data.pipe(res);
    } else {
      // Normal JSON response from Flask
      const flaskRes = await axios.post("http://localhost:5000/ask", {
        prompt,
        stream: false,
      });
      res.json(flaskRes.data);
    }
  } catch (err) {
    console.error("Flask /ask error:", err.message);
    res.status(502).json({ error: "Upstream Flask service error" });
  }
});

export default askRouter;
