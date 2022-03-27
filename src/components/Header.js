import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { BsFillBagCheckFill, BsVinylFill } from "react-icons/bs";
import { FaUserAlt, FaSearch, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Header({ text, bgColor, textColor }) {
  const navigate = useNavigate();
  const headerStyles = {
    backgroundColor: bgColor,
    color: textColor,
  };

  return (
    <header style={headerStyles}>
      <div className="container">
        <h1>
          {text}
          <BsVinylFill />
        </h1>
        <nav className="navbar">
          <li>
            <Link to="/" href="#home">Home</Link>
          </li>
          <li>
            <Link to="/products" href="#products">Products</Link>
          </li>
          <li>
            <Link to="/orders" href="#orders">Orders</Link>
          </li>
          <li>
            <Link to="/myorders/:creatorId" href="#myorders">My Orders</Link>
          </li>
          <li>
            <Link to="/login" href="#login">Login</Link>
          </li>
          <div className="search-container">
            <input type="text" placeholder="Search.." name="search" />
            <button type="submit">
              <FaSearch className="search-btn"></FaSearch>
            </button>
          </div>
          <li>
            <BsFillBagCheckFill color="hotpink" className="checkout" />
          </li>
          <li>
            <FaUserAlt
              onClick={() => navigate("/myprofile")}
              color="hotpink"
              className="user"
            />
          </li>
        </nav>
      </div>
    </header>
  );
}

Header.defaultProps = {
  text: "Crate Diggers",
  bgColor: "rgba(0,0,0,0.4)",
};

Header.protoTypes = {
  text: PropTypes.string,
};

export default Header;
