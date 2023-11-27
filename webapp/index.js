const express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
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

app.get("/manager_main", (req, res) => {
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

/* app.locals.postOrder = function(drinks, add_ons) {
    var drinks = JSON.parse(drinks);
    var add_ons = JSON.parse(add_ons);

  var nextOrderId = 0;

  pool
    .query("SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1;")
    .then((query_res) => {
      nextOrderId = query_res + 1;
    });

    pool
        .query('INSERT INTO orders(order_id, name, timestamp, cost) VALUES($1, $2, $3, $4)',
        [nextOrderId, "Test Name", new Date().toISOString().slice(0, 19).replace('T', ' '), 10], // Using temporary customer name and totalCost, both of which can just be stored in sessionStorage
        (err, res) => {
            if (err) return next(err);
        
            response.redirect('/monsters');
        });
} */

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
app.get("/inventory_items", async (req, res) => {
  try {
    console.log("Hello");

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
app.post("/viewSupplyReorder", (req, res) => {
  const { reorder_id, date } = req.body;

  console.log("Received data:", reorder_id, date);

  res.json({ success: true, message: "Date received successfully." });
});

// Getting all necessary data for delete supply reorder
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

  console.log("Updaing inventory_items and ingredeints");
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

app.post("/deleteItemIngredient", (req, res) => {
  console.log("app.deleteItemIngredient");
  console.log(req.body.ingredientId);
  console.log(req.body.inventoryId);
  console.log(req.body.name);
  console.log(req.body.cost);

  // Fetch inventory_id from inventory_items based on ingredient_id
  pool.query(
    "SELECT item_id FROM inventory_items WHERE ingredient_id = $1",
    [req.body.ingredientId],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const inventoryId = result.rows[0] ? result.rows[0].item_id : null;
        console.log("The inventoryId:");
        console.log(inventoryId);

        // Check if inventoryId exists
        if (inventoryId) {
          // If inventoryId exists, update inventory_items and then delete from ingredients
          pool.query(
            "UPDATE inventory_items SET ingredient_id = $1 WHERE item_id = $2",
            [null, inventoryId],
            (updateErr, updateResponse) => {
              if (updateErr) {
                console.log(updateErr);
              } else {
                console.log(updateResponse);
                console.log("Assigned NULL in inventory_items database");

                // Check if the update was successful before deleting from ingredients
                if (updateResponse.rowCount > 0) {
                  pool.query(
                    "DELETE FROM ingredients WHERE ingredient_id = $1 AND name = $2",
                    [req.body.ingredientId, req.body.name],
                    (deleteErr, deleteResponse) => {
                      if (deleteErr) {
                        console.log(deleteErr);
                        res.status(500).send("Delete unsuccessful");
                      } else {
                        console.log(deleteResponse);
                        res.send("Delete successful");
                      }
                    }
                  );
                } else {
                  res.status(500).send("Update unsuccessful");
                }
              }
            }
          );
        } else {
          // If inventoryId doesn't exist, directly delete from ingredients
          pool.query(
            "DELETE FROM ingredients WHERE ingredient_id = $1 AND name = $2",
            [req.body.ingredientId, req.body.name],
            (deleteErr, deleteResponse) => {
              if (deleteErr) {
                console.log(deleteErr);
                res.status(500).send("Delete unsuccessful");
              } else {
                console.log(deleteResponse);
                res.send("Delete successful");
              }
            }
          );
        }
      }
    }
  );
});

app.post("/addItemInventory", (req, res) => {
  console.log("app.post");
  console.log(req.body.itemId);
  console.log(req.body.name);
  console.log(req.body.amount);
  console.log(req.body.quantityPerUnit);
  console.log(req.body.ingredientId);

  if (req.body.ingredientId == "") {
    pool.query(
      "INSERT INTO inventory_items (item_id, name, quantity_per_unit) VALUES($1, $2, $3)",
      [req.body.itemId, req.body.name, req.body.quantityPerUnit],
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
        }
      }
    );
  } else {
    console.log("Updaing inventory_items and ingredeints");
    // Updating Inventory Page with assciated ingredient ID
    pool.query(
      "INSERT INTO inventory_items (item_id, name, ingredient_id, quantity_per_unit) VALUES($1, $2, $3, $4)",
      [
        req.body.itemId,
        req.body.name,
        req.body.ingredientId,
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

    console.log("Updaing inventory_items and ingredeints and amount");

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

  console.log("Updaing inventory_items and ingredeints");
});

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

app.get("/ExcessReport", async (req, res) => {
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

app.get("/MenuItemsPopularityAnalysis", async (req, res) => {});

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

app.get("/SalesReport", async (req, res) => {});

app.get("/WhatSalesTogether", async (req, res) => {});

// menu items call
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
