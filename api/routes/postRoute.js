import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
  updatePost,
  getSinglePost,
} from "../controller/post.js";
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
route.post(
  "/update-post/:id",
  isAuth,
  checkAdmin,
  upload.single("image"),
  updatePost
);
route.get("/get-posts", getPosts);
route.get("/get-single-post/:id", getSinglePost);
route.post("/delete-post/:id", isAuth, checkAdmin, deletePost);

export default route;
