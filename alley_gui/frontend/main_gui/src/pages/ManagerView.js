import React from "react";
import {
  Box,
  Button,
  Container,
  ListItemButton,
  Typography,
  styled,
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";

import Stack from "@mui/material/Stack";
import { theme } from "../theme";

const ManagerView = () => {
  const CustomButton = styled(ListItemButton)(({ theme }) => ({
    backgroundColor: "#8b9477",
    color: "black",
    margin: 5,
    borderRadius: "8px",
    "&:hover": { backgroundColor: "lightblue" },
    "&:disabled": { backgroundColor: "gray", color: "white" },
  }));
  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",
          padding: "100px",
          flex: 1,
        }}
      >
        <Stack
          style={{
            flex: 1,
          }}
          spacing={2}
        >
          <CustomButton>Analyze Trends</CustomButton>
          <CustomButton>Inventory</CustomButton>
          <CustomButton>Ingredients</CustomButton>
          <CustomButton>Menu Items</CustomButton>
          <CustomButton>Supply Reorders</CustomButton>

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
