import React, { useState, useEffect } from "react";
import axios from "axios";
import "./customer_home.css";

import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";
import TextToSpeech from "../components/TextToSpeech";

const CustomerHome = () => {
  const [drinkCategories, setData] = useState([]);
  const [popularDrinks, setDrinks] = useState([]);

  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
  };
  const handleGridCellHover = (params) => {
    console.log("handleGridCellHover is called!");

    if (isHoverEnabled) {
      console.log("isHoverEnabled is false");

      const cellContent = params.value.toString();
      console.log("Cell Content:", cellContent);

      // Call the handleHover function to initiate text-to-speech
      handleTableFieldSpeech(cellContent);
      //handleTableFieldSpeech("This is a test");
    }
  };

  const getCurrentTotal = () => {
    if (sessionStorage.getItem("high_contrast_mode")) {
      const body = document.querySelector("body");
      if (body.classList.contains("contrast") == false) {
        body.classList.add("contrast");
      }
    } else {
      const body = document.querySelector("body");
      body.classList.remove("contrast");
    }
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

    const capitalizeName = (name, delimiter) => {
      const words = name.split(delimiter);
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
      return words.join(" ");
    };

    const getDrinkSeries = (category) => {
      var currLocation = window.location.href;
      if (currLocation.includes("customer")) {
        window.location.href =
          currLocation.replace("customer", "drink_series/") + category;
      } else {
        const array = currLocation.split("/");
        console.log(array);
        window.location.href = currLocation.replace(array[4], category);
      }
    };

    const viewCartFromCustomerHome = () => {
      var currLocation = window.location.href;
      window.location.href = currLocation.replace("customer", "view_cart");
    };

    const buildDrink = (drinkName, drinkId, drinkCost) => {
      var currLocation = window.location.href;
      window.location.href = currLocation.replace("customer", "build_drink");

      sessionStorage.setItem("customer_drink_name", drinkName);
      sessionStorage.setItem("customer_drink_id", drinkId);
      sessionStorage.setItem("customer_drink_cost", drinkCost);
    };

    function getImage(name) {
      name = "/drink_images/" + name;
      name += ".png";
      const words = name.split(" ");
      return words.join("_");
    }

    const highContrastMode = () => {
      const body = document.querySelector("body");
      if (body.classList.contains("contrast")) {
        body.classList.remove("contrast");
        sessionStorage.setItem("high_contrast_mode", false);
      } else {
        body.classList.add("contrast");
        sessionStorage.setItem("high_contrast_mode", true);
      }
    };

    useEffect(() => {
      const drinkCategories = async () => {
        try {
          const response = await axios.get(
            "https://thealley.onrender.com/drink_categories"
          );
          const jsonVals = await response.data;
          console.log("Working");
          console.log(jsonVals.data);
          const categories = jsonVals.data.results.rows;
          setData(categories);
        } catch (err) {
          console.log("ERROR");
          console.error(err.message);
        }
      };

      drinkCategories();

      const popularDrinks = async () => {
        try {
          const reponse2 = await axios.get(
            "https://thealley.onrender.com/CustomerPopularityAnalysis"
          );
          const jsonVals2 = await reponse2.data;
          console.log(jsonVals2.data);
          const popularDrinks = jsonVals2.data.results.rows;
          console.log(popularDrinks);
          setDrinks(popularDrinks);
        } catch (err) {
          console.log("ERROR");
          console.error(err.message);
        }
      };

      popularDrinks();
    }, []);

    return (
      <div
        className="customer-home-background"
        onLoad={() => getCurrentTotal()}
      >
        <div className="customer-page">
          <button onClick={highContrastMode}>test</button>
          <div className="drink-categories-container">
            <h3 className="categories-title">DRINK SERIES</h3>
            {drinkCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => getDrinkSeries(category.category)}
              >
                {capitalizeName(category.category, "_")}
              </button>
            ))}
          </div>
        </div>
        <div className="category-items-container">
          <h1 id="drinkSeriesName" className="series-name">
            Customer Favorites
          </h1>
          {/* {[...Array(18)].map((_, index) => (
            <button key={index}>Popular Drink</button>
            ))} */}
          {popularDrinks.map((drink, index) => (
            <button
              key={index}
              alt={capitalizeName(drink.name, " ")}
              id={drink.name}
              onClick={() => buildDrink(drink.name, drink.drink_id, drink.cost)}
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              <img
                class="drink-square"
                src={getImage(drink.category)}
                alt={capitalizeName(drink.name, " ")}
              />
              {capitalizeName(drink.name, " ")}
            </button>
          ))}
        </div>
        <div className="order-info-container">
          <p id="currentTotalCost" className="total">
            {getCurrentTotal()}
          </p>
          <button
            onClick={viewCartFromCustomerHome}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            View Cart
          </button>
        </div>
        <TextToSpeech
          isHoverEnabled={isHoverEnabled}
          toggleHover={toggleHover}
        />
      </div>
    );
  };
};

export default CustomerHome;
