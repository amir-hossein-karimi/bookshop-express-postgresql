require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("test");

app.get("/", (req, res) => {
  res.send("server is running successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
