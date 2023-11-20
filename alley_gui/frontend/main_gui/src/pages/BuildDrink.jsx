import React, { useEffect, useState } from 'react';
import axios from "axios";
import './build_drink.css';
import backArrowImage from './images/back_arrow.png';

const BuildDrink = () => {
    const [selectedSize] = useState('');
    const [selectedAddOn1] = useState('');
    const [selectedAddOn2] = useState('');
    const [quantity] = useState(0);
    const [addOns, setData] = useState([]);

    const capitalizeName = (name, delimiter) => {
        const words = name.split(delimiter);
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ");
    };

    const backCustomerHome = () => {
        var currLocation = window.location.href;
        window.location.href = currLocation.replace("build_drink", "customer");
    };

    const getSelectedDrink = () => {
        const selectedDrink = sessionStorage.getItem("customer_drink_name");
        const drinkName = document.getElementById("drinkSelected");
        drinkName.textContent = "Selected Drink: " + selectedDrink;
        let quantity = document.getElementById("start");
        quantity.style.display = "block";
    }

    const getSize = (size) => {
        sessionStorage.setItem("customer_drink_size", size);
        const drinkSize = document.getElementById("drinkSelectedSize");
        drinkSize.textContent = "Size: " + size;
    };

    const getAddOn1 = (addOn1Name, addOn1IngredientId) => {
        sessionStorage.setItem("customer_addOn1_name", addOn1Name);
        sessionStorage.setItem("customer_addOn1_id", addOn1IngredientId);
        const addOn1 = document.getElementById("drinkSelectedAddOn1");
        addOn1.textContent = "Add-On #1: " + addOn1Name;
    };

    const getAddOn2 = (addOn2Name, addOn2IngredientId) => {
        sessionStorage.setItem("customer_addOn2_name", addOn2Name);
        sessionStorage.setItem("customer_addOn2_id", addOn2IngredientId);
        const addOn2 = document.getElementById("drinkSelectedAddOn2");
        addOn2.textContent = "Add-On #2: " + addOn2Name;
    };

    const getQuantity = () => {
        let amount = sessionStorage.getItem("customer_drink_quantity");
        const drinkQuantity = document.getElementById("drinkSelectedQuantity");
        drinkQuantity.textContent = "Quantity: " + amount;
    };

    const getDrinkSize = () => {
        const start = document.getElementById("start");
        if (start.style.display === "block") {
            start.style.display = "none";
        }
        const addOns1 = document.getElementById("addOns1");
        if (addOns1.style.display === "block") {
            addOns1.style.display = "none";
        }
        const addOns2 = document.getElementById("addOns2");
        if (addOns2.style.display === "block") {
            addOns2.style.display = "none";
        }
        const quantity = document.getElementById("quantity");
        if (quantity.style.display === "block") {
            quantity.style.display = "none";
        }
        const size = document.getElementById("size");
        size.style.display = "block";
    };

    const getDrinkAddOn1 = () => {
        const start = document.getElementById("start");
        if (start.style.display === "block") {
            start.style.display = "none";
        }
        const size = document.getElementById("size");
        if (size.style.display === "block") {
            size.style.display = "none";
        }
        const addOns2 = document.getElementById("addOns2");
        if (addOns2.style.display === "block") {
            addOns2.style.display = "none";
        }
        const quantity = document.getElementById("quantity");
        if (quantity.style.display === "block") {
            quantity.style.display = "none";
        }

        const addOns1 = document.getElementById("addOns1");
        addOns1.style.display = "block";
    };

    const getDrinkAddOn2 = () => {
        const start = document.getElementById("start");
        if (start.style.display === "block") {
            start.style.display = "none";
        }
        const size = document.getElementById("size");
        if (size.style.display === "block") {
            size.style.display = "none";
        }
        const addOns1 = document.getElementById("addOns1");
        if (addOns1.style.display === "block") {
            addOns1.style.display = "none";
        }
        const quantity = document.getElementById("quantity");
        if (quantity.style.display === "block") {
            quantity.style.display = "none";
        }

        const addOns2 = document.getElementById("addOns2");
        addOns2.style.display = "block";
    };

    const getDrinkQuantity = () => {
        const start = document.getElementById("start");
        if (start.style.display === "block") {
            start.style.display = "none";
        }
        const size = document.getElementById("size");
        if (size.style.display === "block") {
            size.style.display = "none";
        }
        const addOns1 = document.getElementById("addOns1");
        if (addOns1.style.display === "block") {
            addOns1.style.display = "none";
        }
        const addOns2 = document.getElementById("addOns2");
        if (addOns2.style.display === "block") {
            addOns2.style.display = "none";
        }
    
        let quantity = document.getElementById("quantity");
        quantity.style.display = "block";
    
        let count = 0;
        let increment = document.getElementById("increment");
        let decrement = document.getElementById("decrement");
        let disp = document.getElementById("display");
             
        increment.addEventListener("click", function () {
            count++;
            disp.innerHTML = count;
            sessionStorage.setItem("customer_drink_quantity", count);
        });
        decrement.addEventListener("click", function () {
            if (count > 0) {
                count--;
            }
            disp.innerHTML = count;
            sessionStorage.setItem("customer_drink_quantity", count);
        });
    };

    const addDrinkToOrder = () => {
        const drinkName = sessionStorage.getItem("customer_drink_name");
        const drinkId = sessionStorage.getItem("customer_drink_id");
        const size = sessionStorage.getItem("customer_drink_size");
        const addOn1Name = sessionStorage.getItem("customer_addOn1_name");
        const addOn1Id = sessionStorage.getItem("customer_addOn1_id");
        const addOn2Name = sessionStorage.getItem("customer_addOn2_name");
        const addOn2Id = sessionStorage.getItem("customer_addOn2_id");
        const quantity = sessionStorage.getItem("customer_drink_quantity");
        
        let currDrink = {
          drinkName: drinkName, 
          drinkId: drinkId, 
          size: size, 
          addOn1Name: addOn1Name,
          addOn1Id: addOn1Id, 
          addOn2Name: addOn2Name, 
          addOn2Id: addOn2Id, 
          quantity: quantity
        };

        console.log(drinkName);
        console.log(drinkId);
        console.log(size);
        console.log(addOn1Name);
        console.log(addOn1Id);
        console.log(addOn2Name);
        console.log(addOn2Id);
        console.log(quantity);

        let currDrinksInOrder = []
        if (sessionStorage.getItem("currentOrderDrinks")) {
            currDrinksInOrder = JSON.parse(sessionStorage.getItem("currentOrderDrinks"));
        }

        currDrinksInOrder.push(currDrink);
  
        sessionStorage.setItem("currentOrderDrinks", JSON.stringify(currDrinksInOrder));
    }

    const viewCart = () => {
        var currLocation = window.location.href;
        window.location.href = currLocation.replace("build_drink", "view_cart");
    };

    useEffect(() => {
        const drinkCategories = async () => {
        try {
            const response = await axios.get(
            "http://localhost:4000/add_ons"
            );
            const jsonVals = await response.data;
            console.log("Working");
            console.log(jsonVals.data);
            const add_ons = jsonVals.data.results.rows;
            setData(add_ons);
        } catch (err) {
            console.log("ERROR");
            console.error(err.message);
        }
        };

        drinkCategories();
    }, []);

  return (
    <div className="build-drink-background" onLoad={() => getSelectedDrink()}>
        <button className="back-button" onClick={backCustomerHome}>
            <img src={backArrowImage} alt="Back Arrow" width="60%" height="10%" />
        </button>

        <div id="start" className="build-option-container">
            <h1 className="option-name">Build Your Drink</h1>
        </div>

        <div id="size" className="build-option-container">
            <h1 className="option-name">Choose Your Size</h1>
            <button onClick={() => getSize('regular')}>Regular</button>
            <button onClick={() => getSize('large')}>Large</button>
        </div>

        <div id="addOns1" className="build-option-container">
            <h1 className="option-name">Choose Your First Add-On</h1>
            {addOns.map((addon) => (
                <button
                key={addon.ingredient_id}
                id={addon.name}
                onClick={() => getAddOn1(addon.name, addon.ingredient_id)}
                >
                {capitalizeName(addon.name, ' ')}
                </button>
            ))}
            <button onClick={() => getAddOn1('none', '-1')}>None</button>
        </div>

         <div id="addOns2" className="build-option-container">
            <h1 className="option-name">Choose Your Second Add-On</h1>
            {addOns.map((addon) => (
                <button
                key={addon.ingredient_id}
                id={addon.name}
                onClick={() => getAddOn2(addon.name, addon.ingredient_id)}
                >
                {capitalizeName(addon.name, ' ')}
                </button>
            ))}
            <button onClick={() => getAddOn2('none', '-1')}>None</button>
        </div>
            
        <div id="quantity" className="build-option-container">
            <h1 className="option-name">Choose Your Quantity</h1>
            <button id="decrement">-</button>
            <button id="increment">+</button>
            <button onClick={getQuantity}>Submit</button>
            <h3 className="quantity"><span id="display">0</span></h3>
        </div>

        <div className="build-drink-page">
            <div className="build-drink-container">
                <h3 className="build-drink-title">BUILD A DRINK GUIDE</h3>
                <button onClick={getDrinkSize}>Size</button>
                <button onClick={getDrinkAddOn1}>Add-On #1</button>
                <button onClick={getDrinkAddOn2}>Add-On #2</button>
                <button onClick={getDrinkQuantity}>Quantity</button>
            </div>
        </div> 

        <div className="build-drink-info">
            <p id="drinkSelected" className="build-drink-text">Selected Drink: </p>
            <p id="drinkSelectedSize" className="build-drink-text">Size: {selectedSize}</p>
            <p id="drinkSelectedAddOn1" className="build-drink-text">Add-On #1: {selectedAddOn1}</p>
            <p id="drinkSelectedAddOn2" className="build-drink-text">Add-On #2: {selectedAddOn2}</p>
            <p id="drinkSelectedQuantity" className="build-drink-text">Quantity: {quantity}</p>
        </div>

        <div className="build-drink-next">
            <button onClick={addDrinkToOrder}>Add Drink</button>
            <button onClick={viewCart}>View Cart</button>
            <p className="total">Total: </p>
        </div>
    </div>
  );
};

export default BuildDrink;
