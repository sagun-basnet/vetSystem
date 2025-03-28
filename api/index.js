import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import formRoutes from "./routes/formRoute.js";
import chatRoute from "./routes/chatRoute.js";

import { createServer } from "http";
import { Server } from "socket.io";
import {
  getAllNotifications,
  sendNotification,
} from "./controller/notification.js";
import { db } from "./db/db.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const port = process.env.PORT;

// WebSocket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle user joining their room
  socket.on("join", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room user-${userId}`);
  });

  // Handle sending messages
  socket.on("sendMessage", (data, callback) => {
    console.log("Received sendMessage event:", data);
    const { senderId, receiverId, message } = data;

    if (!senderId || !receiverId || !message) {
      console.log("Invalid message data:", data);
      return callback({ error: "Invalid message data" });
    }

    // Insert message into MySQL
    db.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [senderId, receiverId, message],
      (err, result) => {
        if (err) {
          console.log("Error saving message:", err);
          return callback({ error: "Database error" });
        }

        db.query(
          "SELECT * FROM messages WHERE id = ?",
          [result.insertId],
          (err, rows) => {
            if (err) {
              console.log("Error fetching new message:", err);
              return callback({ error: "Database error" });
            }

            const savedMessage = {
              ...rows[0],
              isOwn: rows[0].sender_id === senderId,
            };

            console.log("Message saved:", savedMessage);

            // Emit to receiver
            io.to(`user-${receiverId}`).emit("receiveMessage", savedMessage);

            // Acknowledge sender
            callback({
              success: true,
              message: savedMessage,
            });
          }
        );
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.get("/notifications", getAllNotifications);
app.post("/send-notification", (req, res) => sendNotification(req, res, io));

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", adminRoute);
app.use("/api", postRoute);
app.use("/api", appointmentRoute);
app.use("/api", formRoutes);
app.use("/api/chat", chatRoute);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
