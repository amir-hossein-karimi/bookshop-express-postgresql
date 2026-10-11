const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM authors ORDER BY id");
  res.json(result.rows);
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

module.exports = router;
