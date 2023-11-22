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
} from "@mui/material";

const SupplyReorders = () => {
  const [data, setData] = useState([]);

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
                <TextField id="filled-basic" variant="filled" type="number" />
              </FormControl>
            </div>
            <div>
              <InputLabel htmlFor="filled-basic">Date:</InputLabel>
              <FormControl>
                <TextField id="filled-basic" variant="filled" type="number" />
              </FormControl>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <CustomButton>Add Item</CustomButton>
            <CustomButton>Delete Item</CustomButton>
            <CustomButton>Update Item</CustomButton>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SupplyReorders;
