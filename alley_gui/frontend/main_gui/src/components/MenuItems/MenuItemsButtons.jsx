import { TextField, FormControl, InputLabel, styled } from "@mui/material";
import Button from "@mui/material/Button";
import "./MenuItems.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItemPopup from "./MenuItemsPopup";

// Button style
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

const MenuItemsButtons = ({onReload}) => {
  const [reloadTable, setReloadTable] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Used to store input values
  const [values, setValues] = useState({
    drinkID: "",
    drinkName: "",
    drinkCost: "",
    drinkCategory: "",
    addOnID: "",
    addOnName: "",
    addOnCost: "",
  });

  // Used to keep track of input errors
  const [inputErrors, setInputErrors] = useState({
    itemId: false,
    name: false,
    amount: false,
    quantityPerUnit: false,
  });

  // Verify the input on the text box is of a valid format
  const handleNumberInputChange = (e, key) => {
    const newValue = e.target.value;
  
    // Check if the entered value is a valid integer or float
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
 const handleAddDrink = (e) => {
  let errorfound = false;
  console.log("Add Drink clicked", values);
  if (values.drinkID != "" && values.drinkName != "" && values.drinkCost != "" && values.drinkCost != "") {
    e.preventDefault();
    axios
    .post("http://localhost:4000/addDrink", values)
    .then((res) => {
      if (res.data.status === "success") {
        console.log(res.data.message);
      } else {
        console.error(res.data.message);
      }
    })
    .catch((err) => {
      errorfound = true;
      console.error("Error:", err);
      alert("Error: Entered existing Drink ID");
    });
  }
  else{
    errorfound = true;
    alert("Please fill in all required fields: Drink ID, Drink Name, Drink Cost, and Drink Category");
  }
  
  if(!errorfound){
    onReload();
    //Activate pop up
    setOpenPopup(true);
  }
  console.log("Add Drink clicked", values);
};


// Function to handle selected ingredients from the popup
const handleSelectIngredients = (selectedIngredients) => {
  setSelectedIngredients(selectedIngredients);
  setOpenPopup(false); 
};

// Function to handle button clicks for updating drinks
const handleUpdateDrink = (e) => {
  // Check if input is valid
  if(values.drinkID == ""){
    alert("Error: Enter valid Drink ID")
  }
  if(values.drinkCost == "" && values.drinkName == "" && values.drinkCategory == ""){
    alert("Error: Enter at least 1 value to update (name, cost, category)");
  }
  // Backend call
  if (values.drinkName != "" && values.drinkID != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/updateMenuItemName", values)
      .then((res) => {
        const rowCountTwo = res.data.rowCount;
        if (res.data.status === "success") {
          console.log(res.data.message);
        } else {
          console.error(res.data.message);
        }
        if(rowCountTwo == 0){
          alert("Error: Drink ID not found");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
  if (values.drinkCost != "" && values.drinkID != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/updateMenuItemCost", values)
      .then((res) => {
        const rowCountTwo = res.data.rowCount;
        if (res.data.status === "success") {
          console.log(res.data.message);
        } else {
          console.error(res.data.message);
        }
        if(rowCountTwo == 0){
          alert("Error: Drink ID not found");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
  if (values.drinkCategory != "" && values.drinkID != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/updateMenuItemCategory", values)
      .then((res) => {
        const rowCountTwo = res.data.rowCount;
        if (res.data.status === "success") {
          console.log(res.data.message);
        } else {
          console.error(res.data.message);
        }
        if(rowCountTwo == 0){
          alert("Error: Drink ID not found");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
  onReload();
  console.log("Update Drink clicked", values);
};

// Function to handle button clicks for deleting drinks
const handleDeleteDrink = (e) => {
  if(values.drinkID != ""){
    e.preventDefault();
    axios
    .post("http://localhost:4000/deleteDrink", values)
    .then((res) => {
      const rowCountTwo = res.data.rowCount;
      if (res.data.status === "success") {
        console.log(res.data.message);
      } else {
        console.error(res.data.message);
      }
      if(rowCountTwo == 0){
        alert("Error: Drink ID not found");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
    });
    onReload();
  }
  else{
    alert("Error: Enter a drink ID");
  }
};


 // Function to handle button clicks for adding add on
 const handleAddAddOn = (e) => {
  console.log("Add Drink clicked", values);
  if (values.addOnID != "" && values.addOnName != "" && values.addOnCost != "") {
    e.preventDefault();
    axios
    .post("http://localhost:4000/addAddOn", values)
    .then((res) => {
      if (res.data.status === "success") {
        console.log(res.data.message);
      } else {
        console.error(res.data.message);
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Error: Entered existing Add On ID");
    });
  }
  else{
    alert("Please fill in all required fields: Add On ID, Add On Name, and Add On Cost");
  }
  onReload();
  
};

// Function to handle button clicks for updating add ons
const handleUpdateAddOn = (e) => {
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
          console.log(res.data.message);
        } else {
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
          console.log(res.data.message);
        } else {
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
  onReload();
};

// Function to handle button clicks for deleting add ons
const handleDeleteAddOn = (e) => {
  if (values.addOnID != "") {
    e.preventDefault();
    axios
      .post("http://localhost:4000/deleteAddOn", values)
      .then((res) => {
        const rowCount = res.data.rowCount;
        if (res.data.status === "success") {
          console.log(res.data.message);
        } else {
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
  onReload();
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
        <MenuItemPopup
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          onSelectIngredients={handleSelectIngredients}  
          values={{ drinkID: values.drinkID }}
        />
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