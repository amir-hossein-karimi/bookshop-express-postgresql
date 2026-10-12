import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running successfully");
});

app.use(express.json());

// routes here

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

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
