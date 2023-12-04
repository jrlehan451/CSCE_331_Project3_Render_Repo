import React, { useState, useEffect } from "react";
import TextToSpeech from "./TextToSpeech";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";
import {
  Box,
  ListItemButton,
  styled,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";

import NavBar from "./MenuItems/NavBar";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "./SpeechUtils";

import "./MenuItems/MenuItems.css";

//import axios from "axios"; // Make sure to import axios for HTTP requests
const Inventory = () => {
  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
  };

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
    { field: "itemId", headerName: "Item ID", width: 70, flex: 1 },
    { field: "ingredientId", headerName: "Ingredeint ID", width: 130, flex: 1 },
    { field: "name", headerName: "Name", width: 130, flex: 1 },
    { field: "count", headerName: "Count", type: "number", width: 90, flex: 1 },
    {
      field: "fillLevel",
      headerName: "Fill Level",
      type: "number",
      width: 90,
      flex: 1,
    },
    {
      field: "quantityPerUnit",
      headerName: "Quantity Per Unit",
      type: "number",
      width: 90,
      flex: 1,
    },
  ];

  const [checkedItems, setCheckedItems] = useState({});
  const [data, setData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);

  const [popupData, setPopupData] = useState([]);
  const [values, setValues] = useState({
    itemId: "",
    name: "",
    amount: "",
    quantityPerUnit: "",
    ingredientId: "",
  });

  const handleCheckboxChange = (ingredientId) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [ingredientId]: !prevCheckedItems[ingredientId],
    }));

    if (!values.ingredientId) {
      setValues({ ...values, ingredientId });
    } else {
      setValues({ ...values, ingredientId: "" });
    }
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

  // Getting inventory from the backend
  useEffect(() => {
    const inventoryItems = async () => {
      try {
        const response = await axios.get(
          "https://thealley.onrender.com/inventory_items"
        );
        const jsonVals = await response.data;
        console.log("Working");
        console.log(jsonVals.data.table);
        const rowsWithId = jsonVals.data.table.rows.map(
          (item, ingredient_id) => ({
            id: ingredient_id,
            itemId: item.item_id,
            ingredientId: item.ingredient_id,
            name: item.name,
            count: item.count,
            fillLevel: item.fill_level,
            quantityPerUnit: item.quantity_per_unit,
          })
        );
        setData(rowsWithId);
      } catch (err) {
        console.log("ERROR");
        console.error(err.message);
      }
    };

    const refreshInterval = 2000;
    const refreshTimer = setInterval(inventoryItems, refreshInterval);

    return () => clearInterval(refreshTimer);
  }, []);

  // Getting ingredient SQL query and updating the inventory backend as well
  const addHandleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required values are provided
    if (
      values.itemId !== "" &&
      values.name !== "" &&
      values.amount !== "" &&
      values.quantityPerUnit !== ""
    ) {
      try {
        // Check if itemId already exists in the inventory
        const inventoryResponse = await axios.get(
          "https://thealley.onrender.com/inventory_items"
        );
        const inventoryData = inventoryResponse.data.data.table.rows;

        // Check if itemId already exists
        const itemIdExists = inventoryData.some(
          (item) => item.item_id === values.itemId
        );

        if (itemIdExists) {
          // itemId already exists, provide a user-friendly message
          alert(
            "Item ID already exists. Use the Update button or change the Item ID."
          );
        } else {
          // Continue fetching data and displaying the popup
          const response = await axios.get(
            "https://thealley.onrender.com/ingredient_items"
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

  useEffect(() => {
    const fetchData = async () => {
      if (!openPopup) {
        // Popup is closed, perform the axios POST request
        await axios.post("https://thealley.onrender.com/addItemInventory", values);

        setValues({ ...values, ingredientId: "" });
      }
    };

    fetchData();
  }, [openPopup]);

  const deleteHandleSubmit = async (e) => {
    e.preventDefault();

    try {
      const inventoryResponse = await axios.get(
        "https://thealley.onrender.com/inventory_items"
      );
      const inventoryData = inventoryResponse.data.data.table.rows;

      const itemToDelete = inventoryData.find(
        (item) => item.item_id == values.itemId && item.name == values.name
      );

      if (itemToDelete) {
        await axios.post("https://thealley.onrender.com/deleteItemInventory", values);
        console.log("Item deleted succesfully");
      } else {
        alert("Item with the specified itemId and name not found.");
      }
    } catch (error) {
      console.error("Error during item deletion:", error);
    }
  };

  const [inputErrors, setInputErrors] = useState({
    itemId: false,
    name: false,
    amount: false,
    quantityPerUnit: false,
  });

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

  const updateHandleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://thealley.onrender.com/updateItemInventory", values)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

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
                    <th>ingredient ID</th>
                    <th>Inventory ID</th>
                    <th>Name</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {popupData.data.table.rows.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={checkedItems[item.ingredient_id]}
                          onChange={() =>
                            handleCheckboxChange(item.ingredient_id)
                          }
                        />
                      </td>
                      <td>{item.ingredient_id}</td>
                      <td>{item.inventory_id}</td>
                      <td>{item.name}</td>
                      <td>{item.cost}</td>
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
        }}
      >
        <h1>Inventory Page</h1>
        <div class="tablesInfo">
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
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5px",
            }}
          >
            <div>
              <InputLabel htmlFor="filled-basic">Item ID</InputLabel>
              <FormControl>
                <TextField
                  id="filled-basic"
                  variant="filled"
                  onChange={(e) => handleNumberInputChange(e, "itemId")}
                  value={values.itemId}
                  type="number"
                  error={inputErrors.itemId}
                  helperText={
                    inputErrors.itemId ? "Please enter a valid integer" : ""
                  }
                  onMouseOver={() =>
                    handleTextFieldSpeech("Item ID", values.itemId.toString())
                  }
                  onMouseOut={handleMouseOut}
                />
              </FormControl>
            </div>
            <div>
              <InputLabel htmlFor="filled-basic">Name</InputLabel>
              <FormControl>
                <TextField
                  id="filled-basic"
                  variant="filled"
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  onMouseOver={() => handleTextFieldSpeech("Name", values.name)}
                  onMouseOut={handleMouseOut}
                />
              </FormControl>
            </div>
            <div>
              <InputLabel htmlFor="filled-basic">Amount</InputLabel>
              <FormControl>
                <TextField
                  id="filled-basic"
                  variant="filled"
                  onChange={(e) => handleNumberInputChange(e, "amount")}
                  value={values.amount}
                  type="number"
                  error={inputErrors.amount}
                  helperText={
                    inputErrors.amount ? "Please enter a valid integer" : ""
                  }
                  onMouseOver={() =>
                    handleTextFieldSpeech("Amount", values.amount.toString())
                  }
                  onMouseOut={handleMouseOut}
                />
              </FormControl>
            </div>
            <div>
              <InputLabel htmlFor="filled-basic">Quantity Per Unit</InputLabel>
              <FormControl>
                <TextField
                  id="filled-basic"
                  variant="filled"
                  onChange={(e) =>
                    handleNumberInputChange(e, "quantityPerUnit")
                  }
                  onMouseOver={() =>
                    handleTextFieldSpeech(
                      "Quantity Per Unit",
                      values.quantityPerUnit
                    )
                  }
                  value={values.quantityPerUnit}
                  type="number"
                  error={inputErrors.quantityPerUnit}
                  helperText={
                    inputErrors.quantityPerUnit
                      ? "Please enter a valid integer"
                      : ""
                  }
                />
              </FormControl>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <CustomButton
                onClick={addHandleSubmit}
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                Add Item{" "}
              </CustomButton>
              <CustomButton
                onClick={deleteHandleSubmit}
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                Delete Item
              </CustomButton>
              <CustomButton
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                Update Item
              </CustomButton>
            </div>

            <CustomButton
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
              style={{ width: "90%" }}
            >
              Apply Recommended Adjustments
            </CustomButton>
            <TextToSpeech
              isHoverEnabled={isHoverEnabled}
              toggleHover={toggleHover}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Inventory;
