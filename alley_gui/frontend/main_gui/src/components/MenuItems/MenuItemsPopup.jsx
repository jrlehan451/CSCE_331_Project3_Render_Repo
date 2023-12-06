import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * @description This component creates the pop-ups for the menu items table when certain CRUD operations are selected.
 * @component MenuItemPopup
 * @param {*} open
 * @param {*} onClose
 * @param {*} onSelectIngredients
 * @param {*} values
 * @returns displays the pop-up for the menu items page
 */
const MenuItemPopup = ({ open, onClose, onSelectIngredients, values }) => {
  // Save the ingridients selected as base for a drink
  const [ingredients, setIngredients] = useState([]);

  /**
   * @function fetchIngredients
   * @description gets all ingredients from the database using a server-side API call
   */
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get("https://thealley.onrender.com/addBaseIngredients");
        setIngredients(response.data.data.table.rows.map((ingredient) => ({
          ...ingredient,
          selected: false, 
        })));
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  // Select checked items and use them to make backend call
  /**
   * @function handleSelectIngredients
   * @description takes selected ingredients and saves their association to the drink in the database
   *  using a server-side API call
   * @param {*} e 
   */
  const handleSelectIngredients = (e) => {
    e.preventDefault();
  
    const selectedIngredients = ingredients
      .filter((ingredient) => ingredient.selected)
      .map((ingredient) => ({ ingredient_id: ingredient.ingredient_id }));
  
    axios
      .post("https://thealley.onrender.com/updateBaseIngredients", {
        selectedIngredients,
        drinkID: values.drinkID,
      })
      .then((res) => {
        const rowCountTwo = res.data.rowCount;
        if (res.data.status === "success") {
          console.log(res.data.message);
        } else {
          console.error(res.data.message);
        }
        if (rowCountTwo === 0) {
          alert("Error: Drink ID not found");
        }
  
        onSelectIngredients(selectedIngredients);
        onClose(); 
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  
  /**
   * @function handleToggleIngredient
   * @description maps the selected ingredient to the drink
   * @param {int} ingredientId 
   */
  const handleToggleIngredient = (ingredientId) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.ingredient_id === ingredientId
          ? { ...ingredient, selected: !ingredient.selected }
          : ingredient
      )
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Base Ingredients For Drink</DialogTitle>
      <DialogContent>
        {ingredients.map((ingredient) => (
          <div key={ingredient.ingredient_id}>
            <input
              type="checkbox"
              checked={ingredient.selected}
              onChange={() => handleToggleIngredient(ingredient.ingredient_id)}
            />
            {ingredient.name}
          </div>
        ))}
      </DialogContent>
      <DialogActions>

        <Button onClick={handleSelectIngredients} style={{ color: 'white', background: '#4CAF50' }}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuItemPopup;
