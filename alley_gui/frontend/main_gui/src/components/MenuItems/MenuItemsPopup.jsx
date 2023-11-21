import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const MenuItemPopup = ({ open, onClose, onSelectIngredients, values }) => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get("http://localhost:4000/addBaseIngredients");
        setIngredients(response.data.data.table.rows.map((ingredient) => ({
          ...ingredient,
          selected: false, // Initialize selected property
        })));
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  const handleSelectIngredients = (e) => {
    e.preventDefault();
  
    const selectedIngredients = ingredients
      .filter((ingredient) => ingredient.selected)
      .map((ingredient) => ({ ingredient_id: ingredient.ingredient_id }));
  
    axios
      .post("http://localhost:4000/updateBaseIngredients", {
        selectedIngredients,
        drinkID: values.drinkID,
      })
      .then((res) => {
        const rowCountTwo = res.data.rowCount;
        if (res.data.status === "success") {
          // Handle success (e.g., show a success message)
          console.log(res.data.message);
        } else {
          // Handle error (e.g., show an error message to the user)
          console.error(res.data.message);
        }
        if (rowCountTwo === 0) {
          alert("Error: Drink ID not found");
        }
  
        onSelectIngredients(selectedIngredients);
        onClose(); // Close the popup after processing
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  

  // const handleSelectIngredients = async (e) => {
  //   e.preventDefault();
  
  //   const selectedIngredients = ingredients
  //     .filter((ingredient) => ingredient.selected)
  //     .map((ingredient) => ({ ingredient_id: ingredient.ingredient_id }));
  
  //   try {
  //     const res = await axios.post("http://localhost:4000/updateBaseIngredients", {
  //       selectedIngredients,
  //       drinkID: values.drinkID,
  //     });
  
  //     const rowCountTwo = res.data.rowCount;
  //     if (res.data.status === "success") {
  //       // Handle success (e.g., show a success message)
  //       console.log(res.data.message);
  //     } else {
  //       // Handle error (e.g., show an error message to the user)
  //       console.error(res.data.message);
  //     }
  
  //     if (rowCountTwo === 0) {
  //       alert("Error: Drink ID not found");
  //     }
  
  //     onSelectIngredients(selectedIngredients);
  //     onClose(); // Close the popup after processing
  //   } catch (err) {
  //     console.error("Error:", err);
  //   }
  // };
  

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
        <Button onClick={handleSelectIngredients}>Done</Button>
        
      </DialogActions>
    </Dialog>
  );
};
//<Button onClick={handleSelectIngredients}>Done</Button>
export default MenuItemPopup;
