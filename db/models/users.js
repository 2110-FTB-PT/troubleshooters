const client = require('../client');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const createUser = async ({ username, password, email, isAdmin }) => {
    try {
        if (!username || !password || !email) {
            throw {
                name: "FieldsRequired",
                message: "You must provide all required fields"
            }
        }
        const hashPwd = await bcrypt.hash(password, SALT_ROUNDS);

        if (isAdmin) {
            const { rows: [user] } = await client.query(`
            INSERT INTO users (username, email, password, "isAdmin")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [username, email, hashPwd, isAdmin]);
            delete user.password
            return user;
        } else {
            const { rows: [user] } = await client.query(`
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
    `, [username, email, hashPwd]);

            delete user.password
            return user;
        }
    } catch (error) {
        throw error;
    }
}


const createAdminUser = async ({ username, password, email, isAdmin }) => {
    try {
        if (!username || !password || !email) {
            throw {
                name: "FieldsRequired",
                message: "You must provide all required fields"
            }
        }

        const hashPwd = await bcrypt.hash(password, SALT_ROUNDS);

        const { rows: [user] } = await client.query(`
            INSERT INTO users (username, email, password, "isAdmin")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [username, email, hashPwd, isAdmin]);
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
        } else {
            throw {
                name: 'IncorrectPswd',
                message: 'The password entered is not correct'
            }
        }
    } catch (error) {
        throw error;
    }
}

const getAllUsers = async () => {
    try {
        const { rows: users } = await client.query(`
            SELECT id, username, email, "isAdmin"
            FROM users;
        `)
        return users

    } catch (error) {
        throw error
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
        delete user.password;
        return user;
    } catch (error) {
        throw error;
    }
}

const getUserByEmail = async (email) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE email=$1;
        `, [email]);
        return user;
    } catch (error) {
        throw error;
    }
}

const updateUser = async ({ id, ...userFields }) => {
    const setString = Object.keys(userFields).map((key, index) =>
        `"${key}" = $${index + 1}`).join(', ')

    if (setString.length === 0) {
        throw {
            name: "FieldsRequired",
            message: "You must provide all required fields"
        }
    }
    try {
        const hashPwd = await bcrypt.hash(userFields.password, SALT_ROUNDS)
        userFields.password = hashPwd;
        const valuesArray = [...Object.values(userFields), id];
        const { rows: [user] } = await client.query(`
            UPDATE users
            SET ${setString}
            WHERE id=$${valuesArray.length}
            RETURNING *;
        `, valuesArray);
        delete user.password
        return user
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    createAdminUser,
    getUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    updateUser
}