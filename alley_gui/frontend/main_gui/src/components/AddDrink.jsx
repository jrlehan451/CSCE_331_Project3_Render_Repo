import CashierOrder from "./CashierOrder";
import LanguageSelect from "./LanguageSelect";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../drink_options.css";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";

/**
 *
 * @param {*} to
 * @param {*} className
 * @param {*} children
 * @returns navigation to all the different drink series pages on the cashier side
 */
function ButtonLink({ to, className, children }) {
  return (
    <Link to={to}>
      <button class={className}>{children}</button>
    </Link>
  );
} // Should get refactored into just a separate component to be so honest

/**
 * @description This component displays all the drinks available for the selected category. Additionally, it displays
 * a table that provides a summary of all drinks in the current order.
 * @component AddDrink
 * @param {*} capatalizeName
 * @returns component that displays the different drink series add drink pages
 */
const AddDrink = ({ capitalizeName, isHoverEnabled, handleToggleHover }) => {
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false);
  const [orderDrinks, setOrderDrinks] = useState([]);
  const [orderAdd_ons, setOrderAddOns] = useState([]);

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

  /**
   * @function storedDrinks
   * @description stores all the current drinks in the cashier's order
   */
  useEffect(() => {
    const storedDrinks = JSON.parse(sessionStorage.getItem("drinks"));
    if (storedDrinks) {
      setOrderDrinks(storedDrinks);
    }
  }, []);

  /**
   * @description sets and saves all the drinks in the current order
   * @function orderDrinks
   */
  useEffect(() => {
    sessionStorage.setItem("drinks", JSON.stringify(orderDrinks));
  }, [orderDrinks]);

  /**
   * @description gets the add-ons tied to the selected drink
   * @function storedAddOns
   */
  useEffect(() => {
    const storedAddOns = JSON.parse(sessionStorage.getItem("add_ons"));
    if (storedAddOns) {
      setOrderAddOns(storedAddOns);
    }
  }, []);

  /**
   * @function orderAdd_ons
   * @description sets the add-ons for the selected drink
   */
  useEffect(() => {
    sessionStorage.setItem("add_ons", JSON.stringify(orderAdd_ons));
  }, [orderAdd_ons]);

  function drinkToLocal(_id, _name, _cost) {
    let newDrink = {
      id: _id,
      name: _name,
      cost: _cost,
    };

    setOrderDrinks((prevDrinks) => {
      return [...prevDrinks, newDrink];
    });

    setOrderAddOns((prevAO) => {
      return [...prevAO, []];
    });
  }

  /**
   * @function deleteDrinkFromLocal
   * @description provides the functionality to delete a drink from the current order
   */
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
  }

  const { category } = useParams();
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    const drinkOptions = async () => {
      try {
        const response = await axios.get(
          "https://thealley.onrender.com/add_drink_jsx",
          { params: { category: category } }
        );
        const jsonVals = await response.data;
        console.log("Working");
        console.log(jsonVals.data.drinks);
        setDrinks(jsonVals.data.drinks.rows);
      } catch (err) {
        console.log("ERROR");
        console.error(err.message);
      }
    };

    drinkOptions();
  }, [category]);

  return (
    <div>
      <span
        class="back"
        onMouseOver={(e) => handleHover(e, isHoverEnabled)}
        onMouseOut={handleMouseOut}
        onClick={() => navigate(-1)}
      ></span>
      <div class="columnWrapper">
        <h1
          class="green"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Add Drink
        </h1>
      </div>
      <div class="columnWrapper">
        <div class="column bodyColumn">
          <div class="button-container">
            {drinks.map((drink) => (
              <button
                key={drink.drink_id}
                onClick={() =>
                  drinkToLocal(drink.drink_id, drink.name, drink.cost)
                }
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                {capitalizeName(drink.name, " ")}
              </button>
            ))}
          </div>
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
            <ButtonLink to={"../AddOn"} className={"bottom-button"}>
              Add-Ons
            </ButtonLink>
            <ButtonLink to={"../OrderSummary"} className={"bottom-button"}>
              Checkout
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDrink;
