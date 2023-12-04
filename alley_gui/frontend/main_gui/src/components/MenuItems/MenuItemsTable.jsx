import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import "./MenuItems.css";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../SpeechUtils";

const MenuItemsTable = ({ reloadTable }) => {
  //Store data
  const [menuItemsData, setMenuItemsData] = useState([]);
  const [addOnsData, setAddOnsData] = useState([]);
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
  };
  const handleGridCellHover = (params) => {
    console.log("handleGridCellHover is called!");

    if (!isHoverEnabled) {
      console.log("isHoverEnabled is false");

      const cellContent = params.value.toString();
      console.log("Cell Content:", cellContent);

      // Call the handleHover function to initiate text-to-speech
      handleTableFieldSpeech(cellContent);
      //handleTableFieldSpeech("This is a test");
    }
  };

  // Get data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for menu items
        const menuItemsResponse = await axios.get(
          "http://localhost:4000/menuItems"
        );
        const menuItemsRows = menuItemsResponse.data.data.table.rows.map(
          (item, id) => ({
            id,
            drink_id: item.drink_id,
            name: item.name,
            cost: item.cost,
            category: item.category,
          })
        );
        setMenuItemsData(menuItemsRows);

        // Fetch data for add-ons
        const addOnsResponse = await axios.get("http://localhost:4000/addOns");
        const addOnsRows = addOnsResponse.data.data.table.rows.map(
          (item, id) => ({
            id,
            ingredient_id: item.ingredient_id,
            name: item.name,
            cost: item.cost,
          })
        );
        setAddOnsData(addOnsRows);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [reloadTable]);

  // Create columns for tables
  const menuItemsColumns = [
    { field: "drink_id", headerName: "Drink ID", width: 90, flex: 1 },
    { field: "name", headerName: "Name", width: 200, flex: 1 },
    { field: "cost", headerName: "Cost", type: "number", width: 90, flex: 1 },
    { field: "category", headerName: "Category", width: 150, flex: 1 },
  ];

  const addOnsColumns = [
    {
      field: "ingredient_id",
      headerName: "Ingredient ID",
      width: 120,
      flex: 1,
    },
    { field: "name", headerName: "Name", width: 200, flex: 1 },
    { field: "cost", headerName: "Cost", type: "number", width: 90, flex: 1 },
  ];

  return (
    <div class="tablesInfo">
      <div
        style={{
          height: 425,
          width: "45vw",
          marginBottom: "20px",
          float: "left",
        }}
      >
        <h2>Drinks Table</h2>
        <DataGrid
          rows={menuItemsData}
          columns={menuItemsColumns.map((column) => ({
            ...column,
            renderCell: (params) => (
              <div
                onMouseOver={() => handleGridCellHover(params)}
                onMouseOut={handleMouseOut}
              >
                {params.value}
              </div>
            ),
          }))}
        />
        {/* DataGrid rows={menuItemsData} columns={menuItemsColumns} columnBuffer={2} /> */}
      </div>

      <div
        style={{
          height: 425,
          width: "45vw",
          marginBottom: "20px",
          float: "right",
        }}
      >
        <h2>Add-Ons Table</h2>
        <DataGrid
          rows={addOnsData}
          columns={addOnsColumns.map((column) => ({
            ...column,
            renderCell: (params) => (
              <div
                onMouseOver={() => handleGridCellHover(params)}
                onMouseOut={handleMouseOut}
              >
                {params.value}
              </div>
            ),
          }))}
        />

        {/* <DataGrid rows={addOnsData} columns={addOnsColumns} columnBuffer={2}/> */}
      </div>
    </div>
  );
};

export default MenuItemsTable;
