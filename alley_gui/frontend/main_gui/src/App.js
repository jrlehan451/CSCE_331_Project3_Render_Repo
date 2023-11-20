import "./App.css";
import Header from "./components/Header";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import MenuView from "./pages/MenuView";
import CashierView from "./pages/CashierView";
import ManagerView from "./pages/ManagerView";
import CustomerView from "./pages/CustomerView";

import AnalyzeTrends from "./components/AnalyzeTrends";
import Inventory from "./components/Inventory";
import Ingredients from "./components/Ingredients";
import MenuItems from "./components/MenuItems";
import SupplyReorder from "./components/SupplyReorders";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DrinkSeries from "./pages/DrinkSeries";
import BuildDrink from "./pages/BuildDrink";

//BrowserRouter basename="/tutorial"> for
function App() {
  const [name, setName] = useState("");
  const [home, setHome] = useState("");

  useEffect(() => {
    axios.get("http://localhost:4000/home").then(function (response) {
      setHome(response.data);
    });
  }, []);

  async function postName(e) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/post_name", {
        name,
      });
    } catch (error) {
      console.log(error);
    }
  }
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  return (
    <div className="App">
      {isHomePage && <Header />}

      {/* This is used for making connection between backend and frontend
      commented out for github release 
      <form onSubmit={postName}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Send Name</button>
      </form>
      {home} */}
      <Routes>
        <Route path="/AnalyzeTrends" element={<AnalyzeTrends />} />
        <Route path="/Inventory" element={<Inventory />} />
        <Route path="/Ingredients" element={<Ingredients />} />
        <Route path="/MenuItems" element={<MenuItems />} />
        <Route path="/SupplyReorder" element={<SupplyReorder />} />
        <Route path="/manager" element={<ManagerView />} />
        <Route path="/customer" element={<CustomerView />} />
        <Route path="/drink_series/:category" element={<DrinkSeries />} />
        <Route path="/build_drink" element={<BuildDrink />} />

        {/*<Route path="/menu" element={<MenuView />} />
        <Route path="/cashier" element={<CashierView />} />

        <Route path="/customer" element={<CustomerView />} /> */}
      </Routes>
    </div>
  );
}

export default App;
