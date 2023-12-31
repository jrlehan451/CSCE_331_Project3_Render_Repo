import React, { useEffect, useState } from "react";
import axios from "axios";
import "./view_cart.css";
import backArrowImage from "./images/back_arrow.png";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";

/**
 * @description This component displays the summary of all the drinks currently in the customer's order.
 * It also allows the customer to delete drinks from the order if desired.
 * @component ViewCart
 * @returns
 */
const ViewCart = (props) => {
  const { isHoverEnabled, handleToggleHover } = props;
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false);

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

  /**
   * @description navigation to the customer home page from the view cart page
   * @function navCustomerHome
   */
  const navCustomerHome = () => {
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("view_cart", "customer");
  };

  useEffect(() => {
    const protection = async () => {
      const role = localStorage.getItem("Role");
      switch (role) {
        case "Customer":
          break;
        default:
          window.location.href = window.location.origin;
          break;
      }
    };

    protection();
  });

  /**
   * @description deletes drinks from the current customer order
   * @function deleteDrinkFromOrder
   * @param {int} drinkId
   */
  const deleteDrinkFromOrder = (drinkId) => {
    let selected = document.getElementById(drinkId);
    selected.style.display = "none";

    let storedDrinks = JSON.parse(sessionStorage.getItem("currentOrderDrinks"));
    for (var i = 0; i < storedDrinks.length; i++) {
      if (storedDrinks[i].drinkId == drinkId) {
        storedDrinks.splice(i, 1);
        break;
      }
    }
    sessionStorage.setItem("currentOrderDrinks", JSON.stringify(storedDrinks));
  };

  /**
   * @description navigates to the checkout page and submits the customer order to the correct entities in the database
   * @function goToCheckout
   * @param {*} e
   */
  const goToCheckout = async (e) => {
    e.preventDefault();

    if (document.getElementById("cname").value == "") {
      alert("Please enter a customer name");
    } else {
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
          customer: document.getElementById("cname").value,
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
    }
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

  return (
    <div className="view-cart-background">
      <button
        onClick={navCustomerHome}
        className="back-build"
        onMouseOver={(e) => handleHover(e, isHoverEnabled)}
        onMouseOut={handleMouseOut}
      >
        <img
          src={backArrowImage}
          alt="Back Arrow"
          width="60%"
          height="10%"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        />
      </button>

      <h1
        className="your-cart"
        onMouseOver={(e) => handleHover(e, isHoverEnabled)}
        onMouseOut={handleMouseOut}
      >
        Your Cart
      </h1>

      <div className="cart-container">
        {currDrinksInOrder.map((drink) => (
          <div id={drink.drinkId} className="cart-drink">
            <h3
              className="cart-drink-name"
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              {" "}
              Drink: {capitalizeName(drink.drinkName, " ")}{" "}
            </h3>
            <h4
              className="cart-drink-info"
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              {" "}
              Add-On #1: {capitalizeName(drink.addOn1Name, " ")}{" "}
            </h4>
            <h4
              className="cart-drink-info"
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              {" "}
              Add-On #2: {capitalizeName(drink.addOn2Name, " ")}{" "}
            </h4>
            <h4
              className="cart-drink-info"
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              {" "}
              Size: {capitalizeName(drink.size, " ")}{" "}
            </h4>
            <h4
              className="cart-drink-info"
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              {" "}
              Quantity: {capitalizeName(drink.quantity, " ")}{" "}
            </h4>
            <button
              onClick={() => deleteDrinkFromOrder(drink.drinkId)}
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              Delete From Order
            </button>
          </div>
        ))}
        <p id="drinks"></p>
      </div>

      <div className="checkout-container">
        <p
          id="currentTotalCost"
          className="total"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          {getCurrentTotal()}
        </p>
        <p
          className="name"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Enter Name:{" "}
        </p>
        <input className="c-name" type="text" id="cname" name="cname" />
        <br />
        <button
          onClick={goToCheckout}
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ViewCart;
