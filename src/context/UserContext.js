import { useContext, useState, useEffect, createContext } from "react";
import { getUser } from "../api";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
}

const UserProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});

  const handleUser = async (token) => {
    try {
      const fetchedUsers = await getUser(token);
      setUser(fetchedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      handleUser(token);
    }
  }, [token]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);
  
  return (
    <UserContext.Provider value={{
        token,
        setToken,
        user
      }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider;