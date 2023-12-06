import React, { useEffect, useState } from "react";
import "./customer_checkout.css";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";

const orderNumber = Math.floor((Math.random() * Date.now()) / 100000);

/**
 * @description This component displays the customer checkout page and allows the customer to return
 * to the customer home page to make a new order.
 * @component Checkout
 * @returns customer checkout page
 */
const Checkout = (props) => {
  const { isHoverEnabled, handleToggleHover } = props;
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false);

  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
    handleToggleHover();
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

  const makeNewOrder = () => {
    sessionStorage.clear();
    var currLocation = window.location.href;
    window.location.href = currLocation.replace(
      "customer_checkout",
      "customer"
    );
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

  return (
    <div className="checkout-background">
      <div className="container">
        <h1
          className="confirmation"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Order Confirmation #{orderNumber}
        </h1>
      </div>
      <div className="new-order">
        <button
          onClick={makeNewOrder}
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
          className="confirmation"
        >
          New Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
