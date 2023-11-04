import React from "react";
import { Button, Typography, styled } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Add } from "@mui/icons-material";

const ManagerView = () => {
  const BlueButton = styled(Button)({
    backgroundColor: "skyblue",
    color: "#888",
    margin: 5,
    "&:hover": { backgroundColor: "lightblue" },
    "&:disabled": { backgroundColor: "gray", color: "white" },
  });
  return (
    <div>
      <Typography variant="h1">Manager View</Typography>
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
        color="success"
        size="larges"
      >
        Add new Post
      </Button>
    </div>
  );
};

export default ManagerView;
