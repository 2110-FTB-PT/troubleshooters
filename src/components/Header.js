import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { BsFillBagCheckFill, BsVinylFill } from 'react-icons/bs'
import { FaUserAlt, FaSearch } from 'react-icons/fa'

function Header({ text, bgColor, textColor }) {
    const headerStyles = {
        backgroundColor: bgColor,
        color: textColor,
    }
    return (
        <header style={headerStyles}>
            <div className="container">
                <h1>
                    {text}
                    <BsVinylFill />
                </h1>
                <nav className="navbar">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/orders">Orders</Link></li>
                    <div className="search-container">
                        <input type="text" placeholder="Search.." name="search" />
                        <button type="submit"><FaSearch className="search-btn"></FaSearch></button>
                    </div>
                    <li><BsFillBagCheckFill color='hotpink' className='checkout' /></li>
                    <li><FaUserAlt color='hotpink' className='user' /></li>
                </nav>
            </div>
        </header>
    )
}

Header.defaultProps = {
    text: 'Crate Diggers',
    bgColor: 'rgba(0,0,0,0.4)',
}

Header.protoTypes = {
    text: PropTypes.string,
}


export default Header