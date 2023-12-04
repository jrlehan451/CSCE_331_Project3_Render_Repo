import React from 'react';
import './customer_checkout.css';

const Checkout = () => {
  const makeNewOrder = () => {
    sessionStorage.clear();
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("customer_checkout", "customer");
  };

  const highContrastMode = () => {
    const body = document.querySelector('body');
    if (body.classList.contains("contrast")) {
      body.classList.remove("contrast");
      sessionStorage.setItem("high_contrast_mode", false);
    } else {
      body.classList.add("contrast");
      sessionStorage.setItem("high_contrast_mode", true);
    }
  }

  const loadCurrentMode = () => {
    if (sessionStorage.getItem("high_contrast_mode")) {
      const body = document.querySelector('body');
      if (body.classList.contains("contrast") == false) {
        body.classList.add("contrast");
      }
    } else {
      const body = document.querySelector('body');
      body.classList.remove("contrast");
    }
  }

  return (
    <div className="checkout-background" onLoad={() => loadCurrentMode()}>
      <button onClick={highContrastMode}>test</button>
        <div className="container">
            <h1 className="confirmation">Order Confirmation #{Math.floor((Math.random() * Date.now())/100000)}</h1>
        </div>
        <div className="new-order">
            <button onClick={makeNewOrder} className="confirmation">New Order</button>
        </div>
    </div>
  );
};

export default Checkout;
