import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, FormControl, InputLabel, TextField } from "@mui/material";
import MenuItemsTable from "./MenuItemsTable";
import MenuItemsButton from "./MenuItemsButtons";
import MenuItemsPopUp from "./MenuItemsPopup";
import NavBar from "./NavBar";
import "./MenuItems.css";

import HoverableElement from '../MagnifyingScreen/MagnifierComponent';

import TextToSpeech from "../TextToSpeech";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../SpeechUtils";

/**
 * @description This component displays the page with the two menu tables 
 * and the CRUD operations for the drinks and add-ons tables.
 * @component MenuItems
 * @param {*} isHoverEnabled
 * @param {*} setIsHoverEnabled
 * @returns display of menu items page
 */
const MenuItems = ({ isHoverEnabled, setIsHoverEnabled }) => {
  //Constant used to reload tables after function
  const [reloadTable, setReloadTable] = useState(false);

    /**
     * @function handleTableReload
     * @description updates the state and triggers a re-render of the table
     */
    const handleTableReload = () => {
        setReloadTable(!reloadTable);
    };

  useEffect(() => {
    // This effect will be triggered every time reloadTable changes
    // Implement logic to fetch updated data and refresh the table
    console.log("Table reloaded");
  }, [reloadTable]);

  useEffect(() => {
    const protection = async () => {
      const role = localStorage.getItem("Role");
      switch(role){
        case "Manager":
            break;
        default:
          window.location.href = window.location.origin;
          break;
      }
    };

    protection();
  });


  //Collection of all pages and reload elements
  return (
    
    <div className="MenuItemsPage">
      <NavBar />
      <div className="title">
        <h1>Menu Items</h1>
      </div>
      <div className="tablesContainer">
      <MenuItemsTable
          reloadTable={reloadTable}
          isHoverEnabled={isHoverEnabled}
          setIsHoverEnabled={setIsHoverEnabled}
        />
        <MenuItemsButton
          onReload={handleTableReload}
          isHoverEnabled={isHoverEnabled}
          setIsHoverEnabled={setIsHoverEnabled}
        />
      </div>
      
    </div>
  );
  
};

export default MenuItems;
