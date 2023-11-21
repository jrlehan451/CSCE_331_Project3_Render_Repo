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
      data: {results},
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data.",
    });
  }
});


app.get('/drink_series_items', async (req, res) => {
  try {
    category = req.query.category;
    console.log(category);
    const drinkCategoriesQuery = await pool.query('SELECT DISTINCT category FROM drinks;');
    const drinksQuery = await pool.query('SELECT * FROM drinks WHERE category = $1', [category]);

    res.status(200).json({ 
      status: "success",

      data: {
        categories: drinkCategoriesQuery.rows, 
        drinks: drinksQuery.rows},
    });
  } catch (error) {
    console.error('Error fetching drink series:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/add_ons", async (req, res) => {
  try {
    console.log("Getting all the add ons");

    const results = await pool.query("SELECT * FROM ingredients WHERE cost > 0;");
    res.status(200).json({
      status: "success",
      results: results.rows,
      data: {results},
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
        ], // Using temporary customer name and totalCost, both of which can just be stored in sessionStorage
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

app.locals.postOrder = function (drinks, add_ons) {
  var drinks = JSON.parse(drinks);
  var add_ons = JSON.parse(add_ons);

  var nextOrderId = 0;

  pool
    .query("SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1;")
    .then((query_res) => {
      nextOrderId = query_res + 1;
    });

  pool.query(
    "INSERT INTO orders(order_id, name, timestamp, cost) VALUES($1, $2, $3, $4)",
    [
      nextOrderId,
      "Test Name",
      new Date().toISOString().slice(0, 19).replace("T", " "),
      10,
    ], // Using temporary customer name and totalCost, both of which can just be stored in sessionStorage
    (err, res) => {
      if (err) return next(err);

      response.redirect("/monsters");
    }
  );
};

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
    "DELETE FROM inventory_items WHERE item_id = $1 AND name = $2 AND count =$3 AND quantity_per_unit = $4",
    [req.body.itemId, req.body.name, req.body.amount, req.body.quantityPerUnit],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    }
  );
});


app.get("/menuItems", async (req, res) => {
  try {
    //console.log("Mi ");
    const results = await pool.query("SELECT * FROM drinks ORDER BY category, name;");
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

app.get("/addOns", async (req, res) => {
  try {
    console.log("Mio ");
    const results = await pool.query("SELECT * FROM ingredients WHERE cost > 0 ORDER BY name;");
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

app.post("/deleteDrink", (req, res) => {
  console.log("Server delete item");
  console.log(req.body.drinkID);
  //console.log(req.body.name);
  //console.log(req.body.amount);
  //console.log(req.body.quantityPerUnit);

  pool.query(
    //"DELETE FROM inventory_items WHERE item_id = $1 AND name = $2 AND count =$3 AND quantity_per_unit = $4",
    "DELETE FROM base_drink_ingredients WHERE drink_id = $1",
    [req.body.drinkID],
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
        })
        console.log(response);
      }
    }
  );
  console.log("Item deleted");
});

app.post("/deleteDrinks", (req, res) => {
  console.log("Server delete item");
  console.log(req.body.drinkID);

  pool.query(

    "DELETE FROM drinks WHERE drink_id = $1",
    [req.body.drinkID],
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
        })
        console.log(response);
      }
    }
  );
  console.log("Item deleted");
});

app.post("/updateMenuItemName", (req, res) => {
  console.log("Update menu item name");
  console.log(req.body.drinkID);
  console.log(req.body.drinkName);
  console.log(req.body.drinkCost);
  console.log(req.body.drinkCategory);

  pool.query(

    "UPDATE drinks SET name = $1 WHERE drink_id = $2;",
    [req.body.drinkName,req.body.drinkID],
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
        })
        console.log(response);
      }
    }
  );
  console.log("Item deleted");
});

app.post("/updateMenuItemCost", (req, res) => {
  console.log("Update menu item cost");
  console.log(req.body.drinkID);
  console.log(req.body.drinkName);
  console.log(req.body.drinkCost);
  console.log(req.body.drinkCategory);

  pool.query(

    "UPDATE drinks SET cost = $1 WHERE drink_id = $2;",
    [req.body.drinkCost,req.body.drinkID],
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
        })
        console.log(response);
      }
    }
  );
  console.log("Item deleted");
});

app.post("/updateMenuItemCategory", (req, res) => {
  console.log("Update menu item category");
  console.log(req.body.drinkID);
  console.log(req.body.drinkCategory);

 pool.query(

  "UPDATE drinks SET category = $1 WHERE drink_id = $2;",
  [req.body.drinkCategory,req.body.drinkID],
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
      })
      console.log(response);
    }
  }
);
console.log("Item deleted");
});

app.post("/addAddOn", (req, res) => {
  console.log("Server delete item");
  console.log(req.body.addOnID);
  console.log(req.body.addOnName);
  console.log(req.body.addOnCost);

  pool.query(

    "INSERT INTO ingredients(ingredient_id, name, cost) VALUES ($1, $2, $3);",
    [req.body.addOnID, req.body.addOnName, req.body.addOnCost],
    (err, response) => {
      if (err) {
        console.log(err);
        // Send an error response to the client
        res.status(500).json({
          status: "error",
          message: "An error occurred while adding the add-on.",
        });
      } else {
        console.log(response);
      }
    }
  );
  //console.log("Item deleted");
});

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
        })
        console.log(response);
      }
    }
  );
  //console.log("Item deleted");
});

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
        })
        console.log(response);
      }
    }
  );
  //console.log("Item deleted");
});

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
        })
        console.log(response);
      }
    }
  );
  //console.log("Item deleted");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
