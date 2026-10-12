const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM authors ORDER BY id");
  res.json(result.rows);
});

router.get("/:id/books", async (req, res) => {
  const authorId = req.params.id;

  if (!authorId) {
    return res.status(400).json({ message: "author id is required" });
  }

  const result = await pool.query(
    `SELECT books.id, books.title, books.price, authors.name AS author
     FROM books
     JOIN authors ON authors.id = books.author_id
     WHERE books.author_id = $1
     ORDER BY books.id`,
    [authorId],
  );

  console.log({ rows: result.rows });

  res.status(200).json(result.rows);
});

router.post("/", async (req, res) => {
  const { name, country } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "name is required",
    });
  }

  const result = await pool.query(
    "INSERT INTO authors (name, country) VALUES ($1, $2) RETURNING *",
    [name, country],
  );

  console.log({ result });

  res.status(201).json(result.rows[0]);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "author id is required" });
  }

  const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Author not found" });
  }

  res.status(200).json(result.rows[0]);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, country } = req.body;

  if (!id) {
    return res.status(400).json({ message: "author id is required" });
  }

  if (!name && !country) {
    return res.status(400).json({ message: "name or country is required" });
  }

  const result = await pool.query(
    `UPDATE authors
        SET name = COALESCE($1, name),
            country = COALESCE($2, country)
        WHERE id = $3
        RETURNING *`,
    [name, country, id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Author not found" });
  }

  res.json(result.rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "author id is required" });
  }

  const result = await pool.query("DELETE FROM authors WHERE id = $1", [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "author is not found" });
  }

  res.status(204).end();
});

module.exports = router;
