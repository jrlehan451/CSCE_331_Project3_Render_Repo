import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeButton from './images/HomeButton.png';
import arrow from './images/back_arrow.png';

import './Menu.css'

/**
 * @description This component displays all the drinks offered on the menu. It separates them into different drink series and has a picture of the drink alongisde the name.
 * @component Menu Drinks
 * @returns menu page which displays the drinks
 */
const Menu = () => {
    const [drinks, setDrinks] = useState([]);

    function capitalizeName(name, delimiter) {
        const words = name.split(delimiter);
      
        for (let i = 0; i < words.length; i++) {
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
      
        return words.join(" ");
    };

    /**
     * @description takes the category of the drink from the query providing the information and searches for the associated drink category image
     * @function getImage(name)
     * @param {string} name 
     * @returns path to image src file
     */
    function getImage(name){
        name = "/drink_images/" + name;
        name += ".png"
        const words = name.split(" ");
        return words.join("_");
    }
  
    /**
     * @description navigates back to the home page of the web application
     * @function returnHome
     */
    const returnHome = () => {
        window.location.href = "/";
    };
  
    /**
     * @description navigates to the menu add ons page
     * @function navigateToMenuAddons
     */
    const navigateToMenuAddons = () => {
        var currLocation = window.location.href;
        window.location.href = currLocation.replace("Menu", "MenuAddOns");
    };

    /**
     * @description uses an API call to back-end server to query all the different drinks in the menu by category
     * @function drinksByCategory
     */
    useEffect(() => {
        const drinksByCategory = async () => {
        try {
            const response = await axios.get(
                "https://thealley.onrender.com/menu_jsx"
            );
            console.log(response.data);
            console.log(response.drinksByCategory);
            const jsonVals = await response.data;
            console.log(jsonVals.drinksByCategory);
            const drinks = jsonVals.data.drinksByCategory;
            setDrinks(drinks);

        } catch (err) {
            console.log("ERROR");
            console.error(err.message);
        }
        };

        drinksByCategory();
    }, []);

    return (
    <div>
        <h1 className="menu-title">Step 1: Choose Your Drink</h1>
        <button className="home-button" onClick={returnHome}>
            <img src={HomeButton} alt="home" />
        </button>
        <button className="navigationToMenuAddOns" onClick={navigateToMenuAddons}>
            <img src={arrow} alt="arrow" />
        </button>
        <div className="drink-panel">
            {Object.keys(drinks).map(category => (
                <div class = "category-panel" key={category}>
                    <h2 class="category-title"> {capitalizeName(category, '_')} </h2>
                        {drinks[category].map(drink => (
                            <div class="drink-entry" key={drink}> 
                                <img class ="drink-square" src={getImage(category)} alt={capitalizeName(drink.name, ' ')} onError={(e) => {e.target.src = "/drink_images/placeholder.png"}} />
                                <p class="drink-name">{capitalizeName(drink.name, ' ')}</p> 
                            </div>                    
                        ))}
                </div>
            ))}
        </div>
      </div>
    );
  };
  
  export default Menu;
