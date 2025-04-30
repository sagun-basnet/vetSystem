// controllers/chatController.js
import { db } from "../db/db.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

// Configure storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Upload image endpoint
export const uploadImage = (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });
};

// Send message endpoint (updated to handle images)
export const sendMessage = (req, res, io) => {
  const { senderId, receiverId, message, imageUrl } = req.body;

  if (!senderId || !receiverId || (!message && !imageUrl)) {
    return res
      .status(400)
      .json({ error: "Message content or image is required" });
  }

  db.query(
    "INSERT INTO messages (sender_id, receiver_id, message, image_url) VALUES (?, ?, ?, ?)",
    [senderId, receiverId, message || null, imageUrl || null],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to save message" });
      }

      db.query(
        "SELECT * FROM messages WHERE id = ?",
        [result.insertId],
        (err, newMessage) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch message" });
          }

          // Emit to receiver
          io.to(`user-${receiverId}`).emit("receiveMessage", newMessage[0]);

          // Also emit to sender for consistency
          io.to(`user-${senderId}`).emit("receiveMessage", {
            ...newMessage[0],
            isOwn: true,
          });

          res.json({
            success: true,
            message: newMessage[0],
          });
        }
      );
    }
  );
};

// Get messages endpoint (updated to include images)
export const getMessages = (req, res) => {
  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) {
    return res
      .status(400)
      .json({ error: "Both senderId and receiverId are required" });
  }

  db.query(
    `SELECT m.*, 
     CASE WHEN m.sender_id = ? THEN true ELSE false END as isOwn
     FROM messages m
     WHERE (m.sender_id = ? AND m.receiver_id = ?)
     OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.created_at ASC`,
    [senderId, senderId, receiverId, receiverId, senderId],
    (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to fetch messages" });
      }
      res.json(rows);
    }
  );
};

// Keep your existing getConversations function
export const getConversations = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  db.query(
    `
    SELECT 
      u.id,
      u.name,
      u.role_id,
      MAX(m.created_at) as last_message_time,
      SUM(CASE WHEN m.receiver_id = ? AND m.is_read = false THEN 1 ELSE 0 END) as unread_count
    FROM users u
    JOIN messages m ON (m.sender_id = u.id OR m.receiver_id = u.id)
    WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id != ?
    GROUP BY u.id
    ORDER BY last_message_time DESC
  `,
    [userId, userId, userId, userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};
