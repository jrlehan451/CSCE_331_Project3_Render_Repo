import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, FormControl, InputLabel, TextField } from '@mui/material';
import MenuItemsTable from './MenuItemsTable';
import MenuItemsButton from './MenuItemsButtons';
import MenuItemsPopUp from './MenuItemsPopup';
import NavBar from './NavBar';
import './MenuItems.css';



const MenuItems = () => {
    //return <div>Menu Items</div>;
    console.log("ba");
    return (
        <div className="MenuItemsPage">
          <NavBar />
          <div className="title">
            <h1>Menu Items</h1>
          </div>
          <MenuItemsTable />
        </div>
      );
};


export default MenuItems;
