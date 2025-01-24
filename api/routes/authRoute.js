import express from "express";
import { register, login, verifyOtp } from "../controller/auth.js";

const route = express.Router();

route.post("/register", register)
route.post("/login", login);
route.post("/verify-otp", verifyOtp);

export default route;
