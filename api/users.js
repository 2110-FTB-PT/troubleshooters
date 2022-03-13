const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { JWT_SECRET } = process.env;
const { createUser, getUser, getUserByUsername, updateUser } = require('../db');
const { route } = require('.');

router.get('/', async (req, res, next) => {
    const users = await getUser();

    res.send({
        users
    })
});

route.get('/myaccount', async (req, res, next) => {
    if (!req.user) {
        next({
            name: 'NoUserFound',
            message: 'You must be logged in to perform this action'
        })
    } else {
        res.send({
            ...req.user
        })
    }
})

router.post('/register', async (req, res, next) => {
    const { username, password, name, email } = req.body
    try {
        const _user = await getUserByUsername(username)
        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            })
        } else if (password.length < 8) {
            next({
                name: 'PasswordLengthError',
                message: 'Password must be 8 or more characters long'
            })
        } else if (!username || !password || !email || !name) {
            next({
                name: 'MissingCredentials',
                message: 'Plese fill all required fields'
            })
        } else {
            const user = await createUser({
                username,
                password,
                name,
                email
            });
            const token = jwt.sign({
                id: user.id,
                username
            }, process.env.JWT_SECRET, {
                expiresIn: '1w'
            })
            res.send({
                name: 'SuccessRegister',
                message: 'Thank you for signing up'
            })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            next({
                name: 'MissingCredentialsError',
                message: 'Please enter both username and password'
            });
        }
        const user = await getUserByUsername(username)
        const isMatch = await bcrypt.compare(password, user.password)
        if (user && isMatch) {
            const token = jwt.sign(user, JWT_SECRET);
            res.send({
                token,
                message: 'Thank you for logging in'
            })
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or Password incorrect'
            })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
})