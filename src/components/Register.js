import {useState} from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';
const Register = ({setToken}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const  [error, setError] = useState('');
    const submit = async (e)=> {
        console.log(e);
        e.preventDefault();
        try {
            const newToken = await register(username,password);
            setToken(newToken);
            navigate('/');
        }
        catch(ex) {
            setError(ex);
        }
        
        
    }
    return (
        <form onSubmit= {submit}>
            <h1>Register</h1>
            {error}
            <input placeholder="username" value={username} onChange={(event) => {setUsername(event.target.value)}}/>
            <input placeholder="password" type="password" value={password} onChange={(event) => {setPassword(event.target.value)}}/>
            <button disabled={username.length === 0 || password.length === 0}>Register</button>
        </form>
        
    );
}

export default Register;