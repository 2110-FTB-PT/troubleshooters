const client = require("../client.js");

const createReview = async ({ creatorId, productId, description }) => {
    try{
        if (!description) {
            throw{
                name: "FieldRequired",
                message: "Please provide the review."
            }
        }
        const { rows: [review]} = await client.query(`
            INSERT INTO reviews ("creatorId", "productId", description)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [creatorId, productId, description]);
        return review
    }catch(error){
    throw error;
    }
}

const getReviewsByUser = async ({ creatorId }) => {
    try{
        const { rows: reviews } = await client.query(`
            SELECT *
            FROM reviews
            WHERE "creatorId"=$1;
        `, [creatorId])

        if(!reviews){
            throw{
                name: "ReviewNotFound",
                message: "No review found."
            }
        }
        return reviews
    }catch(error){
    throw error;
    }
}

const getReviewById = async (id) => {
    try{
        const { rows: [review] } = await client.query(`
            SELECT *
            FROM reviews
            WHERE id=$1;
        `, [id]);
        return review;
    }catch(error){
    throw error
    }
}

const updateReview = async ({ id, ...reviewField }) => {
    const setString = Object.keys(reviewField).map((key, index) =>
    `"${key}" = $${index + 1}`).join(', ')

    if(setString.length === 0){
        throw {
            name: "MissingFields",
            message: "No fields were provided to be updated. You must update at least one field."
        };
    }
    const valuesArray = [...Object.values(fields), id];
    try{
        const { rows: [review] } = await client.query(`
            UPDATE reviews
            SET ${setString}
            WHERE id=$${valuesArray.length}
            RETURNING *;
        `, valuesArray);
        return review
    }catch(error){
        throw error;
    }
}

module.exports = {
    createReview,
    getReviewsByUser,
    getReviewById,
    updateReview
}