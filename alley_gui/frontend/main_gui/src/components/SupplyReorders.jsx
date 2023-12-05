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
import NavBar from "./MenuItems/NavBar";
import "./MenuItems/MenuItems.css";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "./SpeechUtils";
import TextToSpeech from "./TextToSpeech";
import "./MenuItems/MenuItems.css";

const CustomButton = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: "#ffefe2",
  border: "2px solid #9e693f",
  color: "#9e693f",
  fontWeight: "bold",
  margin: 5,
  marginTop: 10,
  borderRadius: "80px",
  width: "190px",
  minHeight: "40px",
  maxHeight: "60px",
  "&:hover": { backgroundColor: "lightblue" },
  "&:disabled": { backgroundColor: "gray", color: "white" },
}));

const SupplyReorders = (props) => {
  const { isHoverEnabled, handleToggleHover } = props;
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false); // Add this line

  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
    //handleToggleHover();
  };

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

  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    data: {
      table: {
        rows: [],
      },
    },
  });
  const [checkedItems, setCheckedItems] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);
  const [openViewPopup, setOpenViewPopup] = useState(false);
  const [selectedInventoryItems, setSelectedInventoryItems] = useState([]);
  const [reorderItemsData, setReorderItemsData] = useState([]);

  const columns = [
    { field: "reorder_id", headerName: "Reorder ID", width: 70, flex: 1 },
    { field: "date", headerName: "Date", width: 130, flex: 1 },
  ];

  const [values, setValues] = useState({
    reorderId: "",
    date: "",
    amounts: {},
  });

  const addSupplyReorder = async (selectedItems, amounts) => {
    console.log("Selected Items to be sent:", selectedItems);
    console.log("Amounts to be sent:", amounts);

    try {
      const response = await axios.post(
        "https://thealley.onrender.com/addSupplyReorder",
        {
          selectedItems: selectedItems,
          amounts: amounts,
          reorder_id: values.reorderId,
          date: values.date,
        }
      );

      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error sending selected items to backend:", error);
    }
  };

  // Getting inventory from the backend
  useEffect(() => {
    const supplyReorders = async () => {
      try {
        const response = await axios.get(
          "https://thealley.onrender.com/supply_reorders"
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

    const refreshInterval = 2000;
    const refreshTimer = setInterval(supplyReorders, refreshInterval);

    return () => clearInterval(refreshTimer);
  }, []);

  const viewHandleSubmit = async () => {
    console.log("Sending reorderId:", values.reorderId);
    console.log("Sending date: ", values.date);

    try {
      const response = await axios.post(
        "https://thealley.onrender.com/viewSupplyReorder",
        {
          reorder_id: values.reorderId,
          date: values.date,
        }
      );
      const viewData = response.data;

      //setViewPopupData(viewData);

      const responseReorderItem = await axios.get(
        "https://thealley.onrender.com/reorder_items"
      );
      const reorderItemsData = responseReorderItem.data;

      if (
        reorderItemsData &&
        reorderItemsData.data &&
        reorderItemsData.data.table
      ) {
        console.log("Reorder Items Data:", reorderItemsData.data.table.rows);
        console.log("Reorderid:", values.reorderId);

        const filteredData = reorderItemsData.data.table.rows.filter(
          (item) => item.reorder_id.toString() === values.reorderId.toString()
        );

        console.log("Reorder Items Data:", filteredData);

        if (filteredData.length === 0) {
          alert("Reorder ID doesn't exist. Please re-enter the data.");
        } else {
          setReorderItemsData(filteredData);

          setOpenViewPopup(true);
        }
      } else {
        console.log("No data available for reorder_items");
      }
    } catch (error) {
      console.log("Error during fetching reorder_items data:", error);
    }
  };

  const deleteHandleSubmit = async () => {
    console.log("Sending reorderId:", values.reorderId);
    console.log("Sending date: ", values.date);

    const responseReorderItem = await axios.get(
      "https://thealley.onrender.com/supply_reorders"
    );
    const reorderItemsData = responseReorderItem.data;

    if (
      reorderItemsData &&
      reorderItemsData.data &&
      reorderItemsData.data.table
    ) {
      console.log("Reorder Items Data:", reorderItemsData.data.table.rows);
      console.log("Reorderid:", values.reorderId);

      const filteredData = reorderItemsData.data.table.rows.filter((item) => {
        console.log("Item reorder_id type:", typeof item.reorder_id);
        console.log("values.reorderId type:", typeof values.reorderId);
        console.log("Item reorder_id:", item.reorder_id);
        console.log("values.reorderId:", values.reorderId);

        const itemReorderId = parseInt(item.reorder_id, 10);
        const valuesReorderId = parseInt(values.reorderId, 10);
        console.log("Parsed Item reorder_id:", itemReorderId);
        console.log("Parsed values.reorderId:", valuesReorderId);

        return itemReorderId === valuesReorderId;
      });

      // const filteredData = reorderItemsData.data.table.rows.filter(
      //   (item) => item.reorder_id === parseInt(values.reorderId, 10)
      // );

      console.log("Reorder Items Data:", filteredData);

      if (filteredData.length === 0) {
        alert("Reorder ID doesn't exist. Please re-enter the data.");
      } else {
        try {
          const response = await axios.post(
            "https://thealley.onrender.com/deleteSupplyReorder",
            {
              reorder_id: values.reorderId,
              date: values.date,
            }
          );
          const viewData = response.data;

          //setViewPopupData(viewData);

          //setOpenViewPopup(true);
        } catch (error) {
          console.error("Error during view supply reorder:", error);
        }
      }
    }
  };

  // Getting ingredient SQL query and updating the inventory backend as well
  const addHandleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required values are provided
    if (values.reorderId && values.date) {
      try {
        // Check if itemId already exists in the inventory
        const response = await axios.get(
          "https://thealley.onrender.com/ingredient_items"
        );
        const jsonVals = response.data;

        // Assuming "amount" is a property in your backend response
        const rowsWithAmount = jsonVals.data.table.rows.map((item, index) => ({
          ...item,
          amount: item.amount || 0, // Set the default amount value, or fetch it from the backend if available
        }));

        setPopupData({
          ...jsonVals,
          data: {
            ...jsonVals.data,
            table: {
              ...jsonVals.data.table,
              rows: rowsWithAmount,
            },
          },
        });

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

  const handleCheckboxChange = (inventory_id) => {
    const isSelected = selectedItems.includes(inventory_id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== inventory_id));
      setSelectedInventoryItems(
        selectedInventoryItems.filter(
          (item) => item.inventory_id !== inventory_id
        )
      );
    } else {
      console.log("popupData:", popupData);
      console.log("popupData.data:", popupData.data);
      console.log("popupData.data.table:", popupData.data.table);
      console.log("popupData.data.table.rows:", popupData.data.table.rows);
      setSelectedItems([...selectedItems, inventory_id]);
      const selectedItem = popupData.data.table.rows.find(
        (item) => item.inventory_id === inventory_id
      );
      setSelectedInventoryItems([...selectedInventoryItems, selectedItem]);
    }
  };

  const handleAmountChange = (e, inventory_id) => {
    const { value } = e.target;
    console.log("Inventory ID:", inventory_id);
    console.log("New Amount Value:", value);

    setValues((prevValues) => ({
      ...prevValues,
      amounts: {
        ...prevValues.amounts,
        [inventory_id]: parseInt(value, 10),
      },
    }));

    setPopupData((prevData) => {
      const updatedRows = prevData.data.table.rows.map((item) =>
        item.inventory_id === inventory_id
          ? { ...item, amount: parseInt(value, 10) }
          : item
      );

      return {
        ...prevData,
        data: {
          ...prevData.data,
          table: {
            ...prevData.data.table,
            rows: updatedRows,
          },
        },
      };
    });
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
      <NavBar />

      <div
        style={{
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <div class="tablesInfo">
          <div style={{ flex: 1, overflow: "auto", height: "65vh" }}>
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
                  onMouseOver={() => isHoverEnabled &&
                    handleTextFieldSpeech("Supply Reorder ID", values.reorderId)
                  }
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
                  onMouseOver={() => isHoverEnabled && handleTextFieldSpeech("Date", values.date)}
                  onChange={handleInputChange}
                />
              </FormControl>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <CustomButton
              onClick={addHandleSubmit}
              onMouseOver={(e) => isHoverEnabled && handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              Add Supply Reorder
            </CustomButton>
            <CustomButton
              onClick={deleteHandleSubmit}
              onMouseOver={(e) => isHoverEnabled && handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              Delete Supply Reorder
            </CustomButton>
            <CustomButton
              onClick={viewHandleSubmit}
              onMouseOver={(e) => isHoverEnabled && handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              View Supply Reorder
            </CustomButton>
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
                        <th>Ingredient ID</th>
                        <th>Inventory ID</th>

                        <th>Name</th>
                        <th>Cost</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popupData.data.table.rows
                        .filter((item) => item.inventory_id !== null)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                checked={checkedItems[item.inventory_id]}
                                onChange={() =>
                                  handleCheckboxChange(item.inventory_id)
                                }
                              />
                            </td>
                            <td>{item.ingredient_id}</td>
                            <td>{item.inventory_id}</td>

                            <td>{item.name}</td>
                            <td>{item.cost}</td>
                            <td>
                              <TextField
                                type="number"
                                value={item.amount}
                                onChange={(e) =>
                                  handleAmountChange(e, item.inventory_id)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>NO data available</p>
              )}
              <CustomButton
                onClick={() => {
                  console.log(
                    "Selected Inventory Items:",
                    selectedInventoryItems
                  );

                  addSupplyReorder(selectedInventoryItems, values.amounts);

                  setOpenPopup(false);
                  handleCloseModal();
                }}
              >
                Done
              </CustomButton>
            </DialogContent>
          </Dialog>

          {/* View Supply Reorder Modal */}
          <Dialog open={openViewPopup} onClose={() => setOpenViewPopup(false)}>
            <DialogContent>
              {reorderItemsData && reorderItemsData.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Reorder ID</th>
                        <th>Item ID</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reorderItemsData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.reorder_id}</td>
                          <td>{item.item_id}</td>
                          <td>{item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No data available</p>
              )}
              <CustomButton onClick={() => setOpenViewPopup(false)}>
                Close
              </CustomButton>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SupplyReorders;
