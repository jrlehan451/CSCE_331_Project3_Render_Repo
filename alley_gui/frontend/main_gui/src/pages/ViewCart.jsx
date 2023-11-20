import React from 'react';
import './view_cart.css';
import backArrowImage from './images/back_arrow.png';

const ViewCart = () => {
    
  const navCustomerHome = () => {
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("view_cart", "customer");
  };

  const goToCheckout = () => {
    // Implement your logic for navigating to the checkout
  };

  return (
    <div className="view-cart-background">
      <button onClick={navCustomerHome} className="back-build">
        <img src={backArrowImage} alt="Back Arrow" width="60%" height="10%" />
      </button>

      <h1 className="your-cart">Your Cart</h1>

      <div className="cart-container">
        {/* Add cart items rendering logic here */}
      </div>

      <div className="checkout-container">
        <p className="total">Total: $$</p>
        <button onClick={goToCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default ViewCart;
