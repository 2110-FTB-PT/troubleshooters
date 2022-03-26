import { useState } from "react";
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
const Login =  ({setToken}) => { 
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const handleLogin = async (e)=> {
       e.preventDefault();
       try {
        const [token, message] = await login(username,password);
        setToken(token); 
        navigate('/')
       } catch (error) {
           console.error(error)
           setMessage(error.response.data.message)
       }
    }
    return (
        <form onSubmit= {handleLogin}>
            <h1>Login</h1>
            <input placeholder="username" value={username} onChange={(event) => {setUsername(event.target.value)}}/>
            <input placeholder="password" type="password" value={password} onChange={(event) => {setPassword(event.target.value)}}/>
            <button>Login</button>
        </form> 
    );
}

export default Login;