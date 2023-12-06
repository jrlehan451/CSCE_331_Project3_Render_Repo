import React from "react";
import { Box, ListItemButton, styled } from "@mui/material";

import Stack from "@mui/material/Stack";
import HomeButton from './images/HomeButton.png';

import '../components/MenuItems/MenuItems.css'

import {useAuth0} from '@auth0/auth0-react';



const CustomButton = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: "#8b9477",
  color: "black",
  margin: 10,
  borderRadius: "8px",
  width: "350px",
  minHeight: "40px",
  maxHeight: "60px",
  "&:hover": { backgroundColor: "lightblue" },
  "&:disabled": { backgroundColor: "gray", color: "white" },
}));

const ManagerView = () => {
  const {logout} = useAuth0();

  const returnHome = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  };
  
  return (

    <ThemeProvider theme={theme}>
      {/* <h1 className = "title2"> Manager Page</h1> */}
   
      <Box className="managerBox">
        <h1 className = "title2"> Manager Page</h1>

        <button className="home-button" onClick={returnHome}> 
            <img src={HomeButton} alt="home" />
        </button>
        <Stack
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CustomButton className="managerLink" Link to="/AnalyzeTrends">
            Analyze Trends
          </CustomButton>
          <CustomButton className="managerLink" Link to="/Inventory">
            Inventory
          </CustomButton>
          <CustomButton className="managerLink" Link to="/Ingredients">
            Ingredients
          </CustomButton>
          <CustomButton className="managerLink" Link to="/MenuItems">
            Menu Items
          </CustomButton>
          <CustomButton className="managerLink" Link to="/SupplyReorder">
            Supply Reorders
          </CustomButton>

     
        </Stack>
      </Box>
  );
};

export default ManagerView;
