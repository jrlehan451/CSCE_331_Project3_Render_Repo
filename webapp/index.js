const express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const { Pool } = require("pg");
const dotenv = require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const { Translate } = require("@google-cloud/translate").v2;

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("./swaggerDefinition");

// Create express app
const app = express();
const port = 4000;

const options = {
  swaggerDefinition,
  apis: ["./index.js"], // Adjust the path based on your project structure
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const CREDS = JSON.parse(process.env.GOOGLE_APPLICATION_CRED);
const translate = new Translate({
  credentials: CREDS,
  projectId: CREDS.projectId,
});

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

/**
 * @swagger
 * languages:
 *   get:
 *     summary: gets the available langauges for translation
 *     description: determine what langauges are translation options
 *     responses:
 *       200:
 *         description: list of languages available of translation
 */
app.get("/languages", async (req, res) => {
  let [languages] = await translate.getLanguages();
  res.status(200).json({
    status: "success",
    data: languages,
  });
});

/**
 * @swagger
 * translate:
 *   get:
 *     summary: translates text into the selected langauage
 *     description: translates all the text on the web application into the language selected by the user
 *     responses:
 *       200:
 *         description: translated text
 */
app.get("/translate", jsonParser, async (req, res) => {
  try {
    let [translations] = await translate.translate(
      req.query.text,
      req.query.target
    );
    res.status(200).json({
      status: "success",
      data: translations,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

app.set("view engine", "ejs");

/**
 * @swagger
 * employeeInfo:
 *   get:
 *     summary: gets information about all the employees
 *     description: get employee first name, last name, password, and role
 *     responses:
 *       200:
 *         description: list of employees and all their attributes
 */
app.get("/", (req, res) => {
  employees = [];
  pool.query("SELECT * FROM employees;").then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      employees.push(query_res.rows[i]);
    }
    const data = { employees: employees };
    console.log(employees);
    res.render("index", data);
  });
});

/**
 * @swagger
 * login_jsx:
 *   get:
 *     summary: gets information about all the employees
 *     description: get employee first name, last name, password, and role
 *     responses:
 *       200:
 *         description: list of employees and all their attributes
 */
app.get("/login_jsx", async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM employees;");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        employees: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

app.get("/manager_mains", (req, res) => {
  const data = { name: "Mario" };
  res.render("manager_main", data);
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

/**
 * @swagger
 * add_on_jsx:
 *   get:
 *     summary: gets all add_ons
 *     description: queries all ingredients with a cost greater than 0
 *     responses:
 *       200:
 *         description: list ingredients with a cost associated to them
 */
app.get("/add_on_jsx", async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM ingredients WHERE cost > 0;"
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        add_ons: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * add_drink_jsx:
 *   get:
 *     summary: gets all drinks for a particular category
 *     description: selects all drinks from database based on the selected drink series
 *     responses:
 *       200:
 *         description: list of drinks within the selected series
 */
app.get("/add_drink_jsx", async (req, res) => {
  category = req.query.category;
  const query = {
    text: "SELECT * FROM drinks WHERE category = $1",
    values: [category],
  };
  try {
    const results = await pool.query(query);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        drinks: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * drink_options_jsx:
 *   get:
 *     summary: gets distinct categories of drinks
 *     description: selects all the categories of drinks on the menu
 *     responses:
 *       200:
 *         description: list of all categories of drinks
 */
app.get("/drink_options_jsx", async (req, res) => {
  try {
    const results = await pool.query("SELECT DISTINCT category FROM drinks;");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        drink_categories: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
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

/**
 * @swagger
 * drink_categories:
 *   get:
 *     summary: gets distinct categories of drinks
 *     description: selects all the categories of drinks on the menu
 *     responses:
 *       200:
 *         description: list of all categories of drinks
 */
app.get("/drink_categories", async (req, res) => {
  try {
    console.log("Getting all the drink categories");

    const results = await pool.query("SELECT DISTINCT category FROM drinks;");
    res.status(200).json({
      status: "success",
      results: results.rows,
      data: { results },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * drink_series_items:
 *   get:
 *     summary: gets distinct categories of drinks and all the drinks from the user selected category
 *     description: selects all the categories of drinks on the menu and all the drinks from the current drink series page category
 *     responses:
 *       200:
 *         description: list of all categories of drinks and all drinks in selected category
 */
app.get("/drink_series_items", async (req, res) => {
  try {
    category = req.query.category;
    console.log(category);
    const drinkCategoriesQuery = await pool.query(
      "SELECT DISTINCT category FROM drinks;"
    );
    const drinksQuery = await pool.query(
      "SELECT * FROM drinks WHERE category = $1",
      [category]
    );

    res.status(200).json({
      status: "success",

      data: {
        categories: drinkCategoriesQuery.rows,
        drinks: drinksQuery.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching drink series:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/add_ons", async (req, res) => {
  try {
    console.log("Getting all the add ons");

    const results = await pool.query(
      "SELECT * FROM ingredients WHERE cost > 0;"
    );
    res.status(200).json({
      status: "success",
      results: results.rows,
      data: { results },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

app.get("/new_order", (req, res) => {
  res.render("new_order");
});

app.get("/order_summary", (req, res) => {
  res.render("order_summary");
});

/**
 * @swagger
 * post_order:
 *   post:
 *     summary: saves the created order on the casheir's side to the database
 *     description: enters all the drinks and associated add-ons as a single order into the database
 *     responses:
 *       200:
 *         description: adds an order to the database
 */
app.post("/post_order", jsonParser, (req, res) => {
  console.log(req.body);

  var nextOrderId = 0;

  drinks = JSON.parse(req.body.drinks);
  add_ons = JSON.parse(req.body.add_ons);

  pool
    .query("SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1;")
    .then((query_res) => {
      nextOrderId = query_res.rows[0].order_id + 1;

      pool.query(
        "INSERT INTO orders(order_id, name, timestamp, cost) VALUES($1, $2, $3, $4)",
        [
          nextOrderId,
          req.body.customer,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          req.body.totalCost,
        ],
        (err, response) => {
          if (err) {
            console.log(err);
          }
        }
      );

      for (let i = 0; i < drinks.length; ++i) {
        pool.query(
          "INSERT INTO drink_orders(drink_id, order_id, number) VALUES($1, $2, $3)",
          [parseInt(drinks[i].id), nextOrderId, i + 1],
          (err, response) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }

      for (let i = 0; i < add_ons.length; ++i) {
        for (let j = 0; j < add_ons[i].length; ++j) {
          pool.query(
            "INSERT INTO add_ons(ingredient_id, order_id, number) VALUES($1, $2, $3)",
            [parseInt(add_ons[i][j].id), nextOrderId, i + 1],
            (err, response) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      }
    });

  res.json({ ok: true });
});

/**
 * @swagger
 * post_customer_order:
 *   post:
 *     summary: saves the created order on the customer's side to the database
 *     description: enters all the drinks and associated add-ons as a single order into the database
 *     responses:
 *       200:
 *         description: adds an order to the database
 */
app.post("/post_customer_order", jsonParser, (req, res) => {
  console.log(req.body);

  var nextOrderId = 0;

  currDrinksInOrder = JSON.parse(req.body.currDrinksInOrder);

  pool
    .query("SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1;")
    .then((query_res) => {
      nextOrderId = query_res.rows[0].order_id + 1;

      pool.query(
        "INSERT INTO orders(order_id, name, timestamp, cost) VALUES($1, $2, $3, $4)",
        [
          nextOrderId,
          req.body.customer,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          req.body.totalCost,
        ],
        (err, response) => {
          if (err) {
            console.log(err);
          }
        }
      );

      for (let i = 0; i < currDrinksInOrder.length; ++i) {
        for (let j = 0; j < currDrinksInOrder[i].quantity; ++j) {
          pool.query(
            "INSERT INTO drink_orders(drink_id, order_id, number) VALUES($1, $2, $3)",
            [parseInt(currDrinksInOrder[i].drinkId), nextOrderId, i + 1],
            (err, response) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      }

      for (let i = 0; i < currDrinksInOrder.length; ++i) {
        for (let j = 0; j < currDrinksInOrder[i].quantity; ++j) {
          pool.query(
            "INSERT INTO add_ons(ingredient_id, order_id, number) VALUES($1, $2, $3)",
            [parseInt(currDrinksInOrder[i].addOn1Id), nextOrderId, i + 1],
            (err, response) => {
              if (err) {
                console.log(err);
              }
            }
          );
          pool.query(
            "INSERT INTO add_ons(ingredient_id, order_id, number) VALUES($1, $2, $3)",
            [parseInt(currDrinksInOrder[i].addOn2Id), nextOrderId, i + 1],
            (err, response) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      }
    });

  res.json({ ok: true });
});

app.get("/drink_series", (req, res) => {
  drink_categories = [];
  pool.query("SELECT DISTINCT category FROM drinks;").then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      drink_categories.push(query_res.rows[i]);
    }
    console.log(drink_categories);
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

app.get("/view_cart", (req, res) => {
  res.render("view_cart");
});

app.get("/customer_checkout", (req, res) => {
  res.render("customer_checkout");
});

app.get("/menu", (req, res) => {
  const drinksByCategory = {};

  pool.query("SELECT * FROM drinks;").then((query_res) => {
    const drinks = query_res.rows;

    // Organize drinks by category
    drinks.forEach((drink) => {
      const category = drink.category;

      if (!drinksByCategory[category]) {
        drinksByCategory[category] = [];
      }

      drinksByCategory[category].push(drink);
    });

    res.render("menu", { drinksByCategory });
  });
});

/**
 * @swagger
 * menu_jsx:
 *   get:
 *     summary: get all drinks from the database
 *     description: gets all the drinks and their associated attributes from the database
 *     responses:
 *       200:
 *         description: list of all drinks in database
 */
app.get("/menu_jsx", async (req, res) => {
  const drinksByCategory = {};
  try {
    const results = await pool
      .query("SELECT * FROM drinks;")
      .then((query_res) => {
        const drinks = query_res.rows;

        // Organize drinks by category
        drinks.forEach((drink) => {
          const category = drink.category;

          if (!drinksByCategory[category]) {
            drinksByCategory[category] = [];
          }

          drinksByCategory[category].push(drink);
        });
      });

    console.log(drinksByCategory);
    res.status(200).json({
      status: "success",
      data: {
        drinksByCategory: drinksByCategory,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

app.get("/menu_addons", (req, res) => {
  addOns = [];

  pool
    .query("SELECT * FROM ingredients WHERE cost != 0 order by name;")
    .then((query_res) => {
      for (let i = 0; i < query_res.rowCount; i++) {
        addOns.push(query_res.rows[i]);
      }

      const data = { addOns: addOns };
      res.render("menu_addons", data);
    });
});

/**
 * @swagger
 * menu_addons_jsx:
 *   get:
 *     summary: get all add-ons from the database
 *     description: gets all the ingredients with a cost of more than 0 and their associated attributes from the database
 *     responses:
 *       200:
 *         description: list of all add-ons in database
 */
app.get("/menu_addons_jsx", async (req, res) => {
  try {
    console.log("Getting all the add ons");

    const results = await pool.query(
      "SELECT * FROM ingredients WHERE cost > 0;"
    );
    res.status(200).json({
      status: "success",
      results: results.rows,
      data: { results },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

app.get("/inventory", (req, res) => {
  const query = "SELECT * FROM inventory_items ORDER BY name";
  pool.query(query).then((query_res) => {
    const inventoryData = query_res.rows;
    console.log(inventoryData);
    res.render("inventory", { inventoryData });
  });
});

app.get("/menu_items", (req, res) => {
  const drinksQuery = "SELECT * FROM drinks ORDER BY name";
  const ingredientsQuery = "SELECT * FROM ingredients ORDER BY name";

  Promise.all([pool.query(drinksQuery), pool.query(ingredientsQuery)]).then(
    ([drinksRes, ingredientsRes]) => {
      const menuData = drinksRes.rows;
      const ingredientsData = ingredientsRes.rows;
      console.log(menuData, ingredientsData);
      res.render("menu_items", { menuData, ingredientsData });
    }
  );
});

app.get("/analyze_trends", (req, res) => {
  res.render("analyze_trends");
});

// Getting inventory database and sending it to /inventory
/**
 * @swagger
 * inventory_items:
 *   get:
 *     summary: gets all items in the inventory database
 *     description: gets all items and their associated attributes in the inventory database
 *     responses:
 *       200:
 *         description: list of inventory items
 */
app.get("/inventory_items", async (req, res) => {
  try {
    //console.log("Hello");

    const results = await pool.query("SELECT * FROM inventory_items;");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        table: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * addSupplyReorder:
 *   post:
 *     summary: adds supply reorder
 *     description: add supply reorder and associated items to the database
 *     responses:
 *       200:
 *         description: adds item to supply reoders table in the database
 */
app.post("/addSupplyReorder", (req, res) => {
  const { selectedItems, reorder_id, date, amounts } = req.body;

  console.log("amounts:", amounts);
  console.log("reorder ID:", reorder_id);
  console.log("Date:", date);

  const values = Object.entries(amounts).map(([item_id, amount]) => [
    reorder_id,
    item_id,
    amount,
  ]);

  let placeholders = [];
  let flattenedValues = [];

  for (let i = 0; i < values.length; i++) {
    const offset = i * 3;
    placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
    flattenedValues = flattenedValues.concat(values[i]);
  }

  pool.query(
    `INSERT INTO reorder_items (reorder_id, item_id, amount) VALUES ${placeholders.join(
      ", "
    )};`,
    flattenedValues,
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error in database." });
      } else {
        console.log(response);
      }
    }
  );

  pool.query(
    "INSERT INTO supply_reorders (reorder_id, date) VALUES ($1, $2);",
    [reorder_id, date],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error in database." });
      } else {
        console.log(response);
      }
    }
  );
});

// Getting all necessary data for View supply reorder
/**
 * @swagger
 * viewSupplyReorder:
 *   get:
 *     summary: gets all items in a supply reorder
 *     description: displays all items in the selected supply reorder
 *     responses:
 *       200:
 *         description: gets item in a specific supply reoders table in the database
 */
app.post("/viewSupplyReorder", (req, res) => {
  const { reorder_id, date } = req.body;

  console.log("Received data:", reorder_id, date);

  res.json({ success: true, message: "Date received successfully." });
});

// Getting all necessary data for supply reorder
/**
 * @swagger
 * deleteSupplyReorder:
 *   post:
 *     summary: removes item from supply reorder
 *     description: removes supply reorder and all associated items in reorder from database
 *     responses:
 *       200:
 *         description: removes item from supply reorder
 */
app.post("/deleteSupplyReorder", (req, res) => {
  const { reorder_id, date } = req.body;

  console.log("Received data:", reorder_id, date);

  // First query to delete from reorder_items
  pool.query(
    "DELETE FROM reorder_items WHERE reorder_id = $1",
    [reorder_id],
    (deleteErr1, deleteResponse1) => {
      if (deleteErr1) {
        console.log(deleteErr1);
        res.status(500).send("Delete unsuccessful");
      } else {
        console.log(deleteResponse1);

        // Second query to delete from supply_reorders
        pool.query(
          "DELETE FROM supply_reorders WHERE reorder_id = $1",
          [reorder_id],
          (deleteErr2, deleteResponse2) => {
            if (deleteErr2) {
              console.log(deleteErr2);
              res.status(500).send("Delete unsuccessful");
            } else {
              console.log(deleteResponse2);
              res.json({ success: true, message: "Delete successful" });
            }
          }
        );
      }
    }
  );
});

// Getting ingredient database and sending it to /inventory
app.get("/reorder_items", async (req, res) => {
  try {
    console.log("Getting all the reorder_items");

    const results = await pool.query("SELECT * FROM reorder_items;");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        table: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

// Getting ingredient database and sending it to /inventory
app.get("/ingredient_items", async (req, res) => {
  try {
    console.log("Getting all the ingredients");

    const results = await pool.query("SELECT * FROM ingredients;");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        table: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

// Getting ingredient database and sending it to /inventory
// app.get("/supply_reorders", async (req, res) => {
//   try {
//     console.log("Getting all the supply reorder");

//     const results = await pool.query("SELECT * FROM supply_reorders;");
//     res.status(200).json({
//       status: "success",
//       results: results.rows.length,
//       data: {
//         table: results,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       status: "error",
//       message: "An error occurred while fetching data.",
//     });
//   }
// });

app.post("/addItemIngredient", (req, res) => {
  console.log("app.addItemIngredient");
  console.log(req.body.ingredientId);
  console.log(req.body.inventoryId);
  console.log(req.body.name);
  console.log(req.body.cost);

  // TO - DO
  // - when inventoryId is empty
  //  - update ingredient database on the backend

  // - when inventoryId is given
  //  - update ingredient database with the inventory ID involved
  //  - update the inventory database adding assoicated ingredeint ID

  if (req.body.inventoryId == "") {
    console.log("Inserting into ingredients table");
    pool.query(
      "INSERT INTO ingredients (ingredient_id, name, cost) VALUES($1, $2, $3)",
      [req.body.ingredientId, req.body.name, req.body.cost],
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
        }
      }
    );
  } else {
    console.log("Inserting into ingredient with inventoryId");

    pool.query(
      "INSERT INTO ingredients (ingredient_id, inventory_id, name, cost) VALUES ($1, $2, $3, $4)",
      [
        req.body.ingredientId,
        req.body.inventoryId,
        req.body.name,
        req.body.cost,
      ],
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
        }
      }
    );

    console.log("Updating inventory table");
    pool.query(
      "UPDATE inventory_items SET ingredient_id = $1 WHERE item_id = $2",
      [req.body.ingredientId, req.body.inventoryId],
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
        }
      }
    );
  }

  console.log("Updaing inventory_items and ingredeints1");
});

app.get("/inventory_items/:itemId", (req, res) => {
  const itemId = req.params.itemId;

  pool.query(
    "SELECT inventory_id FROM inventory_items WHERE item_id = $1",
    [itemId],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Err" });
      } else {
        const inventoryId = result.rows[0] ? result.rows[0].inventory_id : null;
        res.json({ inventoryId });
      }
    }
  );
});

/**
 * @swagger
 * updateItemIngredient:
 *   post:
 *     summary: update item in the ingredient table
 *     description: updates cost and or name of ingredient
 *     responses:
 *       200:
 *         description: updates item in ingredient table
 */
app.post("/updateItemIngredient", (req, res) => {
  console.log("UpdateItemIngredient");
  console.log(req.body.ingredientId);
  console.log(req.body.inventoryId);
  console.log(req.body.name);
  console.log(req.body.cost);

  if (req.body.cost && req.body.name) {
    pool.query(
      "UPDATE ingredients SET name = $1, cost = $2 WHERE ingredient_id = $3",
      [req.body.name, req.body.cost, req.body.ingredientId],
      (err, response) => {
        if (err) {
          console.log(err);
          res.status(500).send("Update unsuccessful");
        } else {
          console.log(response);
          res.send("Update successful");
        }
      }
    );
  } else if (req.body.cost) {
    pool.query(
      "UPDATE ingredients SET cost = $1 WHERE ingredient_id = $2",
      [req.body.cost, req.body.ingredientId],
      (err, response) => {
        if (err) {
          console.log(err);
          res.status(500).send("Update unsuccessful");
        } else {
          console.log(response);
          res.send("Update successful");
        }
      }
    );
  } else {
    pool.query(
      "UPDATE ingredients SET name = $1 WHERE ingredient_id = $2",
      [req.body.name, req.body.ingredientId],
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
        }
      }
    );
  }
});

/**
 * @swagger
 * deleteItemIngredient:
 *   post:
 *     summary: delete item from ingredient
 *     description: removes ingredient and all its associated attributes from database
 *     responses:
 *       200:
 *         description: deletes item from ingredient
 */
app.post("/deleteItemIngredient", async (req, res) => {
  try {
    // Update inventory_items
    await pool.query(
      "UPDATE inventory_items SET ingredient_id = NULL WHERE ingredient_id = $1;",
      [req.body.ingredientId]
    );

    console.log("Assigned NULL in inventory_items database");

    // Delete from ingredients
    const deleteResponse = await pool.query(
      "DELETE FROM ingredients WHERE ingredient_id = $1;",
      [req.body.ingredientId]
    );

    console.log(deleteResponse);

    if (deleteResponse.rowCount > 0) {
      res.send("Delete successful");
    } else {
      res.status(500).send("Delete unsuccessful");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * addItemInventory:
 *   post:
 *     summary: add item to inventory
 *     description: adds an inventory item and all of its associated attributes to the database
 *     responses:
 *       200:
 *         description: adds item to inventory
 */
app.post("/addItemInventory", (req, res) => {
  console.log("app.post");
  console.log(req.body.itemId);
  console.log(req.body.name);
  console.log(req.body.amount);
  console.log(req.body.quantityPerUnit);
  console.log(req.body.ingredientId);

  if (req.body.ingredientId == "") {
    pool.query(
      "INSERT INTO inventory_items (item_id, name, count, fill_level, quantity_per_unit) VALUES($1, $2, $3, $4, $5)",
      [
        req.body.itemId,
        req.body.name,
        req.body.amount,
        req.body.fillLevel,
        req.body.quantityPerUnit,
      ],
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
        }
      }
    );
  } else {
    console.log("Updaing inventory_items and ingredeints2");
    // Updating Inventory Page with assciated ingredient ID
    pool.query(
      "INSERT INTO inventory_items (item_id, name, ingredient_id, count, fill_level, quantity_per_unit) VALUES($1, $2, $3, $4, $5, $6)",
      [
        req.body.itemId,
        req.body.name,
        req.body.ingredientId,
        req.body.amount,
        req.body.fillLevel,
        req.body.quantityPerUnit,
      ],
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
        }
      }
    );

    console.log("Updaing inventory_items and ingredeints and amount3");

    // Updating ingredient database with resp. assocated inventory ID
    pool.query(
      "UPDATE ingredients SET inventory_id = $1 cost = $2 WHERE ingredient_id = $3",
      [req.body.itemId, req.body.amount, req.body.ingredientId],
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
        }
      }
    );
  }

  console.log("Updaing inventory_items and ingredeints4");
});

/**
 * @swagger
 * deleteItemInventory:
 *   post:
 *     summary: delete item from inventory
 *     description: removes an inventory item and all of its associated attributes from the database
 *     responses:
 *       200:
 *         description: remove item from inventory
 */
app.post("/deleteItemInventory", (req, res) => {
  console.log("Server delete item");
  console.log(req.body.itemId);
  console.log(req.body.name);
  console.log(req.body.amount);
  console.log(req.body.quantityPerUnit);

  pool.query(
    "DELETE FROM inventory_items WHERE item_id = $1 AND name = $2",
    [req.body.itemId, req.body.name],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    }
  );
});

/**
 * @swagger
 * ExcessReport:
 *   get:
 *     summary: determines what inventory items are in excess
 *     description: queries inventory levels and quantity to determine what items are in excess
 *     responses:
 *       200:
 *         description: list of inventory items
 */
app.get("/ExcessReport", async (req, res) => {
  try {
    console.log("Getting Excess Report");
    console.log(req.query.startTimestamp, req.query.endTimestamp);
    const query = {
      text: `
        WITH ItemTotals AS (
          SELECT
            ri.item_id,
            SUM(ri.amount) AS total_amount
          FROM
            reorder_items ri
          WHERE
            ri.reorder_id IN (
              SELECT
                reorder_id
              FROM
                supply_reorders
              WHERE
                date BETWEEN $1 AND $2
            )
          GROUP BY
            ri.item_id
        )
        SELECT
          it.item_id,
          ii.name
        FROM
          ItemTotals it
          RIGHT JOIN inventory_items ii ON it.item_id = ii.item_id
        GROUP BY
          it.item_id, ii.name
        HAVING
          SUM(it.total_amount) < 0.1 * MAX(ii.fill_level)
        UNION
        SELECT
          ii.item_id,
          ii.name
        FROM
          inventory_items ii
        WHERE
          ii.item_id NOT IN (
            SELECT
              DISTINCT(ri.item_id)
            FROM
              reorder_items ri
            WHERE
              ri.reorder_id IN (
                SELECT
                  reorder_id
                FROM
                  supply_reorders
                WHERE
                  date BETWEEN $1 AND $2
              )
          )
      `,
      values: [req.query.startTimestamp, req.query.endTimestamp],
    };
    const results = await pool.query(query);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        inventory: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * MenuItemPopularityAnalysis:
 *   get:
 *     summary: determines the most popular drinks
 *     description: queries order history to determine the most popular drinks are based on number inputted by user
 *     responses:
 *       200:
 *         description: list of most popular drinks
 */
app.get("/MenuItemPopularityAnalysis", async (req, res) => {
  try {
    console.log("Getting Menu Item Popularity Analysis");
    console.log(
      req.query.startTimestamp,
      req.query.endTimestamp,
      req.query.number
    );

    const query = {
      text: `
        SELECT
          ROW_NUMBER() OVER (ORDER BY quantity DESC) AS rank,
          name,
          quantity
        FROM (
          SELECT
            d.name AS name,
            SUM(1) AS quantity
          FROM
            drink_orders AS d_o
            JOIN drinks AS d ON d_o.drink_id = d.drink_id
            JOIN orders AS o ON d_o.order_id = o.order_id
          WHERE
            o.timestamp >= $1 AND o.timestamp <= $2
          GROUP BY
            d.name
        ) drinkSums
        ORDER BY
          rank
        LIMIT $3;
      `,
      values: [
        req.query.startTimestamp,
        req.query.endTimestamp,
        req.query.number,
      ],
    };

    const results = await pool.query(query);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        inventory: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * RestockReport:
 *   get:
 *     summary: determines which inventory items need to be restocked
 *     description: queries inventory quantity and fill level to determine which items need to be restocked
 *     responses:
 *       200:
 *         description: list of inventory items that need to be restocked
 */
app.get("/RestockReport", async (req, res) => {
  try {
    console.log("Getting Restock Report");
    const results = await pool.query(
      "SELECT * FROM inventory_items WHERE count < fill_level GROUP BY fill_level, item_id ORDER BY name;"
    );
    console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        inventory: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * SalesReport:
 *   get:
 *     summary: gets sales report for the last year
 *     description: queries order history to determine what drinks were sold and the quantity
 *     responses:
 *       200:
 *         description: list of drinks sold and the total price
 */
app.get("/SalesReport", async (req, res) => {
  try {
    console.log("Getting Sales Report");

    const drinkQuery = {
      text: `
        SELECT d.name AS drink_name, SUM(d.cost) AS total_sales
        FROM drink_orders AS d_o
        JOIN drinks AS d ON d_o.drink_id = d.drink_id
        JOIN orders AS o ON d_o.order_id = o.order_id
        WHERE o.timestamp >= $1 AND o.timestamp <= $2
        GROUP BY d.name, d.cost ORDER BY total_sales DESC;
      `,
      values: [req.query.startTimestamp, req.query.endTimestamp],
    };

    const addonQuery = {
      text: `
        SELECT i.name AS add_on_name, SUM(i.cost) AS total_sales
        FROM add_ons AS ao
        JOIN ingredients AS i ON ao.ingredient_id = i.ingredient_id
        JOIN orders AS o ON ao.order_id = o.order_id
        WHERE o.timestamp >= $1 AND o.timestamp <= $2 AND i.cost > 0
        GROUP BY i.name, i.cost ORDER BY total_sales DESC;
      `,
      values: [req.query.startTimestamp, req.query.endTimestamp],
    };

    const drinkResults = await pool.query(drinkQuery);
    const addonResults = await pool.query(addonQuery);

    res.status(200).json({
      status: "success",
      results: {
        inventory: drinkResults.rows.length,
        addons: addonResults.rows.length,
      },
      data: {
        inventory: drinkResults,
        addons: addonResults,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * WhatSalesTogether:
 *   get:
 *     summary: gets drinks that sell well together
 *     description: queries order history to determine what drinks were sold together the most
 *     responses:
 *       200:
 *         description: list of drinks that sell well together
 */
app.get("/WhatSalesTogether", async (req, res) => {
  try {
    console.log("Getting What Sales Together");
    const query = {
      text: `
        WITH CombinedOrders AS (
          SELECT
            o1.drink_id AS drink1,
            o2.drink_id AS drink2
          FROM
            drink_orders o1
            JOIN drink_orders o2 ON o1.order_id = o2.order_id AND o1.number < o2.number
            JOIN orders ord1 ON o1.order_id = ord1.order_id
          WHERE
            o1.drink_id < o2.drink_id AND ord1.timestamp BETWEEN $1 AND $2
        )
        SELECT
          dm1.name AS drink_1,
          dm2.name AS drink_2,
          COUNT(*) AS frequency
        FROM
          CombinedOrders c
          JOIN drinks dm1 ON c.drink1 = dm1.drink_id
          JOIN drinks dm2 ON c.drink2 = dm2.drink_id
        GROUP BY
          c.drink1, dm1.name, c.drink2, dm2.name
        ORDER BY
          frequency DESC;
      `,
      values: [req.query.startTimestamp, req.query.endTimestamp],
    };
    const results = await pool.query(query);
    console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        inventory: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

// menu items call
/**
 * @swagger
 * menuItems:
 *   get:
 *     summary: gets all drinks
 *     description: gets all drinks sorted by category
 *     responses:
 *       200:
 *         description: list of drinks by category
 */
app.get("/menuItems", async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM drinks ORDER BY category, name;"
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        table: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

// menu items call
/**
 * @swagger
 * addOns:
 *   get:
 *     summary: gets all add-ons
 *     description: gets all ingredients with a cost greater than zero from the database
 *     responses:
 *       200:
 *         description: list of all add-ons in the database
 */
app.get("/addOns", async (req, res) => {
  try {
    console.log("Mio ");
    const results = await pool.query(
      "SELECT * FROM ingredients WHERE cost > 0 ORDER BY name;"
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        table: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

// menu items call
/**
 * @swagger
 * updateBaseIngredients:
 *   get:
 *     summary: gets all ingredients
 *     description: gets all ingredients an their attributes from the database
 *     responses:
 *       200:
 *         description: list of all ingredients in the database
 */
app.get("/addBaseIngredients", async (req, res) => {
  console.log("Entered here");
  try {
    console.log("Mio ");
    const results = await pool.query(
      "SELECT * FROM ingredients ORDER BY name;"
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        table: results,
      },
    });
    //console.log(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

// menu items call
/**
 * @swagger
 * updateBaseIngredients:
 *   post:
 *     summary: updates the base ingredients of a drink
 *     description: updates the base ingredients attribute of an drink in the database
 *     responses:
 *       200:
 *         description: updates the base ingredients of a drink
 */
app.post("/updateBaseIngredients", async (req, res) => {
  console.log("Entered the update machine");

  try {
    const { selectedIngredients, drinkID } = req.body;

    if (!drinkID) {
      return res.status(400).json({
        status: "error",
        message: "Drink ID is required.",
      });
    }
    console.log("Made it here");

    // Iterate through selected ingredients and log them
    for (const ingredient of selectedIngredients) {
      console.log("Selected Ingredient ID: " + ingredient.ingredient_id);
      pool.query(
        "INSERT INTO base_drink_ingredients (ingredient_id, drink_id) VALUES ($1, $2)",
        [ingredient.ingredient_id, drinkID]
      );
    }

    res.status(200).json({
      status: "success",
      message: "Base drink ingredients updated successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating base drink ingredients.",
    });
  }
});

// menu items call
/**
 * @swagger
 * deleteDrink:
 *   post:
 *     summary: deletes a drink
 *     description: removes a drink from the database
 *     responses:
 *       200:
 *         description: removes a drink and all its associated attributes from the database
 */
app.post("/deleteDrink", (req, res) => {
  let errorOccurred = false;

  pool.query(
    "DELETE FROM base_drink_ingredients WHERE drink_id = $1",
    [req.body.drinkID],
    (err, response) => {
      if (err) {
        console.log(err);
        errorOccurred = true;
        res.status(500).json({
          status: "error",
          rowCount: response.rowCount,
          message:
            "An error occurred while deleting the drink from base_drink_ingredients.",
        });
      } else {
        console.log(response);
        if (!errorOccurred) {
          // Continue with deleting from the drinks table after successfully deleting from base_drink_ingredients
          pool.query(
            "DELETE FROM drinks WHERE drink_id = $1",
            [req.body.drinkID],
            (err, response) => {
              if (err) {
                console.log(err);
                res.status(500).json({
                  status: "error",
                  rowCount: response.rowCount,
                  message:
                    "An error occurred while deleting the drink from drinks.",
                });
              } else {
                console.log(response);
                res.status(200).json({
                  rowCount: response.rowCount,
                });
              }
            }
          );
        }
      }
    }
  );

  console.log("Item deleted");
});

// menu items call
/**
 * @swagger
 * updateMenuItemName:
 *   post:
 *     summary: updates the name of a drink
 *     description: updates the name attribute of an drink in the database
 *     responses:
 *       200:
 *         description: updates the name of a drink
 */
app.post("/updateMenuItemName", (req, res) => {
  pool.query(
    "UPDATE drinks SET name = $1 WHERE drink_id = $2;",
    [req.body.drinkName, req.body.drinkID],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error",
          rowCount: response.rowCount,
          message: "An error occurred while adding the add-on.",
        });
      } else {
        res.status(200).json({
          rowCount: response.rowCount,
        });
        console.log(response);
      }
    }
  );
  console.log("Item deleted");
});

// menu items call
/**
 * @swagger
 * updateMenuItemCost:
 *   post:
 *     summary: updates the cost of a drink
 *     description: updates the cost attribute of an drink in the database
 *     responses:
 *       200:
 *         description: updates the cost of a drink
 */
app.post("/updateMenuItemCost", (req, res) => {
  pool.query(
    "UPDATE drinks SET cost = $1 WHERE drink_id = $2;",
    [req.body.drinkCost, req.body.drinkID],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error",
          rowCount: response.rowCount,
          message: "An error occurred while adding the add-on.",
        });
      } else {
        res.status(200).json({
          rowCount: response.rowCount,
        });
        console.log(response);
      }
    }
  );
  console.log("Item deleted");
});

// menu items call
/**
 * @swagger
 * updateMenuItemCategory:
 *   post:
 *     summary: updates the category of a drink
 *     description: updates the name attribute of an drink in the database
 *     responses:
 *       200:
 *         description: updates the name of a drink
 */
app.post("/updateMenuItemCategory", (req, res) => {
  pool.query(
    "UPDATE drinks SET category = $1 WHERE drink_id = $2;",
    [req.body.drinkCategory, req.body.drinkID],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error",
          rowCount: response.rowCount,
          message: "An error occurred while adding the add-on.",
        });
      } else {
        res.status(200).json({
          rowCount: response.rowCount,
        });
        console.log(response);
      }
    }
  );
  console.log("Item deleted");
});

// menu items call
/**
 * @swagger
 * addAddOn:
 *   post:
 *     summary: adds add-on to database
 *     description: takes a ingredientId, ingredientName, ingredientCost to create a new item in the ingredients database
 *     responses:
 *       200:
 *         description: adds add-on to ingredient database
 */
app.post("/addAddOn", (req, res) => {
  pool.query(
    "INSERT INTO ingredients(ingredient_id, name, cost) VALUES ($1, $2, $3);",
    [req.body.addOnID, req.body.addOnName, req.body.addOnCost],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "An error occurred while adding the add-on.",
        });
      } else {
        console.log(response);
      }
    }
  );
});

// menu items call
/**
 * @swagger
 * addDrink:
 *   post:
 *     summary: adds drink to database
 *     description: takes a drinkId, drinkName, drinkCost, and drinkCategory to create a new item in the drinks database
 *     responses:
 *       200:
 *         description: adds drink and associated attribute to database
 */
app.post("/addDrink", (req, res) => {
  pool.query(
    "INSERT INTO drinks VALUES ( $1, $2 , $3, $4);",
    [
      req.body.drinkID,
      req.body.drinkName,
      req.body.drinkCost,
      req.body.drinkCategory,
    ],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "An error occurred while adding the add-on.",
        });
      } else {
        console.log(response);
      }
    }
  );
});

// menu items call
/**
 * @swagger
 * deleteAddOn:
 *   post:
 *     summary: deletes an ingredient item that is also an add-on
 *     description: deletes ingredient in the database
 *     responses:
 *       200:
 *         description: removes an ingredient item
 */
app.post("/deleteAddOn", (req, res) => {
  console.log("Server delete item");

  pool.query(
    "DELETE FROM ingredients WHERE ingredient_id = $1;",
    [req.body.addOnID],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error",
          rowCount: response.rowCount,
          message: "An error occurred while adding the add-on.",
        });
      } else {
        res.status(200).json({
          rowCount: response.rowCount,
        });
        console.log(response);
      }
    }
  );
});

// menu items call
/**
 * @swagger
 * updateAddOnName:
 *   post:
 *     summary: updates the name of an ingredient item that is also an add-on
 *     description: updates the name attribute of an ingredient in the database
 *     responses:
 *       200:
 *         description: updates the name of an ingredient item
 */
app.post("/updateAddOnName", (req, res) => {
  console.log("Server delete item");

  pool.query(
    "UPDATE ingredients SET name = $1 WHERE ingredient_id = $2;",
    [req.body.addOnName, req.body.addOnID],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error",
          rowCount: response.rowCount,
          message: "An error occurred while adding the add-on.",
        });
      } else {
        res.status(200).json({
          rowCount: response.rowCount,
        });
        console.log(response);
      }
    }
  );
});

// menu items call
/**
 * @swagger
 * updateAddOnCost:
 *   post:
 *     summary: updates the cost  of an ingredient item that is also an add-on
 *     description: updates the cost attribute of an ingredient in the database
 *     responses:
 *       200:
 *         description: updates the cost of an ingredient item
 */
app.post("/updateAddOnCost", (req, res) => {
  console.log("Server delete item");

  pool.query(
    "UPDATE ingredients SET cost = $1 WHERE ingredient_id = $2;",
    [req.body.addOnCost, req.body.addOnID],
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error",
          rowCount: response.rowCount,
          message: "An error occurred while adding the add-on.",
        });
      } else {
        res.status(200).json({
          rowCount: response.rowCount,
        });
        console.log(response);
      }
    }
  );
});

/**
 * @swagger
 * updateInventoryName:
 *   post:
 *     summary: updates the name of an inventory item
 *     description: updates the name attribute of an item in the database
 *     responses:
 *       200:
 *         description: updates the name of an inventory item
 */
app.post("/updateInventoryName", (req, res) => {
  console.log("Server delete item");
  console.log(req.body.itemId);
  console.log(req.body.name);
  console.log(req.body.amount);
  console.log(req.body.quantityPerUnit);
  console.log(req.body.fillLevel);

  pool.query(
    "UPDATE inventory_items SET name = $1 WHERE item_id = $2;",
    //"UPDATE drinks SET name = $1 WHERE drink_id = $2;",
    [req.body.name, req.body.itemId],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    }
  );
});

/**
 * @swagger
 * updateInventoryCount:
 *   post:
 *     summary: updates the count of an inventory item
 *     description: updates the count attribute of an item in the database
 *     responses:
 *       200:
 *         description: updates the count of an inventory item
 */
app.post("/updateInventoryCount", (req, res) => {
  //console.log("Server delete item mip");
  pool.query(
    "UPDATE inventory_items SET count = $1 WHERE item_id = $2;",
    //"UPDATE drinks SET cost = $1 WHERE drink_id = $2;",
    [req.body.amount, req.body.itemId],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    }
  );
});

/**
 * @swagger
 * updateInventoryQuantityUnit:
 *   post:
 *     summary: updates the quantity of an inventory item
 *     description: updates the quantity attribute of an item in the database
 *     responses:
 *       200:
 *         description: updates the quantity of an inventory item
 */
app.post("/updateInventoryQuantityUnit", (req, res) => {
  console.log("Server delete item");
  pool.query(
    "UPDATE inventory_items SET quantity_per_unit = $1 WHERE item_id = $2;",
    //"UPDATE drinks SET category = $1 WHERE drink_id = $2;",
    [req.body.quantityPerUnit, req.body.itemId],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    }
  );
});

/**
 * @swagger
 * updateInventoryFillLevel:
 *   post:
 *     summary: updates the fill level of an inventory item
 *     description: updates the fill_level attribute of an item in the database
 *     responses:
 *       200:
 *         description: updates the fill of an inventory item
 */
app.post("/updateInventoryFillLevel", (req, res) => {
  console.log("Server delete item");
  pool.query(
    "UPDATE inventory_items SET fill_level = $1 WHERE item_id = $2;",
    [req.body.fillLevel, req.body.itemId],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    }
  );
});

app.get("/recommendation_adj", async (req, res) => {
  try {
    console.log("ordersTodayQuery");
    const todaysOrders = [];

    // Step 1: Get orders for the current date
    const ordersResults = await pool.query(
      "SELECT * FROM orders WHERE DATE(timestamp) = CURRENT_DATE;"
    );
    const orders = ordersResults.rows;

    console.log("Orders:", orders);
    const itemOccurrenceMap = new Map();
    const oldCountsMap = new Map();

    for (const order of orders) {
      const addOnOrderResult = await pool.query(
        `SELECT * FROM add_ons WHERE order_id = ${order.order_id};`
      );
      const addOnRows = addOnOrderResult.rows;
      //console.log("Add on information", order.order_id, ":", addOnRows);
      for (const ingredient of addOnRows) {
        const inventoryItemsResults = await pool.query(
          `SELECT * FROM inventory_items WHERE ingredient_id = ${ingredient.ingredient_id};`
        );
        const inventoryItems = inventoryItemsResults.rows;
        //console.log("Add on final stuff Ingredient ID", ingredient.ingredient_id, ":", inventoryItems);
        inventoryItems.forEach((inventoryItem) => {
          const { item_id } = inventoryItem;
          const { count } = inventoryItem;
          itemOccurrenceMap.set(
            item_id,
            (itemOccurrenceMap.get(item_id) || 0) + 1
          );
          // Store the initial count in the oldCountsMap
          oldCountsMap.set(item_id, count);
        });
      }
    }
    // Step 2: Loop through orders and get drink orders for each order
    for (const order of orders) {
      const drinkOrdersResults = await pool.query(
        `SELECT * FROM drink_orders WHERE order_id = ${order.order_id};`
      );
      const drinkOrders = drinkOrdersResults.rows;

      //console.log("Drink Orders for Order ID", order.order_id, ":", drinkOrders);

      // Step 3: Loop through drink orders and get base drink ingredients for each drink
      for (const drinkOrder of drinkOrders) {
        const baseDrinkIngredientsResults = await pool.query(
          `SELECT * FROM base_drink_ingredients WHERE drink_id = ${drinkOrder.drink_id};`
        );
        const baseDrinkIngredients = baseDrinkIngredientsResults.rows;

        //console.log("Base Drink Ingredients for Drink ID", drinkOrder.drink_id, ":", baseDrinkIngredients);

        // Step 4: Loop through base drink ingredients and get inventory items for each ingredient
        for (const ingredient of baseDrinkIngredients) {
          const inventoryItemsResults = await pool.query(
            `SELECT * FROM inventory_items WHERE ingredient_id = ${ingredient.ingredient_id};`
          );
          const inventoryItems = inventoryItemsResults.rows;

          //console.log("Inventory Items for Ingredient ID", ingredient.ingredient_id, ":", inventoryItems);
          inventoryItems.forEach((inventoryItem) => {
            const { item_id } = inventoryItem;
            const { count } = inventoryItem;
            itemOccurrenceMap.set(
              item_id,
              (itemOccurrenceMap.get(item_id) || 0) + 1
            );
            // Store the initial count in the oldCountsMap
            oldCountsMap.set(item_id, count);
          });
          // Now you can process the data as needed and store the relevant information
        }
      }
    }
    console.log("Item Counts Map:", itemOccurrenceMap);
    console.log("Old Counts Map:", oldCountsMap);
    //console.log("Inventory Items for Ingredient ID", ingredient.ingredient_id, ":", inventoryItems);
    //Update counts in the inventory_items table
    for (const [itemId, occurrenceCount] of itemOccurrenceMap) {
      const oldCount = oldCountsMap.get(itemId) || 0;
      const updatedCount = Math.max(0, oldCount - occurrenceCount);
      // Update the inventory_items table using your query
      await pool.query(
        "UPDATE inventory_items SET count = $1 WHERE item_id = $2;",
        [updatedCount, itemId]
      );
    }
    //res.render(oldCountsMap);
    res.status(200).json({
      status: "success",
      oldCountsMap,
      message: "Data retrieved successfully yaaaaaaamip.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

// Getting ingredient database and sending it to /inventory
/**
 * @swagger
 * supply_reorders:
 *   get:
 *     summary: gets all the supply reorders in the database
 *     description: gets all attributes from the supply reorders database
 *     responses:
 *       200:
 *         description: list of all supply reorderes
 */
app.get("/supply_reorders", async (req, res) => {
  try {
    console.log("Getting all the supply reorder");

    const results = await pool.query("SELECT * FROM supply_reorders;");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        table: results,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * CustomerPopularityAnalysis:
 *   get:
 *     summary: get 18 most popular drinks from the order history
 *     description: gets most popular drinks based on the last year's order history
 *     responses:
 *       200:
 *         description: list of the 18 most popular drinks
 */
app.get("/CustomerPopularityAnalysis", async (req, res) => {
  try {
    console.log("Getting Customer Item Popularity Analysis");

    const query = {
      text: `
        SELECT
          ROW_NUMBER() OVER (ORDER BY quantity DESC) AS rank,
          name,
          id,
          cost,
          category,
          quantity
        FROM (
          SELECT
            d.name AS name,
            d.drink_id AS id,
            d.cost AS cost,
            d.category AS category,
            SUM(1) AS quantity
          FROM
            drink_orders AS d_o
            JOIN drinks AS d ON d_o.drink_id = d.drink_id
            JOIN orders AS o ON d_o.order_id = o.order_id
          WHERE
            o.timestamp >= $1 AND o.timestamp <= $2
          GROUP BY
            d.name,
            d.drink_id,
            d.cost,
            d.category
        ) drinkSums
        ORDER BY
          rank
        LIMIT $3;
      `,
      values: ["2022-01-01 00:00:00", "2022-12-31 00:00:00", 18],
    };

    const results = await pool.query(query);
    res.status(200).json({
      status: "success",
      results: results.rows,
      data: { results },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});

/**
 * @swagger
 * weather:
 *   get:
 *     summary: gets the weather of the user's current location
 *     description: gets latitude and longitude of the user and calls external API to get the weather at that location
 *     responses:
 *       200:
 *         description: weather information
 *       500:
 *         description: internal server error
 */
app.get("/weather", async (req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    console.log(lat);
    console.log(lon);

    if (!lat || !lon) {
      console.log(lat);
      console.log(lon);
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required." });
    }

    const apiKey = "dede69fd21eb974bc8b0d5ca22dc8e82";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    const response = await axios.get(apiUrl);
    console.log(response.data);
    res.status(200).json({
      status: "success",
      data: {
        data: response.data,
      },
    });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
