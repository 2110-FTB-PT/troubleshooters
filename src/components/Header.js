import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { BsFillCartCheckFill, BsVinylFill } from 'react-icons/bs'

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
                    <BsVinylFill/>
                </h1>
                <nav className="navbar">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/orders">Orders</Link></li>                        
                    <BsFillCartCheckFill color='hotpink' className='checkout'/>

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