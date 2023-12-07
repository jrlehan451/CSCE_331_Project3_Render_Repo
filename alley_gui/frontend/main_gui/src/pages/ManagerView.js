import { Box, ListItemButton, styled } from "@mui/material";
import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import HomeButton from "./images/HomeButton.png";

import "../components/MenuItems/MenuItems.css";

import { useAuth0 } from "@auth0/auth0-react";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";

/**
 * @function CustomerButtonManagerView
 * @description adds specifications for customer button on the manager view
 */
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

/**
 * @component ManagerView
 * @description This component displays the manager view homepage. It allows navigation
 * to all pages only accessibly by the manager view.
 * @returns display of manager view home page
 */
const ManagerView = (props) => {
  const { logout } = useAuth0();

  const { isHoverEnabled, handleToggleHover } = props;
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false);

  useEffect(() => {
    const translateFeature = document.querySelector(".translate");
    translateFeature.style.display = 'none';
    const translateReplace = document.querySelector(".translateNotAvailable")
    translateReplace.style.display = 'block';
  }, []);

  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
    //handleToggleHover();
  };

  const handleGridCellHover = (params) => {
    console.log("igredient handleGridCellHover is called!");

    if (isHoverEnabled) {
      console.log("isHoverEnabled is false");

      const cellContent = params.value.toString();
      console.log("Cell Content:", cellContent);

      // Call the handleHover function to initiate text-to-speech
      handleTableFieldSpeech(cellContent);
      //handleTableFieldSpeech("This is a test");
    }
  };

  const returnHome = () => {
    localStorage.setItem("Role", "");
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const protection = async () => {
    const role = localStorage.getItem("Role");
    switch (role) {
      case "Manager":
        break;
      default:
        window.location.href = window.location.origin;
        break;
    }
  };

  protection();

  return (
    <Box className="managerBox">
      <h1
        className="title2"
        onMouseOver={(e) => handleHover(e, isHoverEnabled)}
        onMouseOut={handleMouseOut}
      >
        {" "}
        Manager Page
      </h1>

      <button
        className="home-button"
        onMouseOver={(e) => handleHover(e, isHoverEnabled)}
        onMouseOut={handleMouseOut}
        onClick={returnHome}
      >
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
        <CustomButton
          className="managerLink"
          Link
          to="/AnalyzeTrends"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Analyze Trends
        </CustomButton>
        <CustomButton
          className="managerLink"
          Link
          to="/Inventory"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Inventory
        </CustomButton>
        <CustomButton
          className="managerLink"
          Link
          to="/Ingredients"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Ingredients
        </CustomButton>
        <CustomButton
          className="managerLink"
          Link
          to="/MenuItems"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Menu Items
        </CustomButton>
        <CustomButton
          className="managerLink"
          Link
          to="/SupplyReorder"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Supply Reorders
        </CustomButton>
      </Stack>
    </Box>
  );
};

export default ManagerView;
