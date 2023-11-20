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
import ViewCart from "./pages/ViewCart";
import CustomerCheckout from "./pages/CustomerCheckout";
import DrinkOptions from "./components/DrinkOptions";
import AddDrink from "./components/AddDrink";
import AddOn from "./components/AddOn";
import OrderSummary from "./components/OrderSummary";
import MakeNewOrder from "./components/MakeNewOrder";

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

  function capitalizeName(name, delimiter) {
    const words = name.split(delimiter);
  
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
  
    return words.join(" ");
  };

  const isHomePage = location.pathname === "/";
  return (
    <div className="App">
      {isHomePage && <Header />}
      {/* This is used for making connection between backend and frontend commented
      out for github release
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
        <Route path="/view_cart" element={<ViewCart />} />
        <Route path="/customer_checkout" element={<CustomerCheckout />} />

        <Route path="/DrinkOptions" element={<DrinkOptions capitalizeName={capitalizeName} />} />
        <Route path="/AddDrink/:category" element={<AddDrink capitalizeName={capitalizeName} />} />
        <Route path="/AddOn" element={<AddOn capitalizeName={capitalizeName} />} />
        <Route path="/OrderSummary" element={<OrderSummary/>} />
        <Route path="/MakeNewOrder" element={<MakeNewOrder/>} />

        {/*<Route path="/menu" element={<MenuView />} />
        <Route path="/cashier" element={<CashierView />} />

        <Route path="/customer" element={<CustomerView />} /> */}
      </Routes>
    </div>
  );
}

export default App;
