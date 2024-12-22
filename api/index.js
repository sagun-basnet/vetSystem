import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";

const app = express();

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

app.use("/api", authRoute);
app.use("/api", postRoute);
app.listen(port, host, () => {
  console.log(`Server is running on port ${port}`);
});
