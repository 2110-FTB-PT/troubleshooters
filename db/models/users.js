const client = require('./index');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10

const createUser = async ({ username, password }) => {
    const hashPwd = await bcrypt.hash(password, SALT_ROUNDS);
    try {
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

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
}