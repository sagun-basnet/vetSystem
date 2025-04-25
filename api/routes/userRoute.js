import express from "express";
import { isAuth, checkAdmin } from "../middleware/isAuth.js";
import {
  getUser,
  updateUser,
  deleteUser,
  singleUser,
  getDoctors,
  addUser,
  updateDoctor,
} from "../controller/user.js";

const route = express.Router();

route.post("/delete-user/:id", isAuth, checkAdmin, deleteUser);
route.post("/update-user/:id", isAuth, checkAdmin, updateUser);
route.post("/update-doctor/:id", isAuth, checkAdmin, updateDoctor);
route.get("/get-user", isAuth, checkAdmin, getUser);
route.get("/get-doctors", isAuth, getDoctors);
route.get("/get-single-user/:id", isAuth, checkAdmin, singleUser);
route.post("/add-user", isAuth, checkAdmin, addUser);

export default route;
