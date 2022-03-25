import Card from "../shared/Card";
import { useNavigate } from "react-router";

const MyProfile = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2>Welcome, -username-</h2>
      <Card handleClick={() => navigate("/myreviews")}>
        <div>
          <h2 >My Reviews</h2>
        </div>
      </Card>
      <Card handleClick={() => navigate("/myorders")}>
        <h2>My Orders</h2>
      </Card>
      <Card handleClick={() => navigate("/myprofile/update")}>
        <h2>Update Account</h2>
      </Card>
    </>
  )
}

export default MyProfile;