import { useState } from "react"
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navigation({ token }) {
    const [showMenu, setShowMenu] = useState(false)

    let menu
    let menuMask

    if (showMenu) {
        menu =
            <ul id="myLinks">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/orders">Orders</Link>
                <Link to="/myorders/:creatorId">My Orders</Link>
                {token && <Link to="/myorders">My Orders</Link>}
                <Link to="/login">Login</Link>
            </ul>

        menuMask =
            <div id="myMenu" onClick={(() => setShowMenu(false))}></div>
    }


    return (
        <nav>
            <FaBars id="mySidenav"
                onClick={(() => setShowMenu(!showMenu))}
            />
            {menuMask}
            {menu}
        </nav>
    )
}

export default Navigation