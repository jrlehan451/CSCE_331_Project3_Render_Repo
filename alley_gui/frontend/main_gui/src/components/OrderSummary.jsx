import CashierOrder from "./CashierOrder";
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../drink_options.css'

function ButtonLink({ id, to, className, children }) {
    return <Link to={to}><button id={id} class={className}>{children}</button></Link>;
} // Should get refactored into just a separate component to be so honest

const OrderSummary = () => {
    const [orderDrinks, setOrderDrinks] = useState([]);
    const [orderAdd_ons, setOrderAddOns] = useState([]);
    const [totalCost, setTotalCost] = useState(0.0);

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

        setTotalCost(calcTotalCost);
    }

    function selectPayment() {  
        let confirmButton = document.getElementById("confirm");
        confirmButton.classList.remove("grayed-button");
    }

    const calcTotalCost = useCallback(() => {
        var drinks = orderDrinks;
        var add_ons = orderAdd_ons;

        var totalCost = 0;
        for (var i = 0; i < drinks.length; ++i) {
            totalCost += parseFloat(drinks[i].cost);
            for (var j = 0; j < add_ons[i].length; ++j) {
                totalCost += parseFloat(add_ons[i][j].cost);
            }
        }

        return totalCost.toFixed(2);
    }, [orderDrinks, orderAdd_ons]);

    useEffect(() => {
        setTotalCost(calcTotalCost);
    }, [calcTotalCost])

    const postOrderToDB = async(e) => {
        e.preventDefault();

        try {     
            await axios.post("http://localhost:4000/post_order", {
                drinks: sessionStorage.getItem('drinks'),
                add_ons: sessionStorage.getItem('add_ons'),
                customer: document.getElementById("cname").value,
                totalCost: totalCost.toFixed(2)
            });
        } catch(err) {
            console.error(`Error: ${err}`);
        }
    }

    return (
        <div>
            <span class= "back" onClick={() => navigate(-1)}></span>
            <div class="columnWrapper">
                <h1 class="green">Order Summary</h1>
            </div>
            <div class="columnWrapper">
                <div class="column bodyColumn">
                    <div class="columnWrapper">
                        <label class="spacedLabel green">Customer Name: </label>
                        <input class="customer-name" type="text" id="cname" name="cname"/><br/>
                    </div>
                    <h3 class="green">Select Payment Method: </h3>
                    <button onClick={selectPayment} class="payment-option">Cash</button><br/>
                    <button onClick={selectPayment} class="payment-option">Credit</button><br/>
                    <button onClick={selectPayment} class="payment-option">Debit</button>
                </div>
                <div class="column bodyColumn">
                    <h3 class="brown">Current Order</h3>
                    <table>
                        <CashierOrder drinks={orderDrinks} add_ons={orderAdd_ons}></CashierOrder>
                    </table>
                    <div class="columnWrapper">
                        <button id="delete" onClick={deleteDrinkFromLocal} class="bottom-button grayed-button">Delete Selected</button>
                        <ButtonLink id={"confirm"} to={"../MakeNewOrder"} className={"bottom-button grayed-button"} onClick={postOrderToDB}>Confirm</ButtonLink>
                        <p class="total-cost">Total Cost: ${totalCost}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;