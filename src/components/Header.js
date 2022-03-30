import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BsFillBagCheckFill, BsVinylFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import Navigation from "../shared/Navigation";

function Header({ token, text, bgColor, textColor }) {
  const navigate = useNavigate();
  const headerStyles = {
    backgroundColor: bgColor,
    color: textColor,
  };


  return (
    <header style={headerStyles}>
      <div className="container">
        <h1 className="logo">
          {text}
          <BsVinylFill />
        </h1>
        <nav className="navbar" >
          <Navigation />
          <div className="search-container">
            <input type="text" placeholder="Search.." className="nav-search" />
          </div>
          <BsFillBagCheckFill color="hotpink" className="checkout" />
          <FaUserAlt
            onClick={() => navigate("/myprofile")}
            color="hotpink"
            className="user"
          />
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
