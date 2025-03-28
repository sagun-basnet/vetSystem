import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controller/chat.js";

const router = express.Router();

router.post("/send-message", (req, res) => {
  const io = req.app.get("io");
  sendMessage(req, res, io);
});
router.get("/get-messages", getMessages);
router.get("/conversations/:userId", getConversations);

export default router;
