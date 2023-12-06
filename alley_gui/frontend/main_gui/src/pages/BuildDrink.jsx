import React, { useEffect, useState } from 'react';
import axios from "axios";
import './build_drink.css';
import backArrowImage from './images/back_arrow.png';

/**
 * @description This component allows the customer to customize their drink with add-ons and other specifications. 
 * @component Build Drink
 * @returns the pages that allows a customer to add specifications to drinks in their order
 */
const BuildDrink = () => {
    const [selectedSize] = useState('');
    const [selectedAddOn1] = useState('');
    const [selectedAddOn2] = useState('');
    const [quantity] = useState(0);
    const [addOns, setData] = useState([]);

    useEffect(() => {
        const protection = async () => {
            const role = localStorage.getItem("Role");
            switch(role){
                case "Customer":
                    break;
                default:
                    window.location.href = window.location.origin;
                    break;
            }
        };
  
        protection();
    });

    const capitalizeName = (name, delimiter) => {
        const words = name.split(delimiter);
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ");
    };

    /**
     * @function backCustomerHome
     * @description navigates back to the main customer home page from the build drink page
     */
    const backCustomerHome = () => {
        var currLocation = window.location.href;
        window.location.href = currLocation.replace("build_drink", "customer");
    };

    const getCurrentTotal = () => {
        let currDrinksInOrder = []
        if (sessionStorage.getItem("currentOrderDrinks")) {
            currDrinksInOrder = JSON.parse(sessionStorage.getItem("currentOrderDrinks"));
        }
    
        var totalCost = 0;
        for (var i = 0; i < currDrinksInOrder.length; i++) {
            var currentDrink = 0;
            currentDrink += parseFloat(currDrinksInOrder[i].drinkCost);
            if (currDrinksInOrder[i].addOn1Id != -1) {
            currentDrink += parseFloat(currDrinksInOrder[i].addOn1Cost);
            }
            if (currDrinksInOrder[i].addOn2Id != -1) {
            currentDrink += parseFloat(currDrinksInOrder[i].addOn2Cost);
            }
            currentDrink *= parseInt(currDrinksInOrder[i].quantity);
            totalCost += currentDrink;
        }
    
        return "Total: " + totalCost.toFixed(2);
      }

    /**
     * @function getSelectedDrink
     * @description gets the information about the drink selected by the user on the customer home page 
     * or drink series page and displays it on the build drink page
     */
    const getSelectedDrink = () => {
        const selectedDrink = sessionStorage.getItem("customer_drink_name");
        const drinkName = document.getElementById("drinkSelected");
        drinkName.textContent = "Selected Drink: " + selectedDrink;
        let quantity = document.getElementById("start");
        quantity.style.display = "block";
    }

    /**
     * @description stores the customer's size choice for the current drink their building
     * @function getSize
     * @param {string} size 
     */
    const getSize = (size) => {
        sessionStorage.setItem("customer_drink_size", size);
        const drinkSize = document.getElementById("drinkSelectedSize");
        drinkSize.outerHTML = '<p id="drinkSelectedSize" class="build-drink-text">Size: ' + size + '</p>';
    };

    /**
     * @description sets the information about the first add-on chosen by the customer
     * @function getAddOn1
     * @param {string} addOn1Name 
     * @param {int} addOn1IngredientId 
     * @param {int} addOn1Cost 
     */
    const getAddOn1 = (addOn1Name, addOn1IngredientId, addOn1Cost) => {
        sessionStorage.setItem("customer_addOn1_name", addOn1Name);
        sessionStorage.setItem("customer_addOn1_id", addOn1IngredientId);
        sessionStorage.setItem("customer_addOn1_cost", addOn1Cost)
        const addOn1 = document.getElementById("drinkSelectedAddOn1");
        addOn1.outerHTML = '<p id="drinkSelectedAddOn1" class="build-drink-text">Add-On #1: ' + addOn1Name + '</p>';
    };

    /**
     * @description sets the information about the second add-on chosen by the customer
     * @function getAddOn2
     * @param {string} addOn2Name 
     * @param {int} addOn2IngredientId 
     * @param {int} addOn2Cost 
     */
    const getAddOn2 = (addOn2Name, addOn2IngredientId, addOn2Cost) => {
        sessionStorage.setItem("customer_addOn2_name", addOn2Name);
        sessionStorage.setItem("customer_addOn2_id", addOn2IngredientId);
        sessionStorage.setItem("customer_addOn2_cost", addOn2Cost)
        const addOn2 = document.getElementById("drinkSelectedAddOn2");
        addOn2.outerHTML = '<p id="drinkSelectedAddOn2" class="build-drink-text">Add-On #2: ' + addOn2Name + '</p>';
    };

    /**
     * @description sets information about the number of the current drink being built to add to the customer's order
     * @function getQuantity
     */
    const getQuantity = () => {
        let amount = sessionStorage.getItem("customer_drink_quantity");
        const drinkQuantity = document.getElementById("drinkSelectedQuantity");
        drinkQuantity.outerHTML = '<p id="drinkSelectedQuantity" class="build-drink-text">Quantity: ' + amount + '</p>';
    };

    /**
     * @description displays the content that allows the customer to select a size for their desired drink
     * @function getDrinkSize
     */
    const getDrinkSize = () => {
        const start = document.getElementById("start");
        start.style.display = "none";
        const addOns1 = document.getElementById("addOns1");
        addOns1.style.display = "none";
        const addOns2 = document.getElementById("addOns2");
        addOns2.style.display = "none";
        const quantity = document.getElementById("quantity");
        quantity.style.display = "none";
 
        const size = document.getElementById("size");
        size.style.display = "block";
    };

    /**
     * @description displays the content that allows the customer to add their first add-on to the desired drink
     * @function getDrinkAddOn1
     */
    const getDrinkAddOn1 = () => {
        const start = document.getElementById("start");
        start.style.display = "none";
        const size = document.getElementById("size");
        size.style.display = "none";
        const addOns2 = document.getElementById("addOns2");
        addOns2.style.display = "none";
        const quantity = document.getElementById("quantity");
        quantity.style.display = "none";

        const addOns1 = document.getElementById("addOns1");
        addOns1.style.display = "block";
    };

    /**
     * @description displays the content that allows the customer to add their second add-on to the desired drink
     * @function getDrinkAddOn2
     */
    const getDrinkAddOn2 = () => {
        const start = document.getElementById("start");
        start.style.display = "none";
        const size = document.getElementById("size");
        size.style.display = "none";
        const addOns1 = document.getElementById("addOns1");
        addOns1.style.display = "none";
        const quantity = document.getElementById("quantity");
        quantity.style.display = "none";

        const addOns2 = document.getElementById("addOns2");
        addOns2.style.display = "block";
    };

    /**
     * @description displays the conent that allows the customer to add their desired quantity of the desired drink
     * @function getDrinkQuantity
     */
    const getDrinkQuantity = () => {
        const start = document.getElementById("start");
        start.style.display = "none";
        const size = document.getElementById("size");
        size.style.display = "none";
        const addOns1 = document.getElementById("addOns1");
        addOns1.style.display = "none";
        const addOns2 = document.getElementById("addOns2");
        addOns2.style.display = "none";
    
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

    /**
     * @description adds the built drink to the current list of drinks in the customer's order
     * @function addDrinkToOrder
     */
    const addDrinkToOrder = () => {
        const drinkName = sessionStorage.getItem("customer_drink_name");
        const drinkId = sessionStorage.getItem("customer_drink_id");
        const drinkCost = sessionStorage.getItem("customer_drink_cost")
        const size = sessionStorage.getItem("customer_drink_size");
        const addOn1Name = sessionStorage.getItem("customer_addOn1_name");
        const addOn1Id = sessionStorage.getItem("customer_addOn1_id");
        const addOn1Cost = sessionStorage.getItem("customer_addOn1_cost")
        const addOn2Name = sessionStorage.getItem("customer_addOn2_name");
        const addOn2Id = sessionStorage.getItem("customer_addOn2_id");
        const addOn2Cost = sessionStorage.getItem("customer_addOn2_cost");
        const quantity = sessionStorage.getItem("customer_drink_quantity");
        
        let currDrink = {
          drinkName: drinkName, 
          drinkId: drinkId, 
          drinkCost: drinkCost,
          size: size, 
          addOn1Name: addOn1Name,
          addOn1Id: addOn1Id, 
          addOn1Cost: addOn1Cost,
          addOn2Name: addOn2Name, 
          addOn2Id: addOn2Id, 
          addOn2Cost: addOn2Cost,
          quantity: quantity
        };

        let currDrinksInOrder = []
        if (sessionStorage.getItem("currentOrderDrinks")) {
            currDrinksInOrder = JSON.parse(sessionStorage.getItem("currentOrderDrinks"));
        }

        currDrinksInOrder.push(currDrink);
  
        sessionStorage.setItem("currentOrderDrinks", JSON.stringify(currDrinksInOrder));

        var totalCost = 0;
        for (var i = 0; i < currDrinksInOrder.length; i++) {
            var currentDrink = 0;
            currentDrink += parseFloat(currDrinksInOrder[i].drinkCost);
            if (currDrinksInOrder[i].addOn1Id != -1) {
            currentDrink += parseFloat(currDrinksInOrder[i].addOn1Cost);
            }
            if (currDrinksInOrder[i].addOn2Id != -1) {
            currentDrink += parseFloat(currDrinksInOrder[i].addOn2Cost);
            }
            currentDrink *= parseInt(currDrinksInOrder[i].quantity);
            totalCost += currentDrink;
        }

        const currCost = document.getElementById("currentTotalCost");
        currCost.textContent = "Total: " + totalCost.toFixed(2);
    }

    /**
     * @function viewCart
     * @description navigation to the view cart page from the build drink page
     */
    const viewCart = () => {
        var currLocation = window.location.href;
        window.location.href = currLocation.replace("build_drink", "view_cart");
    };

    function getImage(name){
        name = "/addOn_images/" + name;
        name += ".png"
        const words = name.split(" ");
        return words.join("_");
    }

    /**
     * @description queries all the add-ons available from the server-side API
     * @function drinkCategories
     */
    useEffect(() => {
        const drinkCategories = async () => {
        try {
            const response = await axios.get(
            "https://thealley.onrender.com/add_ons"
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
                onClick={() => getAddOn1(addon.name, addon.ingredient_id, addon.cost)}
                >
                <img class ="addon-square" src={getImage(addon.name)} alt={capitalizeName(addon.name, ' ')} onError={(e) => {e.target.src = "/addOn_images/placeholder.png"}}/>
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
                onClick={() => getAddOn2(addon.name, addon.ingredient_id, addon.cost)}
                >
                <img class ="addon-square" src={getImage(addon.name)} alt={capitalizeName(addon.name, ' ')} onError={(e) => {e.target.src = "/addOn_images/placeholder.png"}}/>
                {capitalizeName(addon.name, ' ')}
                </button>
            ))}
            <button onClick={() => getAddOn2('none', '-1')}>None</button>
        </div>
            
        <div id="quantity" className="build-option-container">
            <h1 className="option-name">Choose Your Quantity</h1>
            <button id="decrement" style={{fontSize: 70}}>-</button>
            <button id="increment" style={{fontSize: 70}}>+</button>
            <button onClick={getQuantity} style={{fontSize: 20}}>Submit</button>
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
            <p id="currentTotalCost" className="total">{getCurrentTotal()}</p>
        </div>
    </div>
  );
};

export default BuildDrink;
