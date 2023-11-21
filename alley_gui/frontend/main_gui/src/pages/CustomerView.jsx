import React, { useState, useEffect } from "react";
import axios from "axios";
import './customer_home.css';

const CustomerHome = () => {
    const [drinkCategories, setData] = useState([]);

    const getCurrentTotal = () => {
        let currDrinksInOrder = []
        if (sessionStorage.getItem("currentOrderDrinks")) {
            currDrinksInOrder = JSON.parse(sessionStorage.getItem("currentOrderDrinks"));
        }

        var totalCost = 0;
        for (var i = 0; i < currDrinksInOrder.length; i++) {
            totalCost += parseFloat(currDrinksInOrder[i].drinkCost);
            if (currDrinksInOrder[i].addOn1Id != -1) {
                totalCost += parseFloat(currDrinksInOrder[i].addOn1Cost);
            }
            if (currDrinksInOrder[i].addOn2Id != -1) {
                totalCost += parseFloat(currDrinksInOrder[i].addOn2Cost);
            }
        }

        return "Total: " + totalCost.toFixed(2);
    }

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
            window.location.href = currLocation.replace("customer", "drink_series/") + category;
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

    useEffect(() => {
        const drinkCategories = async () => {
        try {
            const response = await axios.get(
            "http://localhost:4000/drink_categories"
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
    }, []);

    return (
        <div className="customer-home-background" onLoad={() => getCurrentTotal()}>
        <div className="customer-page">
            <div className="drink-categories-container">
            <h3 className="categories-title">DRINK SERIES</h3>
            {drinkCategories.map((category, index) => (
                <button key={index} onClick={() => getDrinkSeries(category.category)}>
                {capitalizeName(category.category, '_')}
                </button>
            ))}
            </div>
        </div>
        <div className="category-items-container">
            {[...Array(18)].map((_, index) => (
            <button key={index}>Popular Drink</button>
            ))}
        </div>
        <div className="order-info-container">
            <p id="currentTotalCost" className="total">{getCurrentTotal()}</p>
            <button onClick={viewCartFromCustomerHome}>View Cart</button>
        </div>
        </div>
    );
    };

export default CustomerHome;
