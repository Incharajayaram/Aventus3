import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import router from "./routes/model.routes.js";
// import modelRoutes from "./routes/model.route.js"; // ✅ import

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/users", userRoutes);
app.use("/model", router); // ✅ register

export { app };
