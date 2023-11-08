const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv").config();
const cors = require("cors");

// Create express app
const app = express();
const port = 4000;

app.use("/css", express.static("css"));
app.use("/js", express.static("functions"));
app.use(express.static("images"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.locals.capitalizeName = function (name, delimiter) {
  const words = name.split(delimiter);

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};

// Create pool
const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
  ssl: { rejectUnauthorized: false },
});

// Add process hook to shutdown pool
process.on("SIGINT", function () {
  pool.end();
  console.log("Application successfully shutdown");
  process.exit(0);
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const data = { name: "Mario" };
  res.render("index", data);
});

app.post("/post_name", cors(), async (req, res) => {
  let { name } = req.body;
  console.log(name);
});

app.get("/home", cors(), async (req, res) => {
  res.send("Connection between the webapp and frontend");
});

app.get("/user", (req, res) => {
  teammembers = [];
  pool.query("SELECT * FROM teammembers;").then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      teammembers.push(query_res.rows[i]);
    }
    const data = { teammembers: teammembers };
    console.log(teammembers);
    res.render("user", data);
  });
});

app.get("/drink_options", (req, res) => {
  drink_categories = [];
  pool.query("SELECT DISTINCT category FROM drinks;").then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      drink_categories.push(query_res.rows[i]);
    }
    const data = { drink_categories: drink_categories };
    console.log(drink_categories);
    res.render("drink_options", data);
  });
});

app.get("/add_drink", (req, res) => {
  drinks = [];
  category = req.query.category;
  const query = {
    text: "SELECT * FROM drinks WHERE category = $1",
    values: [category],
  };
  pool.query(query).then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      drinks.push(query_res.rows[i]);
    }
    const data = { drinks: drinks };
    console.log(drinks);
    res.render("add_drink", data);
  });
});

app.get("/add_on", (req, res) => {
  add_ons = [];
  pool.query("SELECT * FROM ingredients WHERE cost > 0;").then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      add_ons.push(query_res.rows[i]);
    }
    const data = { add_ons: add_ons };
    console.log(add_ons);
    res.render("add_on", data);
  });
});

app.get("/customer_home", (req, res) => {
  drink_categories = [];
  pool.query("SELECT DISTINCT category FROM drinks;").then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      drink_categories.push(query_res.rows[i]);
    }
    const data = { drink_categories: drink_categories };
    console.log(drink_categories);
    res.render("customer_home", data);
  });
});

app.get("/new_order", (req, res) => {
  res.render("new_order");
});

app.get("/order_summary", (req, res) => {
  res.render("order_summary");
});

app.get("/inventory", (req, res) => {
  //res.send("Connection for ingredients");

  pool.query("SELECT name FROM inventory_items;").then((query_res) => {
    inventory_name = [];
    for (let i = 0; i < query_res.rowCount; i++) {
      inventory_name.push(query_res.rows[i]);
    }
    console.log(inventory_name[0]);
    tempName = inventory_name[0];
    res.send(inventory_name);
  });
});

app.get("/drink_series", (req, res) => {
  drink_categories = [];
  pool.query("SELECT DISTINCT category FROM drinks;").then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      drink_categories.push(query_res.rows[i]);
    }
    console.log(drink_categories);
  });
  drinks = [];
  category = req.query.category;
  const query = {
    text: "SELECT * FROM drinks WHERE category = $1",
    values: [category],
  };
  pool.query(query).then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      drinks.push(query_res.rows[i]);
    }
    console.log(drinks);
    res.render("drink_series", {
      drink_categories: drink_categories,
      drinks: drinks,
    });
  });
});

app.get("/build_drink", (req, res) => {
  add_ons = [];
  pool.query("SELECT * FROM ingredients WHERE cost > 0;").then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      add_ons.push(query_res.rows[i]);
    }
    const data = { add_ons: add_ons };
    console.log(add_ons);
    res.render("build_drink", data);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
