import React, { useState, useEffect } from "react";
import axios from "axios";
import {useParams} from 'react-router-dom'
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
  
    const returnHome = () => {
        window.location.href = "/";
    };
  
    const navigateToMenuAddons = () => {
      // Function to handle navigation to menu addons
      // ...
    };

    useEffect(() => {
        const drinksByCategory = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/menu_jsx"
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
        <div className="menu-title"><h1>Step 1: Choose Your Drink</h1></div>
        <button className="home-button" onClick={returnHome}> Home </button>
        <button className="navigation" onClick={navigateToMenuAddons}> {'>'} </button>
        <div className="drink-panel">
            {Object.keys(drinks).map(category => (
                <div class = "category-panel" key={category}>
                    <h2 class="category-title"> {capitalizeName(category, '_')} </h2>
                        {drinks[category].map(drink => (
                            <div class="drink-entry" key={category}> 
                                <div class="drink-square">
                                    <img src="images\peach_oolong_tea.png" />
                                </div>
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