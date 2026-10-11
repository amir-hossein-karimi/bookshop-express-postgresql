require("dotenv").config();
const express = require("express");

const authorsRoute = require("./routes/authors.route");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running successfully");
});

app.use(express.json());

app.use("/authors", authorsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
