import React, { useState, useEffect } from "react";
import axios from "axios";
import './customer_home.css';
import {useAuth0} from '@auth0/auth0-react';
import HomeButton from '../pages/images/HomeButton.png';

/**
 * @description This is the customer home page component. It displays all the popular drinks, all drink series, and is the starting place for a customer to place an order.
 * @component CustomerHome
 * @returns customer home component which starts the customer ordering process
 */
const CustomerHome = () => {
    const [drinkCategories, setData] = useState([]);
    const [popularDrinks, setDrinks] = useState([]);
    const {logout} = useAuth0();

    const returnHome = () => {
        localStorage.setItem("Role", "");
        logout({ logoutParams: { returnTo: window.location.origin } })
    };

    /**
     * @description adds protection to customer view
     * @function protection
     */
    useEffect(() => {
        const protection = async () => {
            const role = localStorage.getItem("Role");
            switch(role){
                case "Customer":
                    break;
                default:
                    window.location.href = window.location.origin;
                    break;
            }
        };

        protection();
    });

    /**
     * @description displays the current running total of the order the customer is building
     * @function getCurrentTotal
     * @returns current total of customer order
     */
    const getCurrentTotal = () => {

        let currDrinksInOrder = []
        if (sessionStorage.getItem("currentOrderDrinks")) {
            currDrinksInOrder = JSON.parse(sessionStorage.getItem("currentOrderDrinks"));
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
    }

    const capitalizeName = (name, delimiter) => {
        const words = name.split(delimiter);
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ");
    };

    /**
     * @description redirects the customer to the page with all the drinks of a specific series when series button is clicked
     * @param {string} category
     * @function getDrinkSeries
     */
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

    /**
     * @description redirects customer to view their cart from the customer home page
     * @function viewCartFromCustomerHome
     */
    const viewCartFromCustomerHome = () => {
        var currLocation = window.location.href;
        window.location.href = currLocation.replace("customer", "view_cart");
    };

    /**
     * @description redirects to the build drink page and stores information about the drink the customer selected
     * @param {string} drinkName
     * @param {int} drinkId
     * @param {int} drinkCost
     * @function buildDrink
     */
    const buildDrink = (drinkName, drinkId, drinkCost) => {
        var currLocation = window.location.href;
        window.location.href = currLocation.replace("customer", "build_drink");
            
        sessionStorage.setItem("customer_drink_name", drinkName);
        sessionStorage.setItem("customer_drink_id", drinkId);
        sessionStorage.setItem("customer_drink_cost", drinkCost)
    };

    function getImage(name){
        name = "/drink_images/" + name;
        name += ".png"
        const words = name.split(" ");
        return words.join("_");
    }

    /**
     * @description uses a server-side API call to get all the different drink categories and popular drinks
     * @function drinkCategories
     * @function popularDrinks
     */
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
                )
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
        <div className="customer-home-background" onLoad={() => getCurrentTotal()}>
        <button className="home-button" onClick={returnHome}>
            <img src={HomeButton} alt="home" />
        </button>
        <div className="customer-page">
            <div className="drink-categories-container">
            <h3 className="categories-title">DRINK SERIES</h3>
            {drinkCategories.map((category, index) => (
                <button key={index} onClick={() => getDrinkSeries(category.category)} >
                {capitalizeName(category.category, '_')}
                </button>
            ))}
            </div>
        </div>
        <div className="category-items-container">
            <h1 id="drinkSeriesName" className="series-name">Customer Favorites</h1>
            {popularDrinks.map((drink, index) => (
                <button key={index} alt={capitalizeName(drink.name, ' ')} id={drink.name} onClick={() => buildDrink(drink.name, drink.id, drink.cost)}>
                    <img class ="drink-square" src={getImage(drink.category)} alt={capitalizeName(drink.name, ' ')} onError={(e) => {e.target.src = "/drink_images/placeholder.png"}} />
                    {capitalizeName(drink.name, " ")}
                </button>
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
