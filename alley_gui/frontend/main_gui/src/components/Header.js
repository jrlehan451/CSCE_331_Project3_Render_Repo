import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <h1>This is Home Page</h1>
      <ul className="nav">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        <li>
          <Link to="/cashier">Cashier</Link>
        </li>
        <li>
          <Link to="/manager">Manager</Link>
        </li>
        <li>
          <Link to="/customer">Customer</Link>
        </li>
      </ul>
    </>
  );
};

export default Header;
