import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";

const Ingredients = () => {
  // Creating columns for displaying sql queries
  const columns = [
    { field: "ingredientId", headerName: "Ingredeint ID", width: 130, flex: 1 },
    { field: "inventoryId", headerName: "Inventory ID", width: 130, flex: 1 },

    { field: "name", headerName: "Name", width: 130, flex: 1 },
    { field: "cost", headerName: "Cost", type: "number", width: 90, flex: 1 },
  ];

  const [values, setValues] = useState({
    ingredientId: "",
    inventoryId: "",
    name: "",
    cost: "",
  });

  const [data, setData] = useState([]);

  // Getting inventory from the backend
  useEffect(() => {
    const ingredientItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/ingredient_items"
        );
        const jsonVals = await response.data;
        console.log("Working");
        console.log(jsonVals.data.table);
        // the item. names are from the database and left side values are from our const columns
        const rowsWithId = jsonVals.data.table.rows.map(
          (item, ingredient_id) => ({
            id: ingredient_id,
            ingredientId: item.ingredient_id,
            inventoryId: item.inventory_id,
            name: item.name,
            cost: item.cost,
          })
        );
        setData(rowsWithId);
      } catch (err) {
        console.log("ERROR");
        console.error(err.message);
      }
    };

    ingredientItems();
  }, []);

  return (
    <div
      style={{
        backgroundColor: theme.palette.primary.main,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Inventory Page</h1>

      <div style={{ height: 400, width: "80vw", marginBottom: "20px" }}>
        <DataGrid rows={data} columns={columns} columnBuffer={2} />
      </div>
    </div>
  );
};

export default Ingredients;
