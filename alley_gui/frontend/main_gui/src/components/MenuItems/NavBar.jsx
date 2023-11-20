//import backIcon from './pages/images';
import backIcon from '../../pages/images/back_arrow.png'; 
const Navbar = () => {
    return (
      <nav className="navbar">
          <a href="/Manager"> 
            <img
            src={backIcon}
            alt="Back"
            className="image-small" // Apply the CSS class
            />
        </a>
      </nav>
    );
  }
   
  export default Navbar;