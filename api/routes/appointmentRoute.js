import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { bookAppointment, getAppointment, cancelAppointment, getAppointmentByUser } from "../controller/appointment.js";

const route = express.Router();

route.post("/book-appointment", isAuth, bookAppointment);
route.get("/get-appointment", isAuth, getAppointment);
route.get("/getAppointmentByUser/:id", isAuth, getAppointmentByUser);
route.post("/cancel-appointment/:id", isAuth, cancelAppointment);

export default route;
