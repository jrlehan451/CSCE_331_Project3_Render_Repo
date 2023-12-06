import React,{useEffect}from 'react';
import './customer_checkout.css';
const orderNumber = Math.floor((Math.random() * Date.now())/100000);

const Checkout = () => {
  const makeNewOrder = () => {
    sessionStorage.clear();
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("customer_checkout", "customer");
  };

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

  return (
    <div className="checkout-background">
        <div className="container">
            <h1 className="confirmation">Order Confirmation #{orderNumber}</h1>
        </div>
        <div className="new-order">
            <button onClick={makeNewOrder} className="confirmation">New Order</button>
        </div>
    </div>
  );
};

export default Checkout;
