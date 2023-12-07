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
import MenuItemsButtons from "./components/MenuItems/MenuItemsButtons";
import MenuItemsTable from "./components/MenuItems/MenuItemsTable";
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
import TextToSpeech from "./components/TextToSpeech";
import HoverableElement from "./components/MagnifyingScreen/MagnifierComponent";

/**
 * @description this is the main interface of the web application. It contains the accessibility menu and features,
 * as well as the navigation to each of the different pages of the POS System.
 * @component App
 * @returns The Alley Application
 */
function App() {
  const [name, setName] = useState("");
  const [home, setHome] = useState("");
  const [magnifierActive, setMagnifierActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [magnify, setMagnify] = useState(false);
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);

  /**
   * @function handleToggleHover
   * @description toggles the text-to-speech accessibility feature on and off
   */
  const handleToggleHover = () => {
    console.log("Toggling hover state...");
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
    const speechState = !isHoverEnabled ? "enabled" : "disabled";
    console.log(`Text to Speech ${speechState}`);
    console.log("Hover state toggled. Current value:", isHoverEnabled);
    // Speak the message
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      `Text to Speech ${speechState}`
    );
    synth.speak(utterance);
  };

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
  });

  /**
   * @function toggleMagnifier
   * @description toggles the magnification accessibility feature on and off
   */
  const toggleMagnifier = () => {
    setMagnifierActive(!magnifierActive);
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

  /**
   * @description function which capitalizes the input text based on delimeter separating words
   * @function capitalizeName
   * @param {string} name
   * @param {string} delimiter
   * @returns input text in capitalized format
   */
  function capitalizeName(name, delimiter) {
    const words = name.split(delimiter);

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
  }

  /**
   * @function highContrastMode
   * @description toggles the high contrast accessibility feature of the website on and off
   */
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

  /**
   * @function openAccessibility
   * @description opens the accessibility menu pop-up for features to be accessible to the user
   */
  const openAccessibility = () => {
    document.getElementById("accessibilityMenu").style.display = "block";
    document.getElementById("closedAccessibilityMenu").style.display = "none";
  };

  /**
   * @function closeAccessibility
   * @description closes the accessibility menu pop-up for features to be hidden from the user
   */
  const closeAccessibility = () => {
    document.getElementById("accessibilityMenu").style.display = "none";
    document.getElementById("closedAccessibilityMenu").style.display = "block";
  };

  const isHomePage = location.pathname === "/";
  return (
    <div className="App" onLoad={loadCurrentMode}>
      <div></div>
      {isHomePage && (
        <Login
          isHoverEnabled={isHoverEnabled}
          handleToggleHover={handleToggleHover}
        />
      )}
      <Routes>
        <Route
          path="/AnalyzeTrends"
          element={
            <AnalyzeTrends
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/Inventory"
          element={
            <Inventory
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/Ingredients"
          element={
            <Ingredients
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/MenuItems"
          element={
            <MenuItems
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/MenuItemsButtons"
          element={
            <MenuItemsButtons
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/MenuItemsTable"
          element={
            <MenuItemsTable
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/SupplyReorder"
          element={
            <SupplyReorder
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/manager"
          element={
            <ManagerView
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/customer"
          element={
            <CustomerView
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/drink_series/:category"
          element={
            <DrinkSeries
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/build_drink"
          element={
            <BuildDrink
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/view_cart"
          element={
            <ViewCart
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/customer_checkout"
          element={
            <CustomerCheckout
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/Menu"
          element={<Menu />}
          isHoverEnabled={isHoverEnabled}
          handleToggleHover={handleToggleHover}
        />
        <Route
          path="/MenuAddOns"
          element={
            <MenuAddOns
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />

        <Route
          path="/DrinkOptions"
          element={
            <DrinkOptions
              capitalizeName={capitalizeName}
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/AddDrink/:category"
          element={
            <AddDrink
              capitalizeName={capitalizeName}
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/AddOn"
          element={
            <AddOn
              capitalizeName={capitalizeName}
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/OrderSummary"
          element={
            <OrderSummary
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/MakeNewOrder"
          element={
            <MakeNewOrder
              isHoverEnabled={isHoverEnabled}
              handleToggleHover={handleToggleHover}
            />
          }
        />
        <Route
          path="/TextToSpeech"
          element={
            <TextToSpeech
              isHoverEnabled={isHoverEnabled}
              toggleHover={handleToggleHover}
            />
          }
        />
      </Routes>

      <button id="closedAccessibilityMenu" onClick={openAccessibility}>
        &lt;
      </button>
      <div id="accessibilityMenu">
        <HoverableElement magnifierActive={magnifierActive} />
        <button className="toggle" onClick={toggleMagnifier}>
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
        <button className="translateNotAvailable">
          Translate Not Available
        </button>
        <button className="speech">
          <img src={speechIcon} className="image" onClick={handleToggleHover} />
        </button>
        <button className="closeAccessibility" onClick={closeAccessibility}>
          Close Accessibility
        </button>
        <HoverableElement />
      </div>
    </div>
  );
}

export default App;
