import React from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Add } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar";
import Feed from "../components/Feed";
import { Navbar } from "../components/Navbar";

const ManagerView = () => {
  const BlueButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.otherColor.main,
    color: "#888",
    margin: 5,
    "&:hover": { backgroundColor: "lightblue" },
    "&:disabled": { backgroundColor: "gray", color: "white" },
  }));
  return (
    <Box>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Navbar />
        <Sidebar />
        <Feed />
        <Rightbar />
      </Stack>

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

      <BlueButton>My Button</BlueButton>
      <BlueButton>Another Button</BlueButton>

      <Button
        startIcon={<Add />}
        variant="outlined"
        color="otherColor"
        size="larges"
      >
        Add new Post
      </Button> */}
    </Box>
  );
};

export default ManagerView;
