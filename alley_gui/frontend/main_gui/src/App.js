import "./App.css";
import Header from "./components/Header";
import LanguageSelect from "./components/LanguageSelect";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import CashierView from "./pages/CashierView";
import ManagerView from "./pages/ManagerView";
import CustomerView from "./pages/CustomerView";

import AnalyzeTrends from "./pages/AnalyzeTrends";
import Inventory from "./components/Inventory";
import Ingredients from "./components/Ingredients";
import MenuItems from "./components/MenuItems/MenuItems";
import SupplyReorder from "./components/SupplyReorders";
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import DrinkSeries from "./pages/DrinkSeries";
import BuildDrink from "./pages/BuildDrink";
import ViewCart from "./pages/ViewCart";
import MenuAddOns from "./pages/MenuAddOns";
import CustomerCheckout from "./pages/CustomerCheckout";
import DrinkOptions from "./components/DrinkOptions";
import AddDrink from "./components/AddDrink";
import AddOn from "./components/AddOn";
import OrderSummary from "./components/OrderSummary";
import MakeNewOrder from "./components/MakeNewOrder";
import backIcon from "./pages/images/magnifyingGlass.png";
import contrastIcon from "./pages/images/contrast.png";
import translateIcon from "./pages/images/translate.png";
import speechIcon from "./pages/images/speech.jpg";

//BrowserRouter basename="/tutorial"> for
function App() {
  const [name, setName] = useState("");
  const [home, setHome] = useState("");
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [magnify, setMagnify] = useState(false);
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);

  const handleToggleHover = () => {
    console.log("Toggling hover state...");
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
    console.log("Hover state toggled. Current value:", isHoverEnabled);
  };

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });

      // Update magnification based on some condition
      //const shouldMagnify = true/* your condition here */;
      //setMagnify(shouldMagnify);
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const toggleMagnify = () => {
    setMagnify(!magnify);
  };

  useEffect(() => {
    axios.get("https://thealley.onrender.com/home").then(function (response) {
      setHome(response.data);
    });
  }, []);

  async function postName(e) {
    e.preventDefault();

    try {
      await axios.post("https://thealley.onrender.com/post_name", {
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
  }

  const highContrastMode = () => {
    const body = document.querySelector("body");
    if (body.classList.contains("contrast")) {
      body.classList.remove("contrast");
      document.body.style.backgroundColor = "#ffefe2";
      localStorage.setItem("high_contrast_mode", false);
    } else {
      body.classList.add("contrast");
      document.body.style.backgroundColor = "black";
      localStorage.setItem("high_contrast_mode", true);
    }
  };

  const loadCurrentMode = () => {
    if (localStorage.getItem("high_contrast_mode") === true) {
      const body = document.querySelector("body");
      if (body.classList.contains("contrast") === false) {
        body.classList.add("contrast");
        document.body.style.backgroundColor = "black";
      }
    } else {
      const body = document.querySelector("body");
      body.classList.remove("contrast");
      document.body.style.backgroundColor = "#ffefe2";
    }
  };

  const isHomePage = location.pathname === "/";
  return (
    <div className="App" onLoad={loadCurrentMode}>
      <div
        className={`cursor ${magnify ? "magnify" : ""}`}
        style={{
          left: `${mousePosition.x - 80}px`,
          top: `${mousePosition.y - 80}px`,
        }}
      />

      {isHomePage && <Login />}
      <Inventory
        isHoverEnabled={isHoverEnabled}
        handleToggleHover={handleToggleHover}
      />

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
        <Route path="/Menu" element={<Menu />} />
        <Route path="/MenuAddOns" element={<MenuAddOns />} />

        <Route
          path="/DrinkOptions"
          element={<DrinkOptions capitalizeName={capitalizeName} />}
        />
        <Route
          path="/AddDrink/:category"
          element={<AddDrink capitalizeName={capitalizeName} />}
        />
        <Route
          path="/AddOn"
          element={<AddOn capitalizeName={capitalizeName} />}
        />
        <Route path="/OrderSummary" element={<OrderSummary />} />
        <Route path="/MakeNewOrder" element={<MakeNewOrder />} />

        {/*<Route path="/menu" element={<MenuView />} />
        <Route path="/cashier" element={<CashierView />} />

        <Route path="/customer" element={<CustomerView />} /> */}
      </Routes>
      <button className="toggle" onClick={toggleMagnify}>
        <img src={backIcon} className="image" />
        {magnify}
      </button>
      <button className="high-contrast" onClick={highContrastMode}>
        <img src={contrastIcon} className="image" />
      </button>
      <button className="translate">
        <img src={translateIcon} className="image" />
        <LanguageSelect></LanguageSelect>
      </button>

      <button className="speech" onClick={handleToggleHover}>
        <img src={speechIcon} className="image" />
      </button>
    </div>
  );
}

export default App;
