import express from "express";
import { createPost } from "../controller/post.js";
import upload from "../middleware/multerConfig.js";
import { isAuth, checkAdmin } from "../middleware/isAuth.js";

const route = express.Router();

route.post(
  "/create-post",
  isAuth,
  checkAdmin,
  upload.single("image"),
  createPost
);

export default route;
