import express from "express";
import {
  register,
  login,
  verifyOtp,
  registerDoctor,
  logout,
} from "../controller/auth.js";
import { checkAdmin, isAuth } from "../middleware/isAuth.js";
import upload from "../middleware/multerConfig.js";

const route = express.Router();

route.post("/register", upload.single("profile"), register);
route.post("/login", login);
route.post("/verify-otp", verifyOtp);

route.post("/add-doctor",upload.single("profile"), registerDoctor);
route.post("/logout", logout);

export default route;
