import express from "express";
import { register, login, verifyOtp, registerDoctor } from "../controller/auth.js";
import { checkAdmin, isAuth } from "../middleware/isAuth.js";

const route = express.Router();

route.post("/register", register)
route.post("/login", login);
route.post("/verify-otp", verifyOtp);

route.post("/add-doctor", isAuth, checkAdmin, registerDoctor); 

export default route;
