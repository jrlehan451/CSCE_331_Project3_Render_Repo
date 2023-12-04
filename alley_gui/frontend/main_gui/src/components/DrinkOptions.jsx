import LanguageSelect from "./LanguageSelect";
import React, { useState, useEffect, Suspense, useLayoutEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import '../drink_options.css';


function ButtonLink({ to, children }) {
  return <Link to={to}><button>{children}</button></Link>;
} // Should get refactored into just a separate component to be so honest

const DrinkOptions = ({capitalizeName}) => {
    const [categories, setCategories] = useState([]);

    const highContrastMode = () => {
      const body = document.querySelector('body');
      if (body.classList.contains("contrast")) {
        body.classList.remove("contrast");
        document.body.style.backgroundColor = '#ffefe2';
        sessionStorage.setItem("high_contrast_mode", false);
      } else {
        body.classList.add("contrast");
        document.body.style.backgroundColor = 'black';
        sessionStorage.setItem("high_contrast_mode", true);
      }
    }
  
    const loadCurrentMode = () => {
      if (sessionStorage.getItem("high_contrast_mode")) {
        const body = document.querySelector('body');
        if (body.classList.contains("contrast") == false) {
          body.classList.add("contrast");
          document.body.style.backgroundColor = 'black';
        }
      } else {
        const body = document.querySelector('body');
        body.classList.remove("contrast");
        document.body.style.backgroundColor = '#ffefe2';
      }
    }

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

    return (
      <div onLoad={() => loadCurrentMode()}>
      <button onClick={highContrastMode}>test</button>
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
