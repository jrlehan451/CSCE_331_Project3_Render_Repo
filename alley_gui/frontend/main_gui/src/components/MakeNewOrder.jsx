import { Link } from 'react-router-dom';
import React, {useEffect} from "react";


function ButtonLink({ to, className, onClick, children }) {
    return <Link to={to}><button class={className} onClick={onClick}>{children}</button></Link>;
} // Should get refactored into just a separate component to be so honest

function clearSessionStorage() {
    sessionStorage.clear();
    sessionStorage.clear();
}

const MakeNewOrder = () => {
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
        <div class="vhCenter">
            <h1 class="green">Customer Order Completed</h1>
            <ButtonLink to={"../DrinkOptions"} className={"new-order-button"} onClick={clearSessionStorage}>Make New Order</ButtonLink>
        </div>
    );
}

export default MakeNewOrder;