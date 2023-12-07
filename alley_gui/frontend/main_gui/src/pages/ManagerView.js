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
import "../pages/ManagerView.css";

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
    translateFeature.style.display = "none";
    const translateReplace = document.querySelector(".translateNotAvailable");
    translateReplace.style.display = "block";
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

  const route = (location) => {
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("Manager", location);
  }

  protection();

  return (
    <div className="manager-page">
      <h1 className="manager-title" onMouseOver={(e) => handleHover(e, isHoverEnabled)} onMouseOut={handleMouseOut}> Manager Page</h1>
      <button className="home-button" onMouseOver={(e) => handleHover(e, isHoverEnabled)} onMouseOut={handleMouseOut} onClick={returnHome} >
        <img src={HomeButton} alt="home" />
      </button>
      <div className="manager-button-panel"> 
        <button className="manager-button" onClick={() => route("AnalyzeTrends")} onMouseOver={(e) => handleHover(e, isHoverEnabled)} onMouseOut={handleMouseOut}> Analyze Trends</button>
        <button className="manager-button" onClick={() => route("Inventory")} onMouseOver={(e) => handleHover(e, isHoverEnabled)} onMouseOut={handleMouseOut}> Inventory</button>
        <button className="manager-button" onClick={() => route("Ingredients")} onMouseOver={(e) => handleHover(e, isHoverEnabled)} onMouseOut={handleMouseOut}> Ingredients</button>
        <button className="manager-button" onClick={() => route("MenuItems")} onMouseOver={(e) => handleHover(e, isHoverEnabled)} onMouseOut={handleMouseOut}> Menu Items</button>
        <button className="manager-button" onClick={() => route("SupplyReorder")} onMouseOver={(e) => handleHover(e, isHoverEnabled)} onMouseOut={handleMouseOut}> Supply Reorder</button>
      </div>
    </div>
  );
};

export default ManagerView;
