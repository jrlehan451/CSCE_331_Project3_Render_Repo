import CashierOrder from "./CashierOrder";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../drink_options.css'

function ButtonLink({ to, className, children }) {
    return <Link to={to}><button class={className}>{children}</button></Link>;
} // Should get refactored into just a separate component to be so honest

const AddOn = ({capitalizeName}) => {
    const [orderDrinks, setOrderDrinks] = useState([]);
    const [orderAdd_ons, setOrderAddOns] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {
        const storedDrinks = JSON.parse(sessionStorage.getItem('drinks'));
        if (storedDrinks) {
            setOrderDrinks(storedDrinks);
        } 
    }, [])

    useEffect(() => {
        sessionStorage.setItem("drinks", JSON.stringify(orderDrinks))
    }, [orderDrinks])
    
    useEffect(() => {
        const storedAddOns = JSON.parse(sessionStorage.getItem('add_ons'));
        if (storedAddOns) {
            setOrderAddOns(storedAddOns);
        } 
    }, [])

    useEffect(() => {
        sessionStorage.setItem("add_ons", JSON.stringify(orderAdd_ons))
    }, [orderAdd_ons])

    function add_onToLocal(_id, _name, _cost) {    
        let number = document.getElementsByClassName("selected")[0].children[0].innerHTML;
    
        let newAddOn = {
            id: _id,
            name: _name,
            cost: _cost
        };
    
        let storedAddOns = JSON.parse(sessionStorage.getItem('add_ons'));
        storedAddOns[number - 1].push(newAddOn);
        setOrderAddOns(storedAddOns);
    }

    function deleteDrinkFromLocal() {  
        let selected = document.getElementsByClassName("selected")[0];
        selected.classList.remove("selected");
        let number = selected.children[0].innerHTML;

        let storedDrinks = JSON.parse(sessionStorage.getItem('drinks'));
        storedDrinks.splice((number - 1), 1);
        setOrderDrinks(storedDrinks);
    
        let storedAddOns = JSON.parse(sessionStorage.getItem('add_ons'));
        storedAddOns.splice((number - 1), 1);
        setOrderAddOns(storedAddOns);

        let deleteButton = document.getElementById("delete");
        deleteButton.classList.add("grayed-button");
    }

    const [addOns, setAddOns] = useState([]);

    useEffect(() => {
      const addOnOptions = async () => {
        try {
          const response = await axios.get(
            "https://thealley.onrender.com/add_on_jsx"
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
  
      addOnOptions();
    }, []);

    return (
        <div>
            <span class= "back" onClick={() => navigate(-1)}></span>
            <div class="columnWrapper">
                <h1 class="green">Add-Ons</h1>
            </div>
            <div class="columnWrapper">
                <div class="column bodyColumn">
                    <div class="button-container">
                    {addOns.map(addOn => (
                        <button key={addOn.ingredient_id} onClick={() => add_onToLocal(addOn.ingredient_id, addOn.name, addOn.cost)}>{capitalizeName(addOn.name, " ")}</button>
                    ))}
                    </div>
                </div>
                <div class="column bodyColumn">
                    <h3 class="brown">Current Order</h3>
                    <table>
                        <CashierOrder drinks={orderDrinks} add_ons={orderAdd_ons}></CashierOrder>
                    </table>
                    <div class="columnWrapper">
                        <button id="delete" onClick={deleteDrinkFromLocal} class="bottom-button grayed-button">Delete Selected</button>
                        <ButtonLink to={"../DrinkOptions"} className={"bottom-button"}>New Drink</ButtonLink>
                        <ButtonLink to={"../OrderSummary"} className={"bottom-button"}>Checkout</ButtonLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOn;
