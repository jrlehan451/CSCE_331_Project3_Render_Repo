import CashierOrder from "./CashierOrder";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../drink_options.css'

function ButtonLink({ to, className, children }) {
    return <Link to={to}><button class={className}>{children}</button></Link>;
} // Should get refactored into just a separate component to be so honest

const AddDrink = ({capitalizeName}) => {
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

    function drinkToLocal(_id, _name, _cost) {    
        let newDrink = {
            id: _id,
            name: _name,
            cost: _cost
        };
    
        setOrderDrinks(prevDrinks => {
            return [...prevDrinks, newDrink]
        });
    
        setOrderAddOns(prevAO => {
            return [...prevAO, []]
        });
    }

    const {category} = useParams();
    const [drinks, setDrinks] = useState([]);

    useEffect(() => {
      const drinkOptions = async () => {
        try {
          const response = await axios.get(
            "http://localhost:4000/add_drink_jsx", {params: { category: category}}
          );
          const jsonVals = await response.data;
          console.log("Working");
          console.log(jsonVals.data.drinks);
          setDrinks(jsonVals.data.drinks.rows);
        } catch (err) {
          console.log("ERROR");
          console.error(err.message);
        }
      };
  
      drinkOptions();
    }, [category]);

    return (
        <div>
            <span class= "back" onClick={() => navigate(-1)}></span>
            <div class="columnWrapper">
                <h1 class="green">Add Drink</h1>
            </div>
            <div class="columnWrapper">
                <div class="column bodyColumn">
                    <div class="button-container">
                    {drinks.map(drink => (
                        <button key={drink.drink_id} onClick={() => drinkToLocal(drink.drink_id, drink.name, drink.cost)}>{capitalizeName(drink.name, " ")}</button>
                    ))}
                    </div>
                </div>
                <div class="column bodyColumn">
                    <h3 class="brown">Current Order</h3>
                    <table>
                        <CashierOrder drinks={orderDrinks} add_ons={orderAdd_ons}></CashierOrder>
                    </table>
                    <div class="columnWrapper">
                        <ButtonLink to={"../AddOn"} className={"bottom-button"}>Add-Ons</ButtonLink>
                        <ButtonLink to={"../OrderSummary"} className={"bottom-button"}>Checkout</ButtonLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDrink;