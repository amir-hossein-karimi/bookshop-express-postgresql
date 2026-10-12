const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `SELECT books.id, books.title, books.price, authors.name AS author
     FROM books
     JOIN authors ON authors.id = books.author_id
     ORDER BY books.id
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );

  res.status(200).json(result.rows);
});

router.post("/", async (req, res) => {
  const { title, price, author_id } = req.body;

  if (!title || price === undefined || !author_id) {
    return res
      .status(400)
      .json({ message: "title, price and author_id are required" });
  }

  const result = await pool.query(
    "INSERT INTO books (title, price, author_id) VALUES ($1, $2, $3) RETURNING *",
    [title, price, author_id],
  );

  res.status(201).json(result.rows[0]);
});

module.exports = router;
