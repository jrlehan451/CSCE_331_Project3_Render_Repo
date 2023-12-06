import React from 'react';
import './customer_checkout.css';
const orderNumber = Math.floor((Math.random() * Date.now())/100000);

/**
 * @description This component displays the customer checkout page and allows the customer to return 
 * to the customer home page to make a new order.
 * @component Checkout
 * @returns customer checkout page
 */
const Checkout = () => {
  const makeNewOrder = () => {
    sessionStorage.clear();
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("customer_checkout", "customer");
  };

  return (
    <div className="checkout-background">
        <div className="container">
            <h1 className="confirmation">Order Confirmation #{orderNumber}</h1>
        </div>
        <div className="new-order">
            <button onClick={makeNewOrder} className="confirmation">New Order</button>
        </div>
    </div>
  );
};

export default Checkout;
