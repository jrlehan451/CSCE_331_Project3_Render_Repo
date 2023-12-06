import backIcon from '../../pages/images/back_arrow.png'; 
//Basig navigation bar structure

/**
 * @description creates the navigation bar component
 * @component NavBar
 * @returns navbar
 */
const Navbar = () => {
    return (
      <nav className="navbar">
          <a href="/Manager"> 
            <img
            src={backIcon}
            alt="Back"
            className="image-small" 
            />
        </a>
      </nav>
    );
  }
   
  export default Navbar;