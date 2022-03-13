const client = require('../client');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const createUser = async ({ username, password, email }) => {
    try {
        if (!username || !password || !email) {
            throw {
                name: "FieldsRequired",
                message: "You must provide both a username and password!"
            }
        }

        const hashPwd = await bcrypt.hash(password, SALT_ROUNDS);

        const { rows: [user] } = await client.query(`
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [username, email, hashPwd]);
        delete user.password
        return user;
    } catch (error) {
        throw error;
    }
}

const getUser = async ({ username, password }) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username=$1;
        `, [username])

        if (!user) {
            throw {
                name: "UserNotFound",
                message: "No user found."
            }
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            delete user.password;
            return user;
        }
    } catch (error) {
        throw error;
    }
}

const getUserById = async (userId) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM USERS
            WHERE id=$1;
        `, [userId])
        delete user.password;
        return user;
    } catch (error) {
        throw error;
    }
}

const getUserByUsername = async (username) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username=$1;
        `, [username]);
        return user;
    } catch (error) {
        throw error;
    }
}

const updateUser = async ({ id, ...userField }) => {
    const setString = Object.keys(userField).map((key, index) =>
    `"${key}" = $${index + 1}`).join(', ')

    if (setString.length === 0){
        return;
    }
    const valuesArray = [...Object.values(fields), id];
    try{
        const { rows: [user] } = await client.query(`
            UPDATE users
            SET ${setString}
            WHERE id=$${valuesArray.length}
            RETURNING *;
        `, valuesArray);

        return user
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    updateUser
}