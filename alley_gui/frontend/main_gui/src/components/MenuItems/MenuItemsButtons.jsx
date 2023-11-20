// Import necessary components from MUI
import { TextField, FormControl, InputLabel, styled } from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import "./MenuItems.css";

// Define a styled button
const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ffefe2",
  border: "2px solid #9e693f", 
  color: "#9e693f",
  fontWeight: "bold",
  margin: 10,
  marginTop: 25,
  borderRadius: "80px",
  width: "150px",
  minHeight: "40px",
  maxHeight: "60px",
  "&:hover": { backgroundColor: "lightblue" },
  "&:disabled": { backgroundColor: "gray", color: "white" },
}));

const MenuItemsButtons = () => {
  return (
    <div> 
        <div className="menuItemsButtonsContainer">
        {/* Three text boxes */}
        <div className="textboxContainer">
          <div>
            <InputLabel htmlFor="drinkIdButton">Drink ID</InputLabel>
            <FormControl>
              <TextField id="drinkIDButton" variant="filled" size= "small" />
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="drinkNameButton">Name</InputLabel>
            <FormControl>
              <TextField id="drinkNameButton" variant="filled" size= "small" />
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="drinkCostButton">Cost</InputLabel>
            <FormControl>
              <TextField id="drinkCostButton" variant="filled" size= "small" />
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="drinkCategoryButton">Category</InputLabel>
            <FormControl>
              <TextField id="drinkCategoryButton" variant="filled" size= "small" />
            </FormControl>
          </div>
          {/* Add two more text boxes as needed */}
        </div>

        {/* Three buttons */}
        <div style={{ display: "flex", gap: "5px" }}>
          <CustomButton>Add Drink </CustomButton>
          <CustomButton>Update Drink</CustomButton>
          <CustomButton>Delete Drink</CustomButton>
        </div>
        {/* Add any additional elements/buttons as needed */}
      </div>


      <div className="menuItemsButtonsContainer">
        {/* Three text boxes */}
        <div className="textboxContainer">
          <div>
            <InputLabel htmlFor="addOnIdButton">Add On ID</InputLabel>
            <FormControl>
              <TextField id="addOnIdButton" variant="filled" size= "small"/>
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="addOnNameButton">Name</InputLabel>
            <FormControl>
              <TextField id="addOnNameButton" variant="filled" size= "small"/>
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="addOnCostButton">Cost</InputLabel>
            <FormControl>
              <TextField id="addOnCostButton" variant="filled" size= "small"/>
            </FormControl>
          </div>
          {/* Add two more text boxes as needed */}
        </div>

        {/* Three buttons */}
        <div style={{ display: "flex", gap: "5px" }}>
          <CustomButton>Add Add On </CustomButton>
          <CustomButton>Update Add On</CustomButton>
          <CustomButton>Delete Add On</CustomButton>
        </div>
        {/* Add any additional elements/buttons as needed */}
      </div>
    </div>
    
    
  );
};

export default MenuItemsButtons;
