import { db } from "../db/db.js";

export const sendMessage = (req, res, io) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
    [senderId, receiverId, message],
    (err, result) => {
      if (err) return res.status(500).json(err);

      db.query(
        "SELECT * FROM messages WHERE id = ?",
        [result.insertId],
        (err, newMessage) => {
          if (err) return res.status(500).json(err);

          // Emit only to receiver
          io.to(`user-${receiverId}`).emit("receiveMessage", newMessage[0]);

          res.json({
            success: true,
            message: newMessage[0],
            isOwn: true,
          });
        }
      );
    }
  );
};

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
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};

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
