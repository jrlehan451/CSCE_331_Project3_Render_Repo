import LanguageSelect from "./LanguageSelect";
import React, { useState, useEffect, Suspense, useLayoutEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import '../drink_options.css';
import {useAuth0} from '@auth0/auth0-react';
import HomeButton from '../pages/images/HomeButton.png';

/**
 * @description creates navigate to all the different drink series pages
 * @param {*} to
 * @param {*} children 
 * @returns drink series page for selected button
 */
function ButtonLink({ to, children }) {
  return <Link to={to}><button>{children}</button></Link>;
} // Should get refactored into just a separate component to be so honest

/**
 * @description This component displays all the drink options for the cashier to begin creating an order.
 * @component DrinkOptions
 * @param {*} capitalizeName 
 * @returns drink options page for the cashier view
 */
const DrinkOptions = ({capitalizeName}) => {
    const [categories, setCategories] = useState([]);
    const {logout} = useAuth0();

    const returnHome = () => {
      localStorage.setItem("Role", "");
      logout({ logoutParams: { returnTo: window.location.origin } })
    };

    /**
     * @function drinkOptions
     * @description queries the server-side API to get all the different drink options
     */
    useEffect(() => {
      const drinkOptions = async () => {
        try {
          const response = await axios.get(
            "https://thealley.onrender.com/drink_options_jsx"
          );
          const jsonVals = await response.data;
          console.log("Working");
          console.log(jsonVals.data.drink_categories);
          setCategories(jsonVals.data.drink_categories.rows);
        } catch (err) {
          console.log("ERROR");
          console.error(err.message);
        }
      };
  
      drinkOptions();
    }, []);

    /**
     * @description sets up protection for the cashier view
     * @function cashierProtection
     */
    useEffect(() => {
      const protection = async () => {
          const role = localStorage.getItem("Role");
          switch(role){
              case "Cashier":
                  break;
              default:
                  window.location.href = window.location.origin;
                  break;
          }
      };

      protection();
    });

    return (
      <div>
        <button className="home-button" onClick={returnHome}>
            <img src={HomeButton} alt="home" />
        </button>
        <h1 class="green">Drink Options</h1>
        <div class="menu-container">
            <div class="button-container double">
            {categories.map(category => (
                  <ButtonLink key={category.category} to={`../AddDrink/${category.category}`}>{capitalizeName(category.category, "_")}</ButtonLink>
              ))}
            </div>
        </div>
      </div>
    );
};

export default DrinkOptions;
