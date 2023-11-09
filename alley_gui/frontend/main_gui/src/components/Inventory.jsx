import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ThemeProvider } from "@mui/material/styles";

//import axios from "axios"; // Make sure to import axios for HTTP requests
const Inventory = () => {
  const columns = [
    { field: "itemId", headerName: "Item ID", width: 70, flex: 1 },
    { field: "ingredientId", headerName: "Ingredeint ID", width: 130, flex: 1 },
    { field: "name", headerName: "Name", width: 130, flex: 1 },
    { field: "count", headerName: "Count", type: "number", width: 90, flex: 1 },
    {
      field: "fillLevel",
      headerName: "Fill Level",
      type: "number",
      width: 90,
      flex: 1,
    },
    {
      field: "quantityPerUnit",
      headerName: "Quantity Per Unit",
      type: "number",
      width: 90,
      flex: 1,
    },
  ];

  // const rows = [
  //   {
  //     id: item.item_id,
  //     ingredientId: item.ingredient_id,
  //     name: item.name,
  //     count: item.count,
  //     fillLevel: item.fill_level,
  //     quantityPerUnit: item.quantity_per_unit,
  //   },
  // ];

  const [data, setData] = useState([]);

  useEffect(() => {
    const inventoryItems = async () => {
      try {
        const response = await axios.get("http://localhost:4000/inventory");
        const jsonVals = await response.data;
        console.log("Working");
        console.log(jsonVals.data.table);
        const rowsWithId = jsonVals.data.table.rows.map(
          (item, ingredient_id) => ({
            id: ingredient_id,
            itemId: item.item_id,
            ingredientId: item.ingredient_id,
            name: item.name,
            count: item.count,
            fillLevel: item.fill_level,
            quantityPerUnit: item.quantity_per_unit,
          })
        );
        setData(rowsWithId);
      } catch (err) {
        console.log("ERROR");
        console.error(err.message);
      }
    };

    inventoryItems();
  }, []);

  return (
    <div>
      <h1>Inventory Page</h1>

      <div style={{ height: 400, width: "80vw" }}>
        <DataGrid rows={data} columns={columns} columnBuffer={2} />
      </div>

      {/* <table>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Ingredient ID</th>
              <th>Name</th>
              <th>Count</th>
              <th>Fill Level</th>
              <th>Quantity Per Unit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.item_id}</td>

                <td>{item.ingredient_id}</td>

                <td>{item.name}</td>
                <td>{item.count}</td>
                <td>{item.fill_level}</td>
                <td>{item.quantity_per_unit}</td>
              </tr>
            ))}
          </tbody>
        </table> */}
    </div>
  );
};

export default Inventory;
