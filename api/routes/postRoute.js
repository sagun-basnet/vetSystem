import express from "express";
import { createPost } from "../controller/post.js";
import upload from "../middleware/multerConfig.js";

const route = express.Router();

route.post("/create-post", upload.single("image"), createPost);

export default route;