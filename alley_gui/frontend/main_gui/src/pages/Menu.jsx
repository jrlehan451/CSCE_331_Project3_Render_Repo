import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeButton from './images/HomeButton.png';
import arrow from './images/back_arrow.png';

import './Menu.css'

const Menu = () => {
    const [drinks, setDrinks] = useState([]);

    function capitalizeName(name, delimiter) {
        const words = name.split(delimiter);
      
        for (let i = 0; i < words.length; i++) {
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
      
        return words.join(" ");
    };

    function getImage(name){
        name = "/drink_images/" + name;
        name += ".png"
        const words = name.split(" ");
        return words.join("_");
    }
  
    const returnHome = () => {
        window.location.href = "/";
    };
  
    const navigateToMenuAddons = () => {
        var currLocation = window.location.href;
        window.location.href = currLocation.replace("Menu", "MenuAddOns");
    };

    const highContrastMode = () => {
        const body = document.querySelector('body');
        console.log(body.classList.contains("contrast"));
        if (body.classList.contains("contrast")) {
          body.classList.remove("contrast");
          console.log("in conditional");
          sessionStorage.setItem("high_contrast_mode", false);
        } else {
          body.classList.add("contrast");
          sessionStorage.setItem("high_contrast_mode", true);
        }
    }
    
    const loadCurrentMode = () => {
        if (sessionStorage.getItem("high_contrast_mode")) {
          const body = document.querySelector('body');
          if (body.classList.contains("contrast") == false) {
            body.classList.add("contrast");
          }
        } else {
          const body = document.querySelector('body');
          body.classList.remove("contrast");
        }
    }

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
    <div onLoad={() => loadCurrentMode()}>
        <button onClick={highContrastMode}>test</button>
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
