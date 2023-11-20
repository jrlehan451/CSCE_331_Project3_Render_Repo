import React, { useState, useEffect} from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import './customer_home.css'; // Import your CSS file
//import peachOolongTeaImage from './peach_oolong_tea.png'; // Import your image

const DrinkSeries = () => {
    const [drinkCategories, setData] = useState([]);
    const [drinkSeriesItems, setDrinks] = useState([]);

    const capitalizeName = (name, delimiter) => {
        const words = name.split(delimiter);
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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

    const buildDrink = (drinkName, drinkId) => {
        var currLocation = window.location.href;
        const array = currLocation.split("/");
        window.location.href = currLocation.replace("drink_series/" + array[4], "build_drink");
            
        sessionStorage.setItem("customer_drink_name", drinkName);
        sessionStorage.setItem("customer_drink_id", drinkId);
    };

    const viewCartFromDrinkSeries = () => {
        // Implement your logic for viewing the cart from Drink Series
        console.log('Viewing cart from Drink Series...');
    };

    const {category} = useParams();

    useEffect(() => {
        const drinkSeries = async () => {
        try {
            const response = await axios.get(
            "http://localhost:4000/drink_series_items", {params: {category : category}}
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
            <h3 className="categories-title">DRINK SERIES</h3>
            {drinkCategories.map((category, index) => (
                <button key={index} onClick={() => getDrinkSeries(category.category)}>
                {capitalizeName(category.category, '_')}
                </button>
            ))}
            </div>
            <div className="category-items-container">
            <h1 className="series-name">Drink Series</h1>
            {drinkSeriesItems.map((drink, index) => (
                <button key={index} id={drink.name} onClick={() => buildDrink(drink.name, drink.drink_id)}>
                
                {capitalizeName(drink.name, ' ')}
                </button>
            ))}
            </div>
        </div>
        <div className="order-info-container">
            <p className="total">Total: $$</p>
            <button onClick={viewCartFromDrinkSeries}>View Cart</button>
        </div>
        </div>
    );
};

export default DrinkSeries;
