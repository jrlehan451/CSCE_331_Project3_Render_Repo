import React from 'react';
import './customer_checkout.css'; // Import your CSS file

const Checkout = () => {
  const makeNewOrder = () => {
    sessionStorage.clear();
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("customer_checkout", "customer");
  };

  return (
    <div className="checkout-background">
        <div className="container">
            <h1 className="confirmation">Order Confirmation #1</h1>
        </div>

        <div className="new-order">
            <button onClick={makeNewOrder} className="confirmation">New Order</button>
        </div>
    </div>
  );
};

export default Checkout;