import React from 'react';
import axios from "axios";
import './view_cart.css';
import backArrowImage from './images/back_arrow.png';

const ViewCart = () => {

  let currDrinksInOrder = JSON.parse(sessionStorage.getItem("currentOrderDrinks"));

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

  const goToCheckout = async(e) => {
    e.preventDefault();

    var currDrinksInOrder = JSON.parse(sessionStorage.getItem("currentOrderDrinks"));

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
      await axios.post("http://localhost:4000/post_customer_order", {
          currDrinksInOrder: sessionStorage.getItem('currentOrderDrinks'),
          customer: "customer",
          totalCost: totalCost.toFixed(2),
      });
    } catch(err) {
        console.error(`Error: ${err}`);
    }

    var currLocation = window.location.href;
    window.location.href = currLocation.replace("view_cart", "customer_checkout");
  }

  const getCurrentTotal = () => {
    let currDrinksInOrder = []
    if (sessionStorage.getItem("currentOrderDrinks")) {
      currDrinksInOrder = JSON.parse(sessionStorage.getItem("currentOrderDrinks"));
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
  }

  return (
    <div className="view-cart-background">
      <button onClick={navCustomerHome} className="back-build">
        <img src={backArrowImage} alt="Back Arrow" width="60%" height="10%" />
      </button>

      <h1 className="your-cart">Your Cart</h1>

      <div className="cart-container">
          {currDrinksInOrder.map((drink) => (
            <div className="cart-drink">
              <h3 className="cart-drink-name"> Drink: {capitalizeName(drink.drinkName, " ")} </h3>
              <h4 className="cart-drink-info"> Add-On #1: {capitalizeName(drink.addOn1Name, " ")} </h4>
              <h4 className="cart-drink-info"> Add-On #2: {capitalizeName(drink.addOn2Name, " ")} </h4>
              <h4 className="cart-drink-info"> Size: {capitalizeName(drink.size, " ")} </h4>
              <h4 className="cart-drink-info"> Quantity: {capitalizeName(drink.quantity, " ")} </h4>
            </div>
          ))}
        <p id="drinks"></p>
      </div>

      <div className="checkout-container">
        <p id="currentTotalCost" className="total">{getCurrentTotal()}</p>
        <button onClick={goToCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default ViewCart;
