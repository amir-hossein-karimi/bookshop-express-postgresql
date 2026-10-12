const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query(
    `SELECT books.id, books.title, books.price, authors.name AS author
     FROM books
     JOIN authors ON authors.id = books.author_id
     ORDER BY books.id`,
  );

  res.status(200).json(result.rows);
});

module.exports = router;
