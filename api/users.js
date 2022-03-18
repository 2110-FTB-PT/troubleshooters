const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { JWT_SECRET } = process.env;
const { createUser, getUser, getAllUsers, getUserByEmail, getUserByUsername } = require('../db');
const { requireUser, requireAdminUser } = require('./utils');


// users/
router.get('/', requireAdminUser, async (req, res, next) => {
    const users = await getAllUsers();
    try {
        res.send({
            users
        })
    } catch ({ name, message }) {
        next({ name, message })
    }
});

// users/my account
router.get('/myaccount', requireUser, async (req, res, next) => {
        res.send({
                ...req.user
        })
})

// users/register
router.post('/register', async (req, res, next) => {
    const { username, password, email } = req.body
    try {
        const _user = await getUserByUsername(username)
        const emailUsed = await getUserByEmail(email)
        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            })
        } else if (emailUsed) {
            next({
                name: 'UserExistsError',
                message: 'The email has been used already'
            })
        } else if (password.length < 8) {
            next({
                name: 'PasswordLengthError',
                message: 'Password must be 8 or more characters long'
            })
        } else if (!username || !password || !email ) {
            next({
                name: 'MissingCredentials',
                message: 'Plese fill all required fields'
            })
        } else {
            const user = await createUser({
                username,
                password,
                email
            });
            const token = jwt.sign(user, process.env.JWT_SECRET, {
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

// users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            next({
                name: 'MissingCredentialsError',
                message: 'Please enter both username and password'
            });
            return;
        }
        const user = await getUser({username, password})
        if (user) {
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

module.exports = router;