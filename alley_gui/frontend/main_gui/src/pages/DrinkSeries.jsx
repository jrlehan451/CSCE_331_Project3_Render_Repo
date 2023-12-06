import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./customer_home.css";

import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";

/**
 * @description This component displays all the drinks and their images of a particular series and allows a customer to navigate between all the different series to pick their desired drinks.
 * @component DrinkSeries
 * @returns Drink Series component which displays all the drinks for a particular series and allows a customer to begin the process of adding that drink to their order
 */
const DrinkSeries = (props) => {
  const [drinkCategories, setData] = useState([]);
  const [drinkSeriesItems, setDrinks] = useState([]);

  const { isHoverEnabled, handleToggleHover } = props;
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false); // Add this line

  const toggleHover = (props) => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
    //handleToggleHover();
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

  const capitalizeName = (name, delimiter) => {
    const words = name.split(delimiter);
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  const getDrinkSeries = (category) => {
    var currLocation = window.location.href;
    if (currLocation.includes("customer")) {
      window.location.href =
        currLocation.replace("customer", "drink_series/") + category;
    } else {
      const array = currLocation.split("/");
      window.location.href = currLocation.replace(array[4], category);
    }
  };

  const buildDrink = (drinkName, drinkId, drinkCost) => {
    var currLocation = window.location.href;
    const array = currLocation.split("/");
    window.location.href = currLocation.replace(
      "drink_series/" + array[4],
      "build_drink"
    );

    sessionStorage.setItem("customer_drink_name", drinkName);
    sessionStorage.setItem("customer_drink_id", drinkId);
    sessionStorage.setItem("customer_drink_cost", drinkCost);
  };

  const getCurrentTotal = () => {
    let currDrinksInOrder = [];
    if (sessionStorage.getItem("currentOrderDrinks")) {
      currDrinksInOrder = JSON.parse(
        sessionStorage.getItem("currentOrderDrinks")
      );
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
  };

  /**
   * @description redirects so that the customer can view their cart of current drinks
   * @function viewCartFromDrinkSeries
   */
  const viewCartFromDrinkSeries = () => {
    var currLocation = window.location.href;
    const array = currLocation.split("/");
    window.location.href = currLocation.replace(
      "drink_series/" + array[4],
      "view_cart"
    );
  };

  const { category } = useParams();

  function getImage(name) {
    name = "/drink_images/" + name;
    name += ".png";
    const words = name.split(" ");
    return words.join("_");
  }

  /**
   * @description uses server-side API call to get the different drink series and display them in the side bar menu, as well as all the drinks in the currently selected series
   * @function drinkSeries
   */
  useEffect(() => {
    const drinkSeries = async () => {
      try {
        const response = await axios.get(
          "https://thealley.onrender.com/drink_series_items",
          { params: { category: category } }
        );
        const jsonVals = await response.data;
        console.log(jsonVals.data);
        const categories = jsonVals.data.categories;
        setData(categories);
        const drinkItems = jsonVals.data.drinks;
        setDrinks(drinkItems);
      } catch (err) {
        console.log("ERROR");
        console.error(err.message);
      }
    };

    drinkSeries();
  }, [category]);

  return (
    <div className="customer-home-background">
      <div className="customer-page">
        <div className="drink-categories-container">
          <h3
            className="categories-title"
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            DRINK SERIES
          </h3>
          {drinkCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => getDrinkSeries(category.category)}
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              {capitalizeName(category.category, "_")}
            </button>
          ))}
        </div>
        <div className="category-items-container">
          {drinkSeriesItems
            .filter((drink, index) => index < 1)
            .map((drinkItem) => (
              <h1
                id="drinkSeriesName"
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
                className="series-name"
              >
                {capitalizeName(drinkItem.category, "_")}
              </h1>
            ))}
          {drinkSeriesItems.map((drink, index) => (
            <button
              key={index}
              alt={capitalizeName(drink.name, " ")}
              id={drink.name}
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
              onClick={() => buildDrink(drink.name, drink.drink_id, drink.cost)}
            >
              <img
                class="drink-square"
                src={getImage(drink.category)}
                alt={capitalizeName(drink.name, " ")}
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
                onError={(e) => {
                  e.target.src = "/drink_images/placeholder.png";
                }}
              />
              {capitalizeName(drink.name, " ")}
            </button>
          ))}
        </div>
      </div>
      <div className="order-info-container">
        <p
          id="currentTotalCost"
          className="total"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          {getCurrentTotal()}
        </p>
        <button
          onClick={viewCartFromDrinkSeries}
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          View Cart
        </button>
      </div>
    </div>
  );
};

export default DrinkSeries;
