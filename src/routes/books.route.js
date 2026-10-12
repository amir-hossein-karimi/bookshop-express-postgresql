const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM books");

  res.status(200).json(result.rows);
});

module.exports = router;
