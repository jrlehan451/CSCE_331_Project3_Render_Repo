import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";

function ButtonLink({ to, className, onClick, children }) {
  return (
    <Link to={to}>
      <button class={className} onClick={onClick}>
        {children}
      </button>
    </Link>
  );
} // Should get refactored into just a separate component to be so honest

/**
 * @description clears information stored in the current order in order to start a new order
 * @function clearSessionStorage
 */
function clearSessionStorage() {
  sessionStorage.clear();
  sessionStorage.clear();
}

/**
 * @description The component that displays the ability to make a new order on the cashier side
 * @component MakeNewOrder
 * @returns displays page that makes new order on cashier side
 */
const MakeNewOrder = (isHoverEnabled, handleToggleHover) => {
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

  useEffect(() => {
    const protection = async () => {
      const role = localStorage.getItem("Role");
      switch (role) {
        case "Cashier":
          break;
        default:
          window.location.href = window.location.origin;
          break;
      }
    };

    protection();
  });

  return (
    <div
      class="vhCenter"
      onMouseOver={(e) => handleHover(e, isHoverEnabled)}
      onMouseOut={handleMouseOut}
    >
      <h1
        class="green"
        onMouseOver={(e) => handleHover(e, isHoverEnabled)}
        onMouseOut={handleMouseOut}
      >
        Customer Order Completed
      </h1>
      <ButtonLink
        to={"../DrinkOptions"}
        className={"new-order-button"}
        onClick={clearSessionStorage}
      >
        Make New Order
      </ButtonLink>
    </div>
  );
};

export default MakeNewOrder;
