import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import formRoutes from "./routes/formRoute.js";

import { createServer } from "http";
import { Server } from "socket.io";
import {
  getAllNotifications,
  sendNotification,
} from "./controller/notification.js";
import { db } from "./db/db.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const port = process.env.PORT;
// const host = process.env.HOST;

// WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send previous notifications when a user connects
  db.query(
    "SELECT * FROM notification ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        return console.log(err);
      }

      socket.emit("previous-notifications", rows);
      // console.log(rows, ":Main file log");
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/notifications", getAllNotifications);
app.post("/send-notification", (req, res) => sendNotification(req, res, io));

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", adminRoute);
app.use("/api", postRoute);
app.use("/api", appointmentRoute);
app.use("/api", formRoutes);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
