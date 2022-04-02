import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BsFillBagCheckFill, BsVinylFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import Navigation from "../shared/Navigation";
import { useUserContext } from "../context/UserContext";

const Header = ({ text, bgColor, textColor, searchTerm, setSearchTerm, cart }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const headerStyles = {
    backgroundColor: bgColor,
    color: textColor,
  };

  return (
    <header style={headerStyles}>
      <div className="nav-container">
        <h1 className="logo">
          {text}
          <BsVinylFill />
        </h1>
        <nav className="navbar">
          <Navigation />
          <div className="search-container">
            <input type="text" placeholder="Search.." className="nav-search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          <BsFillBagCheckFill
            color="hotpink"
            className="checkout"
            onClick={() => navigate("/cart")}
          />
          <FaUserAlt
            onClick={() => {
              user.id ? navigate('/myprofile') : navigate('/login');
            }}
            color="hotpink"
            className="user"
          />
          <div className="checkout-number">{cart.products?.length}</div>
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
