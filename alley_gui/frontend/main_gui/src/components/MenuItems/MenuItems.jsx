import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { MagnifierContext } from '../MagnifyingScreen/MagnifierComponent';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, FormControl, InputLabel, TextField } from "@mui/material";
import MenuItemsTable from "./MenuItemsTable";
import MenuItemsButton from "./MenuItemsButtons";
import MenuItemsPopUp from "./MenuItemsPopup";
import NavBar from "./NavBar";
import "./MenuItems.css";
import TextToSpeech from "../TextToSpeech";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../SpeechUtils";

const MenuItems = () => {
  //Constant used to reload tables after function
  const [reloadTable, setReloadTable] = useState(false);

    const { isMagnifierEnabled, toggleMagnifier } = useContext(MagnifierContext);

    // Function to update the state and trigger a re-render of the table
    const handleTableReload = () => {
        setReloadTable(!reloadTable);
    };

  // Function to update the state and trigger a re-render of the table
  const handleTableReload = () => {
    setReloadTable(!reloadTable);
  };

  useEffect(() => {
    // This effect will be triggered every time reloadTable changes
    // Implement logic to fetch updated data and refresh the table
    console.log("Table reloaded");
  }, [reloadTable]);

  //Collection of all pages and reload elements
  return (
    <div className="MenuItemsPage">
      <NavBar />
      <div className="title">
        <h1>Menu Items</h1>
      </div>
      <div className="tablesContainer">
        <MenuItemsTable reloadTable={reloadTable} />
        <MenuItemsButton onReload={handleTableReload} />
      </div>
    </div>
  );

    const highContrastMode = () => {
      const body = document.querySelector('body');
      if (body.classList.contains("contrast")) {
        body.classList.remove("contrast");
        document.body.style.backgroundColor = '#ffefe2';
        sessionStorage.setItem("high_contrast_mode", false);
      } else {
        body.classList.add("contrast");
        document.body.style.backgroundColor = 'black';
        sessionStorage.setItem("high_contrast_mode", true);
      }
    }
  
    const loadCurrentMode = () => {
      if (sessionStorage.getItem("high_contrast_mode")) {
        const body = document.querySelector('body');
        if (body.classList.contains("contrast") == false) {
          body.classList.add("contrast");
          document.body.style.backgroundColor = 'black';
        }
      } else {
        const body = document.querySelector('body');
        body.classList.remove("contrast");
        document.body.style.backgroundColor = '#ffefe2';
      }
    }

    useEffect(() => {
        // This effect will be triggered every time reloadTable changes
        // Implement logic to fetch updated data and refresh the table
        console.log("Table reloaded");
      }, [reloadTable]);

      //Collection of all pages and reload elements
      return (
        <div className="MenuItemsPage" onLoad={() => loadCurrentMode()}>
        <button onClick={highContrastMode}>test</button>
          <NavBar />
          <div className="title">
            <h1>Menu Items</h1>
          </div>
          
          <div className="tablesContainer">
            <MenuItemsTable reloadTable={reloadTable}/>
            <MenuItemsButton onReload={handleTableReload}/>
            
        </div>
        </div>
      );
};

export default MenuItems;
