import { Link } from 'react-router-dom';

function ButtonLink({ to, className, onClick, children }) {
    return <Link to={to}><button class={className} onClick={onClick}>{children}</button></Link>;
} // Should get refactored into just a separate component to be so honest

function clearSessionStorage() {
    sessionStorage.clear();
    sessionStorage.clear();
}

const MakeNewOrder = () => {
    return (
        <div class="vhCenter">
            <h1 class="green">Customer Order Completed</h1>
            <ButtonLink to={"../DrinkOptions"} className={"new-order-button"} onClick={clearSessionStorage}>Make New Order</ButtonLink>
        </div>
    );
}

export default MakeNewOrder;