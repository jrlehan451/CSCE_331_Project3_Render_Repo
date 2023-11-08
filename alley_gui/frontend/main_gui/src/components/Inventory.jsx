import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";

//import axios from "axios"; // Make sure to import axios for HTTP requests

const Inventory = () => {
  const [data, setData] = useState([]);
  const [itemId, setItemId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [inventorytName, setInventoryName] = useState("");

  // useEffect(() => {
  //   axios
  //     .get("/api/data")
  //     .then((response) => {
  //       setData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    axios.get("http://localhost:4000/inventory").then(function (response) {
      setInventoryName(response.data);
    });
  }, []);

  return (
    <div>
      <div>
        <h1>Inventory Page</h1>
        {inventorytName.name}
        <table>
          <thread>
            <tr>
              <th>Column 1</th>
              <th>Column 2</th>
              <th>Column 3</th>
              <th>Column 4</th>
            </tr>
          </thread>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Item ID"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Quantity Per Unit"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button type="Submit">Submit</button>
          <button type="reset">Reset</button>
        </form>
      </div>
    </div>
  );
};

export default Inventory;
