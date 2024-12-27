import express from "express";
import { isAuth, checkAdmin } from "../middleware/isAuth.js";
import { deleteDoctor, updateDoctor, getDoctors } from "../controller/admin.js";

const route = express.Router();

route.post("/delete-doctor/:id", isAuth, checkAdmin, deleteDoctor);
route.post("/update-doctor/:id", isAuth, checkAdmin, updateDoctor);
route.get("/get-doctors", isAuth, checkAdmin, getDoctors);

export default route;
