import { TextField, FormControl, InputLabel, styled } from "@mui/material";
import Button from "@mui/material/Button";
import "./MenuItems.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItemPopup from "./MenuItemsPopup";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../SpeechUtils";
import TextToSpeech from "../TextToSpeech";
import HoverableElement from '../MagnifyingScreen/MagnifierComponent';
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

const MenuItemsButtons = ({ onReload, isHoverEnabled, handleToggleHover }) => {
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false);
  const [reloadTable, setReloadTable] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
    handleToggleHover();
  };
  const handleGridCellHover = (params) => {
    console.log("handleGridCellHover is called!");

    if (isHoverEnabled) {
      console.log("isHoverEnabled is false");

      const cellContent = params.value.toString();
      console.log("Cell Content:", cellContent);

      // Call the handleHover function to initiate text-to-speech
      handleTableFieldSpeech(cellContent);
      //handleTableFieldSpeech("This is a test");
    }
  };

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
    } else if ((key == "addOnCost" || key == "drinkCost") && isValidFloat) {
      setValues({ ...values, [key]: newValue });
      setInputErrors({ ...inputErrors, [key]: false });
    } else {
      setInputErrors({ ...inputErrors, [key]: true });
    }
  };

  // Function to handle button clicks for adding drinks
  const handleAddDrink = (e) => {
    let errorfound = false;
    console.log("Add Drink clicked", values);
    if (
      values.drinkID != "" &&
      values.drinkName != "" &&
      values.drinkCost != "" &&
      values.drinkCost != ""
    ) {
      e.preventDefault();
      axios
        .post("https://thealley.onrender.com/addDrink", values)
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
    } else {
      errorfound = true;
      alert(
        "Please fill in all required fields: Drink ID, Drink Name, Drink Cost, and Drink Category"
      );
    }

    if (!errorfound) {
      onReload();
      //Activate pop up
      setOpenPopup(true);
    }
    console.log("Add Drink clicked", values);
  };

  // Function to handle button clicks for adding drinks
  // const handleAddDrink = (e) => {
  //   let errorfound = false;
  //   console.log("Add Drink clicked", values);
  //   if (
  //     values.drinkID != "" &&
  //     values.drinkName != "" &&
  //     values.drinkCost != "" &&
  //     values.drinkCost != ""
  //   ) {
  //     e.preventDefault();
  //     axios
  //       .post("https://thealley.onrender.com/addDrink", values)
  //       .then((res) => {
  //         if (res.data.status === "success") {
  //           console.log(res.data.message);
  //         } else {
  //           console.error(res.data.message);
  //         }
  //       })
  //       .catch((err) => {
  //         errorfound = true;
  //         console.error("Error:", err);
  //         alert("Error: Entered existing Drink ID");
  //       });
  //   } else {
  //     errorfound = true;
  //     alert(
  //       "Please fill in all required fields: Drink ID, Drink Name, Drink Cost, and Drink Category"
  //     );
  //   }

  //   if (!errorfound) {
  //     onReload();
  //     //Activate pop up
  //     setOpenPopup(true);
  //   }
  //   console.log("Add Drink clicked", values);
  // };

  // Function to handle selected ingredients from the popup
  const handleSelectIngredients = (selectedIngredients) => {
    setSelectedIngredients(selectedIngredients);
    setOpenPopup(false);
  };

  // Function to handle button clicks for updating drinks
  const handleUpdateDrink = (e) => {
    // Check if input is valid
    if (values.drinkID == "") {
      alert("Error: Enter valid Drink ID");
    }
    if (
      values.drinkCost == "" &&
      values.drinkName == "" &&
      values.drinkCategory == ""
    ) {
      alert("Error: Enter at least 1 value to update (name, cost, category)");
    }
    // Backend call
    if (values.drinkName != "" && values.drinkID != "") {
      e.preventDefault();
      axios
        .post("https://thealley.onrender.com/updateMenuItemName", values)
        .then((res) => {
          const rowCountTwo = res.data.rowCount;
          if (res.data.status === "success") {
            console.log(res.data.message);
          } else {
            console.error(res.data.message);
          }
          if (rowCountTwo == 0) {
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
        .post("https://thealley.onrender.com/updateMenuItemCost", values)
        .then((res) => {
          const rowCountTwo = res.data.rowCount;
          if (res.data.status === "success") {
            console.log(res.data.message);
          } else {
            console.error(res.data.message);
          }
          if (rowCountTwo == 0) {
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
        .post("https://thealley.onrender.com/updateMenuItemCategory", values)
        .then((res) => {
          const rowCountTwo = res.data.rowCount;
          if (res.data.status === "success") {
            console.log(res.data.message);
          } else {
            console.error(res.data.message);
          }
          if (rowCountTwo == 0) {
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
    if (values.drinkID != "") {
      e.preventDefault();
      axios
        .post("https://thealley.onrender.com/deleteDrink", values)
        .then((res) => {
          const rowCountTwo = res.data.rowCount;
          if (res.data.status === "success") {
            console.log(res.data.message);
          } else {
            console.error(res.data.message);
          }
          if (rowCountTwo == 0) {
            alert("Error: Drink ID not found");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
      onReload();
    } else {
      alert("Error: Enter a drink ID");
    }
  };

  // Function to handle button clicks for adding add on
  const handleAddAddOn = (e) => {
    console.log("Add Drink clicked", values);
    if (
      values.addOnID != "" &&
      values.addOnName != "" &&
      values.addOnCost != ""
    ) {
      e.preventDefault();
      axios
        .post("https://thealley.onrender.com/addAddOn", values)
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
    } else {
      alert(
        "Please fill in all required fields: Add On ID, Add On Name, and Add On Cost"
      );
    }
    onReload();
  };

  // Function to handle button clicks for updating add ons
  const handleUpdateAddOn = (e) => {
    if (values.addOnID == "") {
      alert("Enter Add On ID to update");
    }
    if (values.addOnCost == "" && values.addOnName == "") {
      alert("Enter Add On Name and/or Add On Cost to update");
    }
    if (values.addOnID != "" && values.addOnCost != "") {
      e.preventDefault();
      axios
        .post("https://thealley.onrender.com/updateAddOnCost", values)
        .then((res) => {
          const rowCountTwo = res.data.rowCount;
          if (res.data.status === "success") {
            console.log(res.data.message);
          } else {
            console.error(res.data.message);
          }
          if (rowCountTwo == 0) {
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
        .post("https://thealley.onrender.com/updateAddOnName", values)
        .then((res) => {
          const rowCount = res.data.rowCount;
          if (res.data.status === "success") {
            console.log(res.data.message);
          } else {
            console.error(res.data.message);
          }
          if (rowCount == 0) {
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
        .post("https://thealley.onrender.com/deleteAddOn", values)
        .then((res) => {
          const rowCount = res.data.rowCount;
          if (res.data.status === "success") {
            console.log(res.data.message);
          } else {
            console.error(res.data.message);
          }
          if (rowCount == 0) {
            alert("Error: Add On ID not found");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          alert("Error: Entered existing Add On ID");
        });
    } else {
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
            <InputLabel className="managerLabel" htmlFor="drinkIdButton">Drink ID</InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="drinkIDButton"
                variant="filled"
                size="small"
                onChange={(e) => handleNumberInputChange(e, "drinkID")}
                type="text"
                error={inputErrors.drinkID}
                helperText={
                  inputErrors.itemId ? "Please enter a valid integer" : ""
                }
                value={values.drinkID}
                onMouseOver={() => isHoverEnabled &&
                  handleTextFieldSpeech("Drink ID", values.drinkID)
                }
              />
            </FormControl>
          </div>
          <div>
            <InputLabel className="managerLabel" htmlFor="drinkNameButton">Name</InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="drinkNameButton"
                variant="filled"
                size="small"
                onChange={(e) => 
                  setValues({ ...values, drinkName: e.target.value })
                }
                onMouseOver={() => isHoverEnabled && handleTextFieldSpeech("Name", values.name)}
              />
            </FormControl>
          </div>
          <div>
            <InputLabel className="managerLabel" htmlFor="drinkCostButton">Cost</InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="drinkCostButton"
                variant="filled"
                size="small"
                onChange={(e) => handleNumberInputChange(e, "drinkCost")}
                type="text"
                error={inputErrors.drinkCost}
                helperText={
                  inputErrors.itemId ? "Please enter a valid integer" : ""
                }
                value={values.drinkCost}
                onMouseOver={() => isHoverEnabled &&
                  handleTextFieldSpeech("Drink Cost", values.drinkCost)
                }
              />
            </FormControl>
          </div>
          <div>
            <InputLabel className="managerLabel" htmlFor="drinkCategoryButton">Category</InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="drinkCategoryButton"
                variant="filled"
                size="small"
                onChange={(e) =>
                  setValues({ ...values, drinkCategory: e.target.value })
                }
                onMouseOver={() => isHoverEnabled &&
                  handleTextFieldSpeech("Drink Category", values.drinkCategory)
                }
              />
            </FormControl>
          </div>
          {/* Add two more text boxes as needed */}
        </div>

        {/* Three buttons */}
        <div style={{ display: "flex", gap: "5px" }}>
          <CustomButton
            className="managerButton"
            onClick={handleAddDrink}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Add Drink{" "}
          </CustomButton>
          <CustomButton
            className="managerButton"
            onClick={handleUpdateDrink}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Update Drink
          </CustomButton>
          <CustomButton
            className="managerButton"
            onClick={handleDeleteDrink}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Delete Drink
          </CustomButton>
        </div>
        {/* Add any additional elements/buttons as needed */}
      </div>

      <div className="menuItemsButtonsContainer">
        {/* Three text boxes */}
        <div className="textboxContainer">
          <div>
            <InputLabel className="managerLabel" htmlFor="addOnIdButton">Add On ID</InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="addOnIdButton"
                variant="filled"
                size="small"
                onChange={(e) => handleNumberInputChange(e, "addOnID")}
                type="text"
                error={inputErrors.addOnID}
                helperText={
                  inputErrors.itemId ? "Please enter a valid integer" : ""
                }
                value={values.addOnID}
                onMouseOver={() => isHoverEnabled &&
                  handleTextFieldSpeech("Add On ID", values.addOnID)
                }
              />
            </FormControl>
          </div>
          <div>
            <InputLabel className="managerLabel" htmlFor="addOnNameButton">Add On Name</InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="addOnNameButton"
                variant="filled"
                size="small"
                onChange={(e) =>
                  setValues({ ...values, addOnName: e.target.value })
                }
                onMouseOver={() => isHoverEnabled &&
                  handleTextFieldSpeech("Add On Name", values.addOnName)
                }
              />
            </FormControl>
          </div>
          <div>
            <InputLabel className="managerLabel" htmlFor="addOnCostButton">Add On Cost</InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="addOnCostButton"
                variant="filled"
                size="small"
                type="text"
                //value={values.addOnCost}
                onChange={(e) => handleNumberInputChange(e, "addOnCost")}
                error={inputErrors.addOnCost}
                // helperText={
                //  inputErrors.itemId ? "Please enter a valid float value" : ""
                //  }
                value={values.addOnCost}
                onMouseOver={() =>  isHoverEnabled &&
                  handleTextFieldSpeech("Add On Cost", values.addOnCost)
                }
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
          <CustomButton
            className="managerButton"
            onClick={handleAddAddOn}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Add Add On{" "}
          </CustomButton>
          <CustomButton
            className="managerButton"
            onClick={handleUpdateAddOn}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Update Add On
          </CustomButton>
          <CustomButton
            className="managerButton"
            onClick={handleDeleteAddOn}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Delete Add On
          </CustomButton>
        </div>
        {/* Add any additional elements/buttons as needed */}
      </div>
    </div>
  );
};

export default MenuItemsButtons;
