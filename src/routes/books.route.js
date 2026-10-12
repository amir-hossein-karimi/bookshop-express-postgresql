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

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, author_id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "book's id is required" });
  }

  if (title === undefined && price === undefined && author_id === undefined) {
    return res
      .status(400)
      .json({ message: "title, price or author_id is required" });
  }

  const result = await pool.query(
    `UPDATE books
    SET title = COALESCE($1, title),
        price = COALESCE($2, price),
        author_id = COALESCE($3, author_id)
    WHERE id = $4
    RETURNING *`,
    [title, price, author_id, id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json(result.rows[0]);
});

module.exports = router;
