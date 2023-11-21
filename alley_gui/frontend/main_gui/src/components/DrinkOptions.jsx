import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import '../drink_options.css'

function ButtonLink({ to, children }) {
  return <Link to={to}><button>{children}</button></Link>;
} // Should get refactored into just a separate component to be so honest

const DrinkOptions = ({capitalizeName}) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
      const drinkOptions = async () => {
        try {
          const response = await axios.get(
            "http://localhost:4000/drink_options_jsx"
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
      <div>
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