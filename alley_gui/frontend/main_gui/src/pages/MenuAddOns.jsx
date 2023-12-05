import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeButton from './images/HomeButton.png';
import arrow from './images/back_arrow.png';

import './MenuAddOns.css';

/**
 * @description This component displays all the add ons offered on the Menu. It displays a picture of the add ons alongside the name.
 * @component Menu AddOns
 * @returns menu add on page which displays all the add-ons
 */
const MenuAddons = () => {
    const [addOns, setAddOns] = useState([]);

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
  
    /**
     * @description navigates to the menu drinks page from the menu add ons page
     * @function navigateToMenu
     */
    const navigateToMenu = () => {
        var currLocation = window.location.href;
        window.location.href = currLocation.replace("MenuAddOns", "Menu");
    };

    function getImage(name){
      name = "/addOn_images/" + name;
      name += ".png"
      const words = name.split(" ");
      return words.join("_");
    }

    /**
     * @descriptio uses API query to back-end server to get all the add ons offered by the store
     * @function getAddOns
     */
    useEffect(() => {
        const getAddOns = async () => {
          try {
            const response = await axios.get(
              "https://thealley.onrender.com/add_on_jsx"
            );
            const jsonVals = await response.data;
            setAddOns(jsonVals.data.add_ons.rows);
          } catch (err) {
            console.log("ERROR");
            console.error(err.message);
          }
        };
    
        getAddOns();
      }, []);
    return (
      <div>
        <h1 className="menu-title">Step 2: Choose Your Add-Ons (Max 2)</h1>
        <button className="home-button" onClick={returnHome}>
            <img src={HomeButton} alt="home" />
        </button>
        <button className="navigationToMenu" onClick={navigateToMenu}>
            <img src={arrow} alr="arrow" />
        </button>
        <div className="addon-container">
          {addOns.map((addon, index) => (
            <div className="addon-entry" key={index}>
              <img class ="addon-square" src={getImage(addon.name)} alt={capitalizeName(addon.name, ' ')} onError={(e) => {e.target.src = "/addOn_images/placeholder.png"}}/>
              <div className="addon-name">{capitalizeName(addon.name, ' ')}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default MenuAddons;
