const express = require("express");
const mysql = require("mysql");
const app = express();

const dbConnectionString =
  "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315331_07g_db";
const pool = new Pool({
  connectionString: dbConnectionString,
  ssl: {
    rejectUnauthorized: false, // Only use this for self-signed certificates
  },
});

app.get("/api/data", (req, res) => {
  const query = "SELECT * FROM inventory_items";
  pool.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results.rows);
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
