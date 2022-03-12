const client = require("../client.js");

const createReviews = async ({ creatorId, productId, description }) => {
    try{
        if (!description) {
            throw{
                name: "FieldRequired",
                message: "Please provide the review."
            }
        }
        const { rows: [reviews]} = await client.query(`
            INSERT INTO reviews ("creatorId", "productId", description)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [creatorId, productId, description]);
        return reviews
    }catch(error){
    throw error;
    }
}

const getReviews = async ({ description }) => {
    try{
        const { rows: [reviews] } = await client.query(`
            SELECT *
            FROM reviews
            WHERE username=$1;
        `, [description])

        if(!description){
            throw{
                name: "ReviewNotFound",
                message: "No review found."
            }
        }
    }catch(error){
    throw error;
    }
}

const getReviewById = async (userId) => {
    try{
        const { rows: [reviews] } = await client.query(`
            SELECT *
            FROM reviews
            WHERE id=$1;
        `, [userId]);
        delete user.password;
        return reviews;
    }catch(error){
    throw error
    }
}

const getReviewByUsername = async (username) => {
    try{
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM reviews
            WHERE username=$1
        `, [username]);
        return reviews;
    }catch(error){
        throw error;
    }
}

const updateReviews = async ({ id, ...reviewField }) => {
    const setString = Object.keys(reviewField).map((key, index) =>
    `"${key}" = $${index + 1}`).join(', ')

    if(setString.length === 0){
        return;
    }
    const valuesArray = [...Object.values(fields), id];
    try{
        const { rows: [reviews] } = await client.query(`
            UPDATE reviews
            SET ${setString}
            WHERE id=$${valuesArray.length}
            RETURNING *;
        `, valuesArray);
        return reviews
    }catch(error){
        throw error;
    }
}

module.exports = {
    createReviews,
    getReviews,
    getReviewById,
    getReviewByUsername,
    updateReviews
}