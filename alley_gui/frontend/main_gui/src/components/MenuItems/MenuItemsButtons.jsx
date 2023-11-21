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

  const handleNumberInputChange = (e, key) => {
    const newValue = e.target.value;
  
    // Check if the entered value is a valid integer
    const isValidInteger = /^[0-9]*$/.test(newValue);
    const isValidFloat = /^\d*\.?\d*$/.test(newValue);
  
    if (isValidInteger || newValue === "") {
      setValues({ ...values, [key]: newValue });
      setInputErrors({ ...inputErrors, [key]: false });
    } 
    else if((key == "addOnCost" || key == "drinkCost") && isValidFloat){
      setValues({ ...values, [key]: newValue });
      setInputErrors({ ...inputErrors, [key]: false });
    }
    else {
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


 // Function to handle button clicks for adding drinks
 const handleAddAddOn = (e) => {
  // Implement logic to add a drink based on inputValues.drinkID, inputValues.drinkName, etc.
  // You can use the inputValues state to send data to your backend or perform other actions
  console.log("Add Drink clicked", values);
  if (values.addOnID != "" && values.addOnName != "" && values.addOnCost != "") {
    e.preventDefault();

    axios
    .post("http://localhost:4000/addAddOn", values)
    .then((res) => {
      if (res.data.status === "success") {
        // Handle success (e.g., show a success message)
        console.log(res.data.message);
      } else {
        // Handle error (e.g., show an error message to the user)
        console.error(res.data.message);
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Error: Entered existing Add On ID");
    });

    // axios
    //   .post("http://localhost:4000/addAddOn", values)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  }
  else{
    alert("Please fill in all required fields: Add On ID, Add On Name, and Add On Cost");
  }
  
};

// Function to handle button clicks for updating drinks
const handleUpdateAddOn = (e) => {
  // Implement logic to update a drink based on inputValues.drinkID, inputValues.drinkName, etc.
  if(values.addOnID == ""){
    alert("Enter Add On ID to update");
  }
  if(values.addOnCost == "" && values.addOnName == ""){
    alert("Enter Add On Name and/or Add On Cost to update");
  }
  if (values.addOnID != "" && values.addOnCost != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/updateAddOnCost", values)
      .then((res) => {
        const rowCountTwo = res.data.rowCount;
        if (res.data.status === "success") {
          // Handle success (e.g., show a success message)
          console.log(res.data.message);
        } else {
          // Handle error (e.g., show an error message to the user)
          console.error(res.data.message);
        }
        if(rowCountTwo == 0){
          alert("Error: Add On ID not found");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });

  }
  if (values.addOnID != "" && values.addOnName != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/updateAddOnName", values)
      .then((res) => {
        const rowCount = res.data.rowCount;
        if (res.data.status === "success") {
          // Handle success (e.g., show a success message)
          console.log(res.data.message);
        } else {
          // Handle error (e.g., show an error message to the user)
          console.error(res.data.message);
        }
        if(rowCount == 0){
          alert("Error: Add On ID not found");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
      
  }
  console.log("Update Drink clicked", values);
};

// Function to handle button clicks for deleting drinks
const handleDeleteAddOn = (e) => {
  // Implement logic to delete a drink based on inputValues.drinkID, inputValues.drinkName, etc.

  if (values.addOnID != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/deleteAddOn", values)
      .then((res) => {
        const rowCount = res.data.rowCount;
        if (res.data.status === "success") {
          // Handle success (e.g., show a success message)
          console.log(res.data.message);
        } else {
          // Handle error (e.g., show an error message to the user)
          console.error(res.data.message);
        }
        if(rowCount == 0){
          alert("Error: Add On ID not found");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Error: Entered existing Add On ID");
      });
  }
  else{
    alert("Error: Please enter valid Add On ID");
  }
  
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
              error={inputErrors.drinkCost}
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
              <TextField 
              id="addOnIdButton" 
              variant="filled" 
              size= "small"
              onChange={(e) => handleNumberInputChange(e, "addOnID")}
              type="text"
              error={inputErrors.addOnID}
              helperText={
               inputErrors.itemId ? "Please enter a valid integer" : ""
               }
               value={values.addOnID}
              />
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="addOnNameButton">Add On Name</InputLabel>
            <FormControl>
              <TextField 
              id="addOnNameButton" 
              variant="filled" 
              size= "small"
              onChange={(e) =>
                setValues({ ...values, addOnName: e.target.value })
              }
              />
            </FormControl>
          </div>
          <div>
            <InputLabel htmlFor="addOnCostButton">Add On Cost</InputLabel>
            <FormControl>
              <TextField 
              id="addOnCostButton" 
              variant="filled" 
              size= "small"
              type="text"
              //value={values.addOnCost}
              onChange={(e) => handleNumberInputChange(e, "addOnCost")}
              
              error={inputErrors.addOnCost}
              // helperText={
              //  inputErrors.itemId ? "Please enter a valid float value" : ""
              //  }
              value={values.addOnCost}
              />
            </FormControl>
          </div>
          {/* Add two more text boxes as needed */}
        </div>

        {/* Three buttons */}
        <div style={{ display: "flex", gap: "5px" }}>
          <CustomButton onClick={handleAddAddOn}>Add Add On </CustomButton>
          <CustomButton onClick={handleUpdateAddOn}>Update Add On</CustomButton>
          <CustomButton onClick={handleDeleteAddOn}>Delete Add On</CustomButton>
        </div>
        {/* Add any additional elements/buttons as needed */}
      </div>
    </div>
    
    
  );
};

export default MenuItemsButtons;
