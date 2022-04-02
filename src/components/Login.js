import { useState, useContext } from "react";
import { login } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from "../context/UserContext";
import Button from "../shared/Button";

const Login =  () => { 
    const { setToken } = useUserContext()

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const handleLogin = async (e)=> {
       e.preventDefault();
       try {
        const [token, message] = await login(username,password);
        setMessage[message];
        setToken(token); 
        navigate('/')
       } catch (error) {
           console.error(error)
           setMessage(error.response.data.message)
       }
    }
    return (
        <form>
            <h1>Login</h1>
            {message && <div>{message}</div>}
            <input placeholder="username" value={username} onChange={(event) => {setUsername(event.target.value)}}/>
            <input placeholder="password" type="password" value={password} onChange={(event) => {setPassword(event.target.value)}}/>
            <Button onClick={handleLogin}>Login</Button>
            <div><Link to={'/register'}>Don't have an account? Sign up.</Link></div>
        </form> 
    );
}

export default Login;