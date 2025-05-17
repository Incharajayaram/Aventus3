import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/user.controller.js";
import verifyJwt from "../middleware/auth.middleware.js";
const userRoutes = express.Router();


userRoutes.route("/register").post(registerUser);
userRoutes.route("/login").post(loginUser);
userRoutes.route("/logout").post(verifyJwt, logoutUser);

export default userRoutes;
