import React from "react";
import {
  Box,
  Button,
  Container,
  ListItemButton,
  Typography,
  styled,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Add } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar";
import Feed from "../components/Feed";
import { Navbar } from "../components/Navbar";
import Stack from "@mui/material/Stack";

const ManagerView = () => {
  const CustomButton = styled(ListItemButton)(({ theme }) => ({
    backgroundColor: "#8b9477",
    color: "black",
    margin: 5,
    "&:hover": { backgroundColor: "lightblue" },
    "&:disabled": { backgroundColor: "gray", color: "white" },
  }));
  return (
    <Stack spacing={2}>
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
  );
};

export default ManagerView;
