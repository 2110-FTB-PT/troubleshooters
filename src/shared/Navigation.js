import { useState } from "react"
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUserContext } from '../context/UserContext';

function Navigation() {
    const [showMenu, setShowMenu] = useState(false)
    const { user } = useUserContext();

    let menu
    let menuMask

    if (showMenu) {
        menu =
            <ul id="myLinks" onClick={(() => setShowMenu(false))}>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                {user?.id && 
                    <>
                        <Link to="/myreviews">My Reviews</Link>
                        <Link to="/myorders">My Orders</Link>
                    </>
                }
                <Link to="/about">About Us</Link>
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