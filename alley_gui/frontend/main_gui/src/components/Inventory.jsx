import React, { useState, useEffect } from "react";
import TextToSpeech from "./TextToSpeech";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
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

// Creating custom buttons
/**
 * @function CustomButtonInventory
 * @description adds custom styling to the buttons on the inventory page
 */
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

//import axios from "axios"; // Make sure to import axios for HTTP requests
/**
 * @description This component displays the inventory table 
 * and all the associated CRUD operations the manager can apply.
 * @component Inventory 
 * @param {*} props 
 * @returns display of the inventory page
 */
const Inventory = (props) => {
  const { isHoverEnabled, handleToggleHover } = props;
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false)

  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
  };

  useEffect(() => {
    const protection = async () => {
      const role = localStorage.getItem("Role");
      switch(role){
        case "Manager":
            break;
        default:
          window.location.href = window.location.origin;
          break;
      }
    };

    protection();
  });


  // Creating columns for displaying sql queries
  const columns = [
    { field: "itemId", headerName: "Item ID", width: 70, flex: 1 },
    { field: "ingredientId", headerName: "Ingredeint ID", width: 130, flex: 1 },
    { field: "name", headerName: "Name", width: 130, flex: 1 },
    { field: "count", headerName: "Amount", type: "number", width: 90, flex: 1 },
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

  const [popupData, setPopupData] = useState([]);
  const [values, setValues] = useState({
    itemId: "",
    name: "",
    amount: "",
    quantityPerUnit: "",
    ingredientId: "",
    fillLevel: "",
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
      //console.log("Cell Content:", cellContent);

      // Call the handleHover function to initiate text-to-speech
      handleTableFieldSpeech(cellContent);
      //handleTableFieldSpeech("This is a test");
    }
  };

  // Getting inventory from the backend
  /**
   * @function inventoryItems
   * @description gets all the inventory from the database using a server-side API call
   */
  useEffect(() => {
    const inventoryItems = async () => {
      try {
        const response = await axios.get(
          "https://thealley.onrender.com/inventory_items"
        );
        const jsonVals = await response.data;
        console.log("Working");
        //console.log(jsonVals.data.table);
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


  const updateHandleSubmit = async (e) => {
    e.preventDefault();
    if(values.itemId == ""){
      alert("Error: Enter valid Inventory ID")
    }
    if(values.name == "" && values.amount == "" && values.quantityPerUnit == "" && values.fillLevel == ""){
      alert("Error: Enter at least 1 value to update (name, cost, category)");
    }
    // Check if all required values are provided

    try {
      const inventoryResponse = await axios.get(
        "https://thealley.onrender.com/inventory_items"
      );
      const inventoryData = inventoryResponse.data.data.table.rows;
  
      const itemToUpdate = inventoryData.find(
        (item) => item.item_id == values.itemId
      );

      if (itemToUpdate) {
        if (values.name != "" && values.itemId != "") {
          await axios.post("https://thealley.onrender.com/updateInventoryName", values);
          console.log("Item in inventory name updated succesfully");
        }
        if (values.amount != "" && values.itemId != "") {
          await axios.post("https://thealley.onrender.com/updateInventoryCount", values);
          console.log("Item in inventory count updated succesfully");
        }
        if (values.quantityPerUnit != "" && values.itemId != "") {
          await axios.post("https://thealley.onrender.com/updateInventoryQuantityUnit", values);
          console.log("Item in inventory quantity per unit updated succesfully");
        }
        if (values.fillLevel != "" && values.itemId != "") {
          await axios.post("https://thealley.onrender.com/updateInventoryFillLevel", values);
          console.log("Item in inventory quantity per unit updated succesfully");
        }
      } else {
        alert("Item with the specified itemId and name not found  .");
      }
    } catch (error) {
      // Handle errors in a more descriptive way
      console.error("Error during item ID check:", error);
    }
  };

  /**
   * @function fetchData
   * @description adds item to inventory using the server-side API call
   */
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


  /**
   * @description displays the suggested adjustments that need to be made to the inventory
   * @function recommendedAdjHandle
   * @param {*} e 
   */
  const recommendedAdjHandle = async (e) => {
    e.preventDefault();
    console.log("Entered recommend adj handle");
  
    try {
      const inventoryResponse = await axios.get(
        //"https://thealley.onrender.com/recommendation_adj"
        "http://localhost:4000/recommendation_adj"
      );
      const inventoryData = inventoryResponse.data;
  
      // Do something with inventoryData if needed
      console.log("Received inventory data:", inventoryData);
      console.log("Old Counts Map:", inventoryData.oldCountsMap);
      console.log("The message is:", inventoryData.message);
      // If there are specific properties in the response data you need, you can access them like:
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
    const newValue = e.target.value;
  
    // Check if the entered value is a valid integer or float
    const isValidInteger = /^[0-9]*$/.test(newValue);
    const isValidFloat = /^\d*\.?\d*$/.test(newValue);
  
    if (isValidInteger || newValue === "") {
      setValues({ ...values, [key]: newValue });
      setInputErrors({ ...inputErrors, [key]: false });
    } 
    
    else {
      setInputErrors({ ...inputErrors, [key]: true });
    }
   };

  return (
    <div>
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
          <CustomButton className="managerButton" onClick={() => setOpenPopup(false)}>Done</CustomButton>
        </DialogContent>
      </Dialog>
      <div class="managerWrapper">
        <h1 class="managerHeader">Inventory Page</h1>
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
              <InputLabel className="managerLabel" htmlFor="filled-basic">Item ID</InputLabel>
              <FormControl className="managerForm">
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
                  onMouseOver={() => isHoverEnabled &&
                    handleTextFieldSpeech("Item ID", values.itemId.toString())
                  }
                  onMouseOut={handleMouseOut}
                />
              </FormControl>
            </div>
            <div>
              <InputLabel className="managerLabel" htmlFor="filled-basic">Name</InputLabel>
              <FormControl className="managerForm">
                <TextField
                  id="filled-basic"
                  variant="filled"
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  onMouseOver={() => isHoverEnabled && handleTextFieldSpeech("Name", values.name)}
                  onMouseOut={handleMouseOut}
                />
              </FormControl>
            </div>
            <div>
              <InputLabel className="managerLabel" htmlFor="filled-basic">Amount</InputLabel>
              <FormControl className="managerForm">
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
                  onMouseOver={() => isHoverEnabled &&
                    handleTextFieldSpeech("Amount", values.amount.toString())
                  }
                  onMouseOut={handleMouseOut}
                />
              </FormControl>
            </div>
            <div>
              <InputLabel className="managerLabel" htmlFor="filled-basic">Quantity Per Unit</InputLabel>
              <FormControl className="managerForm">
                <TextField
                  id="filled-basic"
                  variant="filled"
                  onChange={(e) =>
                    handleNumberInputChange(e, "quantityPerUnit")
                  }
                  onMouseOver={() => isHoverEnabled &&
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
            <div>
              <InputLabel className="managerLabel" htmlFor="filled-basic">Fill Level</InputLabel>
              <FormControl className="managerForm">
                <TextField
                  id="filled-basic"
                  variant="filled"
                  size = "small"
                  onChange={(e) =>
                    handleNumberInputChange(e, "fillLevel")
                  }
                  value={values.fillLevel}
                  type="text"
                  error={inputErrors.fillLevel}
                  helperText={
                    inputErrors.fillLevel
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
                className="managerButton"
                onClick={addHandleSubmit}
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                Add Item{" "}
              </CustomButton>
              <CustomButton
                className="managerButton"
                onClick={deleteHandleSubmit}
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                Delete Item
              </CustomButton>

              <CustomButton
                className="managerButton"
                onClick={updateHandleSubmit}
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                Update Item
              </CustomButton>
            </div>

            <CustomButton
              className="managerButton"
              onClick={recommendedAdjHandle}
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
              style={{ width: "90%" }}
            >
              Apply Recommended Adjustments
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
