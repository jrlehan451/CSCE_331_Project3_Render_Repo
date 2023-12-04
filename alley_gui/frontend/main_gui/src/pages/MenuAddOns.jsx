import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeButton from './images/HomeButton.png';
import arrow from './images/back_arrow.png';

import './MenuAddOns.css';

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

    const highContrastMode = () => {
      const body = document.querySelector('body');
      if (body.classList.contains("contrast")) {
        body.classList.remove("contrast");
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
      <div onLoad={() => loadCurrentMode()}>
        <button onClick={highContrastMode}>test</button>
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
