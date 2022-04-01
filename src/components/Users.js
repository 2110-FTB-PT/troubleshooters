import { useState, useEffect } from 'react';
import { getAllUsers } from '../api/usersApi';
import { useUserContext } from '../context/UserContext';
import Card from '../shared/Card';

const Users = () => {
  const [users, setUsers] = useState([]);
  const { token } = useUserContext();

  const handleUsers = async () => {
    try {
      const { users: userData } = await getAllUsers(token);
      setUsers(userData)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleUsers();
  }, [])


  return (
    <>
      {users.map(user => {
        return (
          <Card key={`${user.id}-${user.username}`}>
            <div className="single-user">
              <div>id: {user.id}</div>
              <div>username: {user.username}</div>
              <div>email: {user.email}</div>
              <div>isAdmin: {user.isAdmin ? "yes": "no"}</div>
            </div>
          </Card>
        )
      })}
    </>
  )
}

export default Users;