import Card from "../shared/Card";
import { useNavigate } from "react-router";
import { useUserContext } from "../context/UserContext";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, setUser, setToken } = useUserContext();
  
  const handleLogout = () => {
    setUser({})
    setToken('')
    localStorage.removeItem('token')
    navigate('/products')
  }
  return (
    <>
      <h2>Welcome, {user.username}</h2>
      <Card handleClick={() => navigate("/myreviews")}>
        <h2>My Reviews</h2>
      </Card>
      <Card handleClick={() => navigate("/myorders")}>
        <h2>My Orders</h2>
      </Card>
      <Card handleClick={() => navigate("/myprofile/update")}>
        <h2>Update Account</h2>
      </Card>
      { user.id &&
      <Card handleClick={handleLogout}>
        <h2>Logout</h2>
      </Card>
      }
      { user?.isAdmin &&
      <>
        <h2>Admin Actions:</h2>
        <Card handleClick={() => navigate("/addproduct")}>
          <h2>Add Product</h2>
        </Card>
        <Card>
          <h2>View All Accounts</h2>
        </Card>
        <Card>
          <h2>View All Orders</h2>
        </Card>
      </>
      }
    </>
  )
}

export default MyProfile;