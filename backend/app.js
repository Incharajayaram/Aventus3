import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import router from "./routes/model.routes.js";
import askRouter from "./routes/ask.routes.js";
// import modelRoutes from "./routes/model.route.js"; // ✅ import

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/users", userRoutes);
app.use("/model", router); // ✅ register
app.use("/ask", askRouter )

export { app };
