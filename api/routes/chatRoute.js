// routes/chatRoutes.js
import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
  uploadImage,
} from "../controller/chat.js";

const router = express.Router();

// Add the upload route
router.post("/upload", uploadImage);

// Existing routes
router.post("/send-message", (req, res) => {
  sendMessage(req, res, req.app.get("io"));
});

router.get("/get-messages", getMessages);
router.get("/conversations/:userId", getConversations);

export default router;
