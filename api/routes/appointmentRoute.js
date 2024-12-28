import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { bookAppointment, getAppointment } from "../controller/appointment.js";

const route = express.Router();

route.post("/book-appointment", isAuth, bookAppointment);
route.get("/get-appointment", isAuth, getAppointment);

export default route;
