// Import necessary components from MUI
import { TextField, FormControl, InputLabel, styled } from "@mui/material";
import Button from "@mui/material/Button";
//import React from "react";
import "./MenuItems.css";
import React, { useState, useEffect } from "react";
import axios from "axios";


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
  // State to manage input values
  const [values, setValues] = useState({
    drinkID: "",
    drinkName: "",
    drinkCost: "",
    drinkCategory: "",
    addOnID: "",
    addOnName: "",
    addOnCost: "",
  });

  const [inputErrors, setInputErrors] = useState({
    itemId: false,
    name: false,
    amount: false,
    quantityPerUnit: false,
  });

// const handleNumberInputChange = (e, key) => {
//     // Allow only valid integers in the input
//     const newValue = parseInt(e.target.value, 10);

//     if (!isNaN(newValue)) {
//       setValues({ ...values, [key]: newValue });
//       setInputErrors({ ...inputErrors, [key]: false });
//     } else {
//       setInputErrors({ ...inputErrors, [key]: true });
//     }
//   };

  const handleNumberInputChange = (e, key) => {
    const newValue = e.target.value;
  
    // Check if the entered value is a valid integer
    const isValidInteger = /^[0-9]*$/.test(newValue);
  
    if (isValidInteger || newValue === "") {
      setValues({ ...values, [key]: newValue });
      setInputErrors({ ...inputErrors, [key]: false });
    } else {
      setInputErrors({ ...inputErrors, [key]: true });
    }
  };

 // Function to handle button clicks for adding drinks
 const handleAddDrink = () => {
  // Implement logic to add a drink based on inputValues.drinkID, inputValues.drinkName, etc.
  // You can use the inputValues state to send data to your backend or perform other actions
  console.log("Add Drink clicked", values);
};

// Function to handle button clicks for updating drinks
const handleUpdateDrink = (e) => {
  // Implement logic to update a drink based on inputValues.drinkID, inputValues.drinkName, etc.
  if (values.drinkName != "" && values.drinkID != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/updateMenuItemName", values)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
  if (values.drinkCost != "" && values.drinkID != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/updateMenuItemCost", values)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
  if (values.drinkCategory != "" && values.drinkID != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/updateMenuItemCategory", values)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
  
  console.log("Update Drink clicked", values);
};

// Function to handle button clicks for deleting drinks
const handleDeleteDrink = (e) => {
  // Implement logic to delete a drink based on inputValues.drinkID, inputValues.drinkName, etc.
  e.preventDefault();
  axios
  .post("http://localhost:4000/deleteDrink", values)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

  axios
  .post("http://localhost:4000/deleteDrinks", values)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
  console.log("Delete Drink clicked", values);
  //onReload();
};



  return (
    <div> 
        <div className="menuItemsButtonsContainer">
        {/* Three text boxes */}
        <div className="textboxContainer">
          <div>
            <InputLabel htmlFor="drinkIdButton">Drink ID</InputLabel>
            <FormControl>
              <TextField 
                id="drinkIDButton" 
                variant="filled" 
                size= "small" 
                onChange={(e) => handleNumberInputChange(e, "drinkID")}
                
                 type="text"
                // //inputProps={{ pattern: "[0-9]*" }}  // Allow only numbers
                 error={inputErrors.drinkID}
                 helperText={
                   inputErrors.itemId ? "Please enter a valid integer" : ""
                 }
                 value={values.drinkID}
                />
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="drinkNameButton">Name</InputLabel>
            <FormControl>
              <TextField 
              id="drinkNameButton" 
              variant="filled" 
              size= "small" 
              onChange={(e) =>
                setValues({ ...values, drinkName: e.target.value })
              }
              
              />
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="drinkCostButton">Cost</InputLabel>
            <FormControl>
              <TextField 
              id="drinkCostButton" 
              variant="filled" 
              size= "small" 
              onChange={(e) => handleNumberInputChange(e, "drinkCost")}
                
              type="text"
              error={inputErrors.drinkID}
              helperText={
               inputErrors.itemId ? "Please enter a valid integer" : ""
               }
               value={values.drinkCost}
              />
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="drinkCategoryButton">Category</InputLabel>
            <FormControl>
              <TextField 
              id="drinkCategoryButton" 
              variant="filled" 
              size= "small" 
              onChange={(e) =>
                setValues({ ...values, drinkCategory: e.target.value })
              }
              
              />
            </FormControl>
          </div>
          {/* Add two more text boxes as needed */}
        </div>

        {/* Three buttons */}
        <div style={{ display: "flex", gap: "5px" }}>
          <CustomButton onClick={handleAddDrink}>Add Drink </CustomButton>
          <CustomButton onClick={handleUpdateDrink}>Update Drink</CustomButton>
          <CustomButton onClick={handleDeleteDrink}>Delete Drink</CustomButton>
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
