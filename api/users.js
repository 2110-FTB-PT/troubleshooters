const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { JWT_SECRET } = process.env;
const { createUser, getUser, getUserById, getUserByUsername, updateUser } = require('../db');

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
try{
    if (!username || !password){
        next({
            name: "MissingCredentialsError",
            message: "Please enter both username and password"
        });
    }   
        const user = await getUserByUsername(username)
        const isMatch = await bcrypt.compare(password, user.password)
        if (user && isMatch){
            const token = jwt.sign(user, JWT_SECRET);
            res.send({ 
                token, 
                message: "Thank you for logging in" 
            })
        }else{
            next({
                name: "IncorrectCredentialsError",
                message: "Username or Password incorrect"
            })
        }
    }catch(error){
        next(error);
    }
})