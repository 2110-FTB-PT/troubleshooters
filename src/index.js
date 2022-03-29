import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import UserProvider from './context/UserContext';
import './index.css'

ReactDOM.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>,
    document.getElementById('root')
);