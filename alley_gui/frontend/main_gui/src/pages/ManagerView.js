import React from "react";
import { Box, ListItemButton, styled } from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";

import Stack from "@mui/material/Stack";
import { theme } from "../theme";
import HomeButton from './images/HomeButton.png';
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
      <Box
        style={{
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",

          justifyContent: "center",
          alignItems: "center",

          padding: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
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
          <CustomButton Link to="/AnalyzeTrends">
            Analyze Trends
          </CustomButton>
          <CustomButton Link to="/Inventory">
            Inventory
          </CustomButton>
          <CustomButton Link to="/Ingredients">
            Ingredients
          </CustomButton>
          <CustomButton Link to="/MenuItems">
            Menu Items
          </CustomButton>
          <CustomButton Link to="/SupplyReorder">
            Supply Reorders
          </CustomButton>

          {/*<Box>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Navbar />
        <Sidebar />
        <Feed />
        <Rightbar />
      </Stack>
      </Box>
  */}

          {/* <Typography variant="h1">Manager View</Typography>
      <Button variant="text">Text</Button>
      <Button
        startIcon={<SettingsIcon />}
        variant="contained"
        color="secondary"
        size="small"
      >
        contained
      </Button>

      <CustomButton>My Button</CustomButton>
      <CustomButton>Another Button</CustomButton>

      <Button
        startIcon={<Add />}
        variant="outlined"
        color="otherColor"
        size="larges"
      >
        Add new Post
      </Button> */}
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default ManagerView;
