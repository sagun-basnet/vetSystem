import express from "express";
import {
  register,
  login,
  verifyOtp,
  registerDoctor,
  logout,
} from "../controller/auth.js";
import { checkAdmin, isAuth } from "../middleware/isAuth.js";

const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.post("/verify-otp", verifyOtp);

route.post("/add-doctor", registerDoctor);
route.post("/logout", logout);

export default route;
