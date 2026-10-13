import express from "express";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

import movieRouter from "./routes/movie.route.js";

dotenv.config();
connectDB();

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running successfully");
});

app.use(express.json());

app.use("/movies", movieRouter);

app.use((err, req, res, next) => {
  console.error(err);

  // Postgres errors have a 5-character code
  if (err.code === "22P02") {
    return res.status(400).json({ error: "Invalid input" }); // e.g. id = "abc"
  }

  if (err.code === "23503") {
    return res.status(400).json({ error: "Author does not exist" }); // foreign key violation
  }

  if (err.code === "23514") {
    return res
      .status(400)
      .json({ error: "Invalid value (check constraint failed)" }); // e.g. negative price
  }

  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection: ", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.log("uncaught exception: ", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
