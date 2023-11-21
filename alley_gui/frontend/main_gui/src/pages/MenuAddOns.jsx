import React, { useState, useEffect } from "react";
import axios from "axios";
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

    useEffect(() => {
        const getAddOns = async () => {
          try {
            const response = await axios.get(
              "http://localhost:4000/add_on_jsx"
            );
            const jsonVals = await response.data;
            console.log("Working");
            console.log(jsonVals.data.add_ons);
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
        <div className="menu-title"><h1>Step 2: Choose Your Add-Ons (Max 2)</h1></div>
        <button className="home-button" onClick={returnHome}>Home</button>
        <button className="navigationToMenu" onClick={navigateToMenu}>{'<'}</button>
        <div className="addon-container">
          {addOns.map((addon, index) => (
            <div className="addon-entry" key={index}>
              <div className="addon-square">
                
              </div>
              <div className="addon-name">{capitalizeName(addon.name, ' ')}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default MenuAddons;