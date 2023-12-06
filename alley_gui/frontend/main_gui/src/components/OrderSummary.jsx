import CashierOrder from "./CashierOrder";
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../drink_options.css";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";

/**
 * @description navigation and posting to database from
 * @function ButtonLinkOrderSummary
 * @param {int} id
 * @param {*} to
 * @param {*} className
 * @param {*} onClick
 * @param {*} children
 * @returns
 */
function ButtonLink({ id, to, className, onClick, children }) {
  return (
    <Link to={to} onClick={onClick}>
      <button id={id} class={className}>
        {children}
      </button>
    </Link>
  );
} // Should get refactored into just a separate component to be so honest

/**
 * @description This component creates the table that displays the currnent order summary on all the cashier view pages.
 * @component OrderSummary
 * @returns
 */
const OrderSummary = (isHoverEnabled, handleToggleHover) => {
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false);
  const [orderDrinks, setOrderDrinks] = useState([]);
  const [orderAdd_ons, setOrderAddOns] = useState([]);
  const [totalCost, setTotalCost] = useState(0.0);

  let navigate = useNavigate();

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
    const storedDrinks = JSON.parse(sessionStorage.getItem("drinks"));
    if (storedDrinks) {
      setOrderDrinks(storedDrinks);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("drinks", JSON.stringify(orderDrinks));
  }, [orderDrinks]);

  useEffect(() => {
    const storedAddOns = JSON.parse(sessionStorage.getItem("add_ons"));
    if (storedAddOns) {
      setOrderAddOns(storedAddOns);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("add_ons", JSON.stringify(orderAdd_ons));
  }, [orderAdd_ons]);

  function deleteDrinkFromLocal() {
    let selected = document.getElementsByClassName("selected")[0];
    selected.classList.remove("selected");
    let number = selected.children[0].innerHTML;

    let storedDrinks = JSON.parse(sessionStorage.getItem("drinks"));
    storedDrinks.splice(number - 1, 1);
    setOrderDrinks(storedDrinks);

    let storedAddOns = JSON.parse(sessionStorage.getItem("add_ons"));
    storedAddOns.splice(number - 1, 1);
    setOrderAddOns(storedAddOns);

    let deleteButton = document.getElementById("delete");
    deleteButton.classList.add("grayed-button");

    setTotalCost(calcTotalCost);
  }

  /**
   * @description functionality that ensures that a payment method is selected before the order is able to be placed
   * @function selectPayment
   */
  function selectPayment() {
    let confirmButton = document.getElementById("confirm");
    confirmButton.classList.remove("grayed-button");
  }

  /**
   * @function calcTotalCost
   * @description calculates the total cost of the current order
   */
  const calcTotalCost = useCallback(() => {
    var drinks = orderDrinks;
    var add_ons = orderAdd_ons;

    var totalCost = 0;
    for (var i = 0; i < drinks.length; ++i) {
      totalCost += parseFloat(drinks[i].cost);
      for (var j = 0; j < add_ons[i].length; ++j) {
        totalCost += parseFloat(add_ons[i][j].cost);
      }
    }

    return totalCost.toFixed(2);
  }, [orderDrinks, orderAdd_ons]);

  /**
   * @function setTotalCost
   * @description saves the total cost
   */
  useEffect(() => {
    setTotalCost(calcTotalCost);
  }, [calcTotalCost]);

  /**
   * @description uses a post server-side API call in order to the save the order made on the cashier side
   * @function postOrderToDB
   * @param {*} e
   */
  const postOrderToDB = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://thealley.onrender.com/post_order", {
        drinks: sessionStorage.getItem("drinks"),
        add_ons: sessionStorage.getItem("add_ons"),
        customer: document.getElementById("cname").value,
        totalCost: totalCost,
      });
    } catch (err) {
      console.error(`Error: ${err}`);
    }

    navigate("/MakeNewOrder");
    //var currLocation = window.location.href;
    //location.href = currLocation.replace("OrderSummary", "MakeNewOrder");
  };

  return (
    <div>
      <span class="back" onClick={() => navigate(-1)}></span>
      <div class="columnWrapper">
        <h1
          class="green"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Order Summary
        </h1>
      </div>
      <div class="columnWrapper">
        <div class="column bodyColumn">
          <div class="columnWrapper">
            <label
              class="spacedLabel green"
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              Customer Name:{" "}
            </label>
            <input class="customer-name" type="text" id="cname" name="cname" />
            <br />
          </div>
          <h3
            class="green"
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Select Payment Method:{" "}
          </h3>
          <button
            onClick={selectPayment}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
            class="payment-option"
          >
            Cash
          </button>
          <br />
          <button
            onClick={selectPayment}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
            class="payment-option"
          >
            Credit
          </button>
          <br />
          <button
            onClick={selectPayment}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
            class="payment-option"
          >
            Debit
          </button>
        </div>
        <div class="column bodyColumn">
          <h3
            class="brown"
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Current Order
          </h3>
          <table
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            <CashierOrder
              drinks={orderDrinks}
              add_ons={orderAdd_ons}
            ></CashierOrder>
          </table>
          <div
            class="columnWrapper"
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            <button
              id="delete"
              onClick={deleteDrinkFromLocal}
              class="bottom-button grayed-button"
            >
              Delete Selected
            </button>
            <ButtonLink
              id={"confirm"}
              to={"../MakeNewOrder"}
              className={"bottom-button grayed-button"}
              onClick={postOrderToDB}
            >
              Confirm
            </ButtonLink>
            <p
              class="total-cost"
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              Total Cost: ${totalCost}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
