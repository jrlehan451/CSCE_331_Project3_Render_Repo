import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
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
import "../pages/AnalyzeTrends.css";

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

const Ingredients = (props) => {
  const { isHoverEnabled, handleToggleHover } = props;
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false); // Add this line

  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
    //handleToggleHover();
  };

  useEffect(() => {
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
  });

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

  // Creating columns for displaying sql queries
  const columns = [
    { field: "ingredientId", headerName: "Ingredient ID", width: 130, flex: 1 },
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

  /**
   * @description gets changes in input and formats them accordingly
   * @function handleNumberInputChange
   * @param {*} e
   * @param {*} key
   */
  const handleNumberInputChange = (e, key) => {
    const newValue = e.target.value;

    // Check if the entered value is a valid integer or float
    const isValidInteger = /^[0-9]*$/.test(newValue);
    const isValidFloat = /^\d*\.?\d*$/.test(newValue);

    if (isValidInteger || newValue === "") {
      setValues({ ...values, [key]: newValue });
      setInputErrors({ ...inputErrors, [key]: false });
    } else if ((key == "cost" || key == "drinkCost") && isValidFloat) {
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
  /**
   * @function ingredientItems
   * @description gets all the ingredients from the database using a server-side API call
   */
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

  /**
   * @function refreshTimer
   * @description timer that refreshes the table
   */
  useEffect(() => {
    ingredientItems();

    const refreshTimer = setInterval(ingredientItems, 2000);

    return () => clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!openPopup) {
        // Popup is closed, perform the axios POST request
        await axios.post(
          "https://thealley.onrender.com/addItemIngredient",
          values
        );

        setValues({ ...values, ingredientId: "" });
      }
    };

    fetchData();
  }, [openPopup]);

  useEffect(() => {
    const translateFeature = document.querySelector(".translate");
    translateFeature.style.display = "none";
    const translateReplace = document.querySelector(".translateNotAvailable");
    translateReplace.style.display = "block";
  }, []);

  const deleteHandleSubmit = async (e) => {
    if (values.ingredientId != "") {
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
          //await axios.post("http://localhost:4000/deleteItemIngredient", values);
          await axios.post(
            "https://thealley.onrender.com/deleteItemIngredient",
            values
          );
          console.log("Item deleted succesfully");
        } else {
          alert("Item with the specified ingredientId");
        }
      } catch (error) {
        console.error("Error during item deletion:", error);
      }
    } else {
      alert("Please enter a valid ingredient ID");
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

        await axios.post(
          "https://thealley.onrender.com/updateItemIngredient",
          values
        );
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
        <DialogTitle>Choose Associated Inventory</DialogTitle>
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
                    <th>Fill Level</th>
                    <th>Quantity Per Unit</th>
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
                      <td>{item.quantity_per_unit}</td>
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
      <div class="managerWrapper">
        <h1 class="managerHeader" className="trendsTitle">
          Ingredients
        </h1>
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
            <InputLabel className="managerLabel" htmlFor="filled-basic">
              Ingredient ID
            </InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="filled-basic"
                variant="filled"
                onChange={(e) => handleNumberInputChange(e, "ingredientId")}
                value={values.ingredientId}
                onMouseOver={() =>
                  isHoverEnabled &&
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
            <InputLabel className="managerLabel" htmlFor="filled-basic">
              Name
            </InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="filled-basic"
                variant="filled"
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                onMouseOver={() =>
                  isHoverEnabled && handleTextFieldSpeech("Name", values.name)
                }
              />
            </FormControl>
          </div>
          <div style={{ width: "100%" }}>
            <InputLabel className="managerLabel" htmlFor="filled-basic">
              Cost
            </InputLabel>
            <FormControl className="managerForm">
              <TextField
                id="filled-basic"
                variant="filled"
                onChange={(e) => handleNumberInputChange(e, "cost")}
                value={values.cost}
                onMouseOver={() =>
                  isHoverEnabled && handleTextFieldSpeech("Cost", values.cost)
                }
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
            className="managerButton"
            onClick={addHandleSubmit}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Add Ingredient
          </CustomButton>
          <CustomButton
            className="managerButton"
            onClick={deleteHandleSubmit}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Delete Ingredient
          </CustomButton>
          <CustomButton
            className="managerButton"
            onClick={updateHandleSubmit}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Update Ingredient
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Ingredients;
