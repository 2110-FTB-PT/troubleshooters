import {useState} from 'react';
import { register } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import Button from '../shared/Button';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const  [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { setToken } = useUserContext();
    const submit = async (e)=> {
        e.preventDefault();
        try {
            const [newToken,message] = await register(username,password,email);
            setToken(newToken);
            setMessage(message);
            navigate('/');
        }
        catch(error) {
            console.error(error);
            console.log(error.response);
            setMessage(error.response.data.message);
        }
    } 
    return (
        <form className="loginForm">
            <h1 className="Login">Register</h1>
            {message && <div>{message}</div>}
            <input className="loginBtn" placeholder="email" value={email} onChange={(event) => {setEmail(event.target.value)}}/>
            <input className="loginBtn" placeholder="username" value={username} onChange={(event) => {setUsername(event.target.value)}}/>
            <input className="loginBtn" placeholder="password" type="password" value={password} onChange={(event) => {setPassword(event.target.value)}}/>
            <Button onClick={submit} disabled={username.length === 0 || password.length === 0}>Register</Button>
            <div><Link to={'/login'}>Already have an account? Log in.</Link></div>
        </form>
    );
}

export default Register;