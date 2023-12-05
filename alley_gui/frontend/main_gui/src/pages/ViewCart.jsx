import React, { useState } from "react";
import axios from "axios";
import "./view_cart.css";
import backArrowImage from "./images/back_arrow.png";

import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";
import TextToSpeech from "../components/TextToSpeech";

const ViewCart = () => {
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
  };
  const handleGridCellHover = (params) => {
    console.log("handleGridCellHover is called!");

    if (isHoverEnabled) {
      console.log("isHoverEnabled is false");

      const cellContent = params.value.toString();
      console.log("Cell Content:", cellContent);

      // Call the handleHover function to initiate text-to-speech
      handleTableFieldSpeech(cellContent);
      //handleTableFieldSpeech("This is a test");
    }
  };

  let currDrinksInOrder = JSON.parse(
    sessionStorage.getItem("currentOrderDrinks")
  );

  const capitalizeName = (name, delimiter) => {
    const words = name.split(delimiter);
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
  };

  const navCustomerHome = () => {
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("view_cart", "customer");
  };

  const goToCheckout = async (e) => {
    e.preventDefault();

    var currDrinksInOrder = JSON.parse(
      sessionStorage.getItem("currentOrderDrinks")
    );

    var totalCost = 0;
    for (var i = 0; i < currDrinksInOrder.length; i++) {
      var currentDrink = 0;
      currentDrink += parseFloat(currDrinksInOrder[i].drinkCost);
      if (currDrinksInOrder[i].addOn1Id != -1) {
        currentDrink += parseFloat(currDrinksInOrder[i].addOn1Cost);
      }
      if (currDrinksInOrder[i].addOn2Id != -1) {
        currentDrink += parseFloat(currDrinksInOrder[i].addOn2Cost);
      }
      currentDrink *= parseInt(currDrinksInOrder[i].quantity);
      totalCost += currentDrink;
    }

    try {
      await axios.post("https://thealley.onrender.com/post_customer_order", {
        currDrinksInOrder: sessionStorage.getItem("currentOrderDrinks"),
        customer: "customer",
        totalCost: totalCost.toFixed(2),
      });
    } catch (err) {
      console.error(`Error: ${err}`);
    }

    var currLocation = window.location.href;
    window.location.href = currLocation.replace(
      "view_cart",
      "customer_checkout"
    );
  };

  const getCurrentTotal = () => {
    let currDrinksInOrder = [];
    if (sessionStorage.getItem("currentOrderDrinks")) {
      currDrinksInOrder = JSON.parse(
        sessionStorage.getItem("currentOrderDrinks")
      );
    }

    var totalCost = 0;
    for (var i = 0; i < currDrinksInOrder.length; i++) {
      var currentDrink = 0;
      currentDrink += parseFloat(currDrinksInOrder[i].drinkCost);
      if (currDrinksInOrder[i].addOn1Id != -1) {
        currentDrink += parseFloat(currDrinksInOrder[i].addOn1Cost);
      }
      if (currDrinksInOrder[i].addOn2Id != -1) {
        currentDrink += parseFloat(currDrinksInOrder[i].addOn2Cost);
      }
      currentDrink *= parseInt(currDrinksInOrder[i].quantity);
      totalCost += currentDrink;
    }

    return "Total: " + totalCost.toFixed(2);
  };

  const highContrastMode = () => {
    const body = document.querySelector("body");
    if (body.classList.contains("contrast")) {
      body.classList.remove("contrast");
      sessionStorage.setItem("high_contrast_mode", false);
    } else {
      body.classList.add("contrast");
      sessionStorage.setItem("high_contrast_mode", true);
    }
  };

  const loadCurrentMode = () => {
    if (sessionStorage.getItem("high_contrast_mode")) {
      const body = document.querySelector("body");
      if (body.classList.contains("contrast") == false) {
        body.classList.add("contrast");
      }
    } else {
      const body = document.querySelector("body");
      body.classList.remove("contrast");
    }
  };

  return (
    <div className="view-cart-background" onLoad={() => loadCurrentMode()}>
      <button onClick={highContrastMode}>test</button>
      <button onClick={navCustomerHome} className="back-build">
        <img src={backArrowImage} alt="Back Arrow" width="60%" height="10%" />
      </button>

      <h1 className="your-cart">Your Cart</h1>

      <div className="cart-container">
        {currDrinksInOrder.map((drink) => (
          <div className="cart-drink">
            <h3 className="cart-drink-name">
              {" "}
              Drink: {capitalizeName(drink.drinkName, " ")}{" "}
            </h3>
            <h4 className="cart-drink-info">
              {" "}
              Add-On #1: {capitalizeName(drink.addOn1Name, " ")}{" "}
            </h4>
            <h4 className="cart-drink-info">
              {" "}
              Add-On #2: {capitalizeName(drink.addOn2Name, " ")}{" "}
            </h4>
            <h4 className="cart-drink-info">
              {" "}
              Size: {capitalizeName(drink.size, " ")}{" "}
            </h4>
            <h4 className="cart-drink-info">
              {" "}
              Quantity: {capitalizeName(drink.quantity, " ")}{" "}
            </h4>
          </div>
        ))}
        <p id="drinks"></p>
      </div>

      <div className="checkout-container">
        <p id="currentTotalCost" className="total">
          {getCurrentTotal()}
        </p>
        <button
          onClick={goToCheckout}
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Checkout
        </button>
      </div>
      <TextToSpeech isHoverEnabled={isHoverEnabled} toggleHover={toggleHover} />
    </div>
  );
};

export default ViewCart;
