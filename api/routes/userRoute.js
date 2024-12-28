import express from "express";
import { isAuth, checkAdmin } from "../middleware/isAuth.js";
import { getUser, updateUser, deleteUser } from "../controller/user.js";

const route = express.Router();

route.post("/delete-user/:id", isAuth, checkAdmin, deleteUser);
route.post("/update-user/:id", isAuth, checkAdmin, updateUser);
route.get("/get-user", isAuth, checkAdmin, getUser);

export default route;
