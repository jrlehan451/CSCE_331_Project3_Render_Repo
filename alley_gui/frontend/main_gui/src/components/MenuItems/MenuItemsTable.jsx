import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import './MenuItems.css';

const MenuItemsTable = () => {
  const [menuItemsData, setMenuItemsData] = useState([]);
  const [addOnsData, setAddOnsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for menu items
        const menuItemsResponse = await axios.get("http://localhost:4000/menuItems");
        const menuItemsRows = menuItemsResponse.data.data.table.rows.map((item, id) => ({
          id,
          drink_id: item.drink_id,
          name: item.name,
          cost: item.cost,
          category: item.category,
        }));
        setMenuItemsData(menuItemsRows);

        // Fetch data for add-ons
        const addOnsResponse = await axios.get("http://localhost:4000/addOns");
        const addOnsRows = addOnsResponse.data.data.table.rows.map((item, id) => ({
          id,
          ingredient_id: item.ingredient_id,
          name: item.name,
          cost: item.cost,
        }));
        setAddOnsData(addOnsRows);
      } catch (error) {
        // Handle errors
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const menuItemsColumns = [
    { field: "drink_id", headerName: "Drink ID", width: 90, flex: 1 },
    { field: "name", headerName: "Name", width: 200, flex: 1 },
    { field: "cost", headerName: "Cost", type: "number", width: 90, flex: 1 },
    { field: "category", headerName: "Category", width: 150, flex: 1 },
  ];

  const addOnsColumns = [
    { field: "ingredient_id", headerName: "Ingredient ID", width: 120, flex: 1 },
    { field: "name", headerName: "Name", width: 200, flex: 1 },
    { field: "cost", headerName: "Cost", type: "number", width: 90, flex: 1 },
  ];

  return (
    <div class = "tablesInfo"> 
      <div style={{ height: 400, width: "45vw", marginBottom: "20px", float: "left" }}>
        <h2>Drinks Table</h2>
        <DataGrid rows={menuItemsData} columns={menuItemsColumns} columnBuffer={2} />
      </div>

      <div style={{ height: 400, width: "45vw", marginBottom: "20px", float: "right" }}>
        <h2>Add-Ons Table</h2>
        <DataGrid rows={addOnsData} columns={addOnsColumns} columnBuffer={2}/>
      </div>
    </div>
  );
};

export default MenuItemsTable;
