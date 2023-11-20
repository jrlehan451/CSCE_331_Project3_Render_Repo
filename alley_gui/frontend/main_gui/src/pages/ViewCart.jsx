import React from 'react';
import './view_cart.css';
import backArrowImage from './images/back_arrow.png';

const ViewCart = () => {
    
  const navCustomerHome = () => {
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("view_cart", "customer");
  };

  const goToCheckout = () => {
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("view_cart", "customer_checkout");
  };

  const displayOrder = () => {
    const currDrinksInOrder = sessionStorage.getItem("currentOrderDrinks");
    const orderInfo = document.getElementById("test");
    for (var i = 0; i < currDrinksInOrder.length; i++) {
      orderInfo.textContent = currDrinksInOrder[i].drinkName + " " + currDrinksInOrder[i].size + " " 
      + currDrinksInOrder[i].addOn1Name + " " + currDrinksInOrder[i].addOn2Name + " " + currDrinksInOrder[i].quantity;
    }
  }

  return (
    <div className="view-cart-background" onLoad={() => displayOrder()}>
      <button onClick={navCustomerHome} className="back-build">
        <img src={backArrowImage} alt="Back Arrow" width="60%" height="10%" />
      </button>

      <h1 className="your-cart">Your Cart</h1>

      <div className="cart-container">
        {/* Add cart items rendering logic here */}
        <p id="test"></p>
      </div>

      <div className="checkout-container">
        <p className="total">Total: $$</p>
        <button onClick={goToCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default ViewCart;
