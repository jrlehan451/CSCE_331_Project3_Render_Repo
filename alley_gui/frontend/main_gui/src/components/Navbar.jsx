import { AppBar, Toolbar, Typography, styled } from "@mui/material";
import React from "react";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

export const Navbar = () => {
  return (
    <AppBar position="stick">
      <StyledToolbar>
        <Typography variant="h6">VASU DEV</Typography>
      </StyledToolbar>
    </AppBar>
  );
};
