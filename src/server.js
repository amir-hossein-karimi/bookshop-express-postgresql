require("dotenv").config();
const express = require("express");

const authorsRoute = require("./routes/authors.route");
const booksRoute = require("./routes/books.route");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running successfully");
});

app.use(express.json());

app.use("/authors", authorsRoute);
app.use("/books", booksRoute);

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
