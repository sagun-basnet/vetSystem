import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
  bookAppointment,
  getAppointment,
  cancelAppointment,
  getAppointmentByUser,
  getAppointmentByDoctor,
  getSingleAppointment,
} from "../controller/appointment.js";

const route = express.Router();

route.post("/book-appointment", isAuth, bookAppointment);
route.get("/get-appointment", isAuth, getAppointment);
route.get("/get-appointment/:id", isAuth, getSingleAppointment);
route.get("/getAppointmentByUser/:id", isAuth, getAppointmentByUser);
route.get("/getAppointmentByDoctor/:id", isAuth, getAppointmentByDoctor);
route.post("/cancel-appointment/:id", isAuth, cancelAppointment);

export default route;
