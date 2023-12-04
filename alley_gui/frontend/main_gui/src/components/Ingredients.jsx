import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";
import {
  TextField,
  InputLabel,
  FormControl,
  ListItemButton,
  styled,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import NavBar from "./MenuItems/NavBar";
import "./MenuItems/MenuItems.css";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "./SpeechUtils";
import TextToSpeech from "./TextToSpeech";

const Ingredients = () => {
  // Creating custom buttons
  const CustomButton = styled(ListItemButton)(({ theme }) => ({
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

  // Creating columns for displaying sql queries
  const columns = [
    { field: "ingredientId", headerName: "Ingredeint ID", width: 130, flex: 1 },
    { field: "inventoryId", headerName: "Inventory ID", width: 130, flex: 1 },

    { field: "name", headerName: "Name", width: 130, flex: 1 },
    { field: "cost", headerName: "Cost", type: "number", width: 90, flex: 1 },
  ];

  const [values, setValues] = useState({
    ingredientId: "",
    inventoryId: "",
    name: "",
    cost: "",
  });

  const [inputErrors, setInputErrors] = useState({
    ingredientId: false,
    inventoryId: false,
    name: false,
    cost: false,
  });

  const [data, setData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
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

  const handleNumberInputChange = (e, key) => {
    // Allow only valid integers in the input
    const newValue = parseInt(e.target.value, 10);

    if (!isNaN(newValue)) {
      setValues({ ...values, [key]: newValue });
      setInputErrors({ ...inputErrors, [key]: false });
    } else {
      setInputErrors({ ...inputErrors, [key]: true });
    }
  };

  const handleCheckboxChange = (inventoryId) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [inventoryId]: !prevCheckedItems[inventoryId],
    }));

    if (!values.inventoryId) {
      setValues({ ...values, inventoryId });
    } else {
      setValues({ ...values, inventoryId: "" });
    }
  };

  // Getting inventory from the backend
  const ingredientItems = async () => {
    try {
      const response = await axios.get(
        "https://thealley.onrender.com/ingredient_items"
      );
      const jsonVals = await response.data;
      console.log("Working");
      console.log(jsonVals.data.table);
      // the item. names are from the database and left side values are from our const columns
      const rowsWithId = jsonVals.data.table.rows.map(
        (item, ingredient_id) => ({
          id: ingredient_id,
          ingredientId: item.ingredient_id,
          inventoryId: item.inventory_id,
          name: item.name,
          cost: item.cost,
        })
      );
      setData(rowsWithId);
    } catch (err) {
      console.log("ERROR");
      console.error(err.message);
    }
  };

  useEffect(() => {
    ingredientItems();

    const refreshTimer = setInterval(ingredientItems, 2000);

    return () => clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!openPopup) {
        // Popup is closed, perform the axios POST request
        await axios.post("https://thealley.onrender.com/addItemIngredient", values);

        setValues({ ...values, ingredientId: "" });
      }
    };

    fetchData();
  }, [openPopup]);

  const deleteHandleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ingredientResponse = await axios.get(
        "https://thealley.onrender.com/ingredient_items"
      );
      const ingredientData = ingredientResponse.data.data.table.rows;

      const itemToDelete = ingredientData.find(
        (item) =>
          item.ingredient_id == values.ingredientId && item.name == values.name
      );

      if (itemToDelete) {
        // // Fetch the corresponding inventory_id

        await axios.post("https://thealley.onrender.com/deleteItemIngredient", values);
        console.log("Item deleted succesfully");
      } else {
        alert("Item with the specified ingredientId and name not found.");
      }
    } catch (error) {
      console.error("Error during item deletion:", error);
    }
  };

  const updateHandleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ingredientResponse = await axios.get(
        "https://thealley.onrender.com/ingredient_items"
      );
      const ingredientData = ingredientResponse.data.data.table.rows;

      const itemToDelete = ingredientData.find(
        (item) => item.ingredient_id == values.ingredientId
      );

      if (itemToDelete) {
        // // Fetch the corresponding inventory_id

        await axios.post("https://thealley.onrender.com/updateItemIngredient", values);
        console.log("Item updated succesfully");
      } else {
        alert("Item with the specified ingredientId not found.");
      }
    } catch (error) {
      console.error("Error during item updation:", error);
    }
  };

  // Getting ingredient SQL query and updating the inventory backend as well
  const addHandleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required values are provided
    if (
      values.ingredientId !== "" &&
      values.name !== "" &&
      values.cost !== ""
    ) {
      try {
        // Check if itemId already exists in the inventory
        const inventoryResponse = await axios.get(
          "https://thealley.onrender.com/ingredient_items"
        );
        const inventoryData = inventoryResponse.data.data.table.rows;

        // Check if itemId already exists
        const inventoryIdExists = inventoryData.some(
          (item) => item.inventory_id === values.inventoryId
        );

        if (inventoryIdExists) {
          // itemId already exists, provide a user-friendly message
          alert(
            "inventory Ids already exists. Use the Update button or change the Item ID."
          );
        } else {
          // Continue fetching data and displaying the popup
          const response = await axios.get(
            "https://thealley.onrender.com/inventory_items"
          );
          const jsonVals = response.data;

          setPopupData(jsonVals);
          setOpenPopup(true);
        }
      } catch (error) {
        // Handle errors in a more descriptive way
        console.error("Error during item ID check:", error);
      }
    } else {
      // Handle case where some required fields are not provided
      alert("Please fill in all required fields.");
    }
  };

  const highContrastMode = () => {
    const body = document.querySelector('body');
    if (body.classList.contains("contrast")) {
      body.classList.remove("contrast");
      document.body.style.backgroundColor = '#ffefe2';
      sessionStorage.setItem("high_contrast_mode", false);
    } else {
      body.classList.add("contrast");
      document.body.style.backgroundColor = 'black';
      sessionStorage.setItem("high_contrast_mode", true);
    }
  }

  const loadCurrentMode = () => {
    if (sessionStorage.getItem("high_contrast_mode")) {
      const body = document.querySelector('body');
      if (body.classList.contains("contrast") == false) {
        body.classList.add("contrast");
        document.body.style.backgroundColor = 'black';
      }
    } else {
      const body = document.querySelector('body');
      body.classList.remove("contrast");
      document.body.style.backgroundColor = '#ffefe2';
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <NavBar />

      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        PaperProps={{
          style: {
            maxWidth: "800px",
            width: "100%",
          },
        }}
        maxWidth="800px"
      >
        <DialogTitle>Choose assciated ingredient</DialogTitle>
        <DialogContent>
          {popupData.data &&
          popupData.data.table &&
          popupData.data.table.rows ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Checkbox</th>
                    <th>Item ID</th>
                    <th>Ingredient ID</th>
                    <th>Name</th>
                    <th>Count</th>
                    <th>fill_level</th>
                    <th>quantity_per_unit</th>
                  </tr>
                </thead>
                <tbody>
                  {popupData.data.table.rows.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={checkedItems[item.item_id]}
                          onChange={() => handleCheckboxChange(item.item_id)}
                        />
                      </td>
                      <td>{item.item_id}</td>
                      <td>{item.ingredient_id}</td>
                      <td>{item.name}</td>
                      <td>{item.count}</td>
                      <td>{item.fill_level}</td>
                      <td>{item.quantityPerUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>NO data available</p>
          )}
          <CustomButton onClick={() => setOpenPopup(false)}>Done</CustomButton>
        </DialogContent>
      </Dialog>
      <div
        style={{
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",
        }}>
        <h1>Ingredient Page</h1>
        <div class="tablesInfo" onLoad={() => loadCurrentMode()}>
        <button onClick={highContrastMode}>test</button>
          <div style={{ height: 400, width: "80vw", marginBottom: "20px" }}>
            <DataGrid
              rows={data}
              columns={columns.map((column) => ({
                ...column,
                renderCell: (params) => (
                  <div
                    onMouseOver={() => handleGridCellHover(params)}
                    onMouseOut={handleMouseOut}
                  >
                    {params.value}
                  </div>
                ),
              }))}
            />{" "}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%" }}>
            <InputLabel htmlFor="filled-basic">Ingredient ID</InputLabel>
            <FormControl>
              <TextField
                id="filled-basic"
                variant="filled"
                onChange={(e) => handleNumberInputChange(e, "ingredientId")}
                value={values.ingredientId}
                onMouseOver={() =>
                  handleTextFieldSpeech("ingredientId", values.ingredientId)
                }
                type="number"
                error={inputErrors.ingredientId}
                helperText={
                  inputErrors.ingredientId ? "Please enter a valid integer" : ""
                }
              />
            </FormControl>
          </div>
          <div style={{ width: "100%" }}>
            <InputLabel htmlFor="filled-basic">Name</InputLabel>
            <FormControl>
              <TextField
                id="filled-basic"
                variant="filled"
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                onMouseOver={() => handleTextFieldSpeech("Name", values.name)}
              />
            </FormControl>
          </div>
          <div style={{ width: "100%" }}>
            <InputLabel htmlFor="filled-basic">Cost</InputLabel>
            <FormControl>
              <TextField
                id="filled-basic"
                variant="filled"
                onChange={(e) => handleNumberInputChange(e, "cost")}
                value={values.cost}
                onMouseOver={() => handleTextFieldSpeech("Cost", values.cost)}
                type="number"
                error={inputErrors.cost}
                helperText={
                  inputErrors.cost ? "Please enter a valid integer" : ""
                }
              />
            </FormControl>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <CustomButton
            onClick={addHandleSubmit}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Add ingredient
          </CustomButton>
          <CustomButton
            onClick={deleteHandleSubmit}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Delete ingredient
          </CustomButton>
          <CustomButton
            onClick={updateHandleSubmit}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Update ingredient
          </CustomButton>
          <TextToSpeech
            isHoverEnabled={isHoverEnabled}
            toggleHover={toggleHover}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Ingredients;
