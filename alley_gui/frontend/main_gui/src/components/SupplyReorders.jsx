import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { theme } from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import {
  ListItemButton,
  styled,
  TextField,
  InputLabel,
  FormControl,
  Dialog,
  Checkbox,
  Button,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogContent from "@mui/material/DialogContent";

const SupplyReorders = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);

  const columns = [
    { field: "reorder_id", headerName: "Reorder ID", width: 70, flex: 1 },
    { field: "date", headerName: "Date", width: 130, flex: 1 },
  ];

  const [values, setValues] = useState({
    reorderId: "",
    date: "",
  });

  const CustomButton = styled(ListItemButton)(({ theme }) => ({
    backgroundColor: "#ffefe2",
    color: "black",
    margin: 10,
    borderRadius: "8px",
    width: "200px",
    minHeight: "40px",
    maxHeight: "60px",
    "&:hover": { backgroundColor: "lightblue" },
    "&:disabled": { backgroundColor: "gray", color: "white" },
  }));

  // Getting inventory from the backend
  useEffect(() => {
    const supplyReorders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/supply_reorders"
        );
        const jsonVals = await response.data;
        console.log("Working");
        console.log(jsonVals.data.table);
        const rowsWithId = jsonVals.data.table.rows.map((item, index) => ({
          id: index,
          reorder_id: item.reorder_id,
          date: item.date,
        }));
        setData(rowsWithId);
      } catch (err) {
        console.log("ERROR");
        console.error(err.message);
      }
    };

    supplyReorders();
  }, []);

  // Getting ingredient SQL query and updating the inventory backend as well
  const addHandleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required values are provided
    if (values.reorderId && values.date) {
      try {
        // Check if itemId already exists in the inventory
        const response = await axios.get(
          "http://localhost:4000/inventory_items"
        );
        const jsonVals = response.data;

        setPopupData(jsonVals);
        setOpenPopup(true);
      } catch (error) {
        // Handle errors in a more descriptive way
        console.error("Error during item ID check:", error);
        return;
      }

      setOpenModal(true);
    } else {
      // Handle case where some required fields are not provided
      alert("Please fill in all required fields.");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCheckboxChange = (itemId) => {
    const isSelected = selectedItems.includes(itemId);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DataGrid rows={data} columns={columns} columnBuffer={2} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "5px",
            padding: "10px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div>
              <InputLabel htmlFor="filled-basic">Supply Reorder ID:</InputLabel>
              <FormControl>
                <TextField
                  id="filled-basic"
                  variant="filled"
                  type="number"
                  name="reorderId"
                  value={values.reorderId}
                  onChange={handleInputChange}
                />
              </FormControl>
            </div>
            <div>
              <InputLabel htmlFor="filled-basic">Date:</InputLabel>
              <FormControl>
                <TextField
                  id="filled-basic"
                  variant="filled"
                  type="date"
                  name="date"
                  values={values.date}
                  onChange={handleInputChange}
                />
              </FormControl>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <CustomButton onClick={addHandleSubmit}>
              Add Supply Reorder
            </CustomButton>
            <CustomButton>Delete Supply Reorder</CustomButton>
            <CustomButton>View Supply Reorder</CustomButton>
          </div>

          {/*Add Supply Reorder Modal */}
          <Dialog open={openModal} onClose={handleCloseModal}>
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
                              onChange={() =>
                                handleCheckboxChange(item.item_id)
                              }
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
              <CustomButton onClick={() => setOpenPopup(false)}>
                Done
              </CustomButton>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SupplyReorders;
