const client = require("../client.js");

const createReview = async ({ creatorId, productId, rating, description }) => {
    try{
        if (!description) {
            throw{
                name: "FieldRequired",
                message: "Please provide the review."
            }
        }
        const { rows: [review]} = await client.query(`
            INSERT INTO reviews ("creatorId", "productId", rating, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, productId, rating, description]);
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
        if (!review){
            throw{
                name: "MissingReview",
                message: "No review by that id exists."
            }
        }
        return review;
    }catch(error){
    throw error
    }
}

const getReviewByProductId = async (productId) => {
    try{
        const { rows: [review] } = await client.query(`
            SELECT *
            FROM reviews
            WHERE "productId"=$1;
        `, [productId]);
        if (!review){
            throw{
                name: "MissingReview",
                message: "No review found"
            }
        }
        return review;
    }catch(error){
    throw error
    }
}

const updateReview = async ({ id, ...reviewFields }) => {
    const setString = Object.keys(reviewFields).map((key, index) =>
    `"${key}" = $${index + 1}`).join(', ')

    if(setString.length === 0){
        throw {
            name: "MissingFields",
            message: "No fields were provided to be updated. You must update at least one field."
        };
    }
    const valuesArray = [...Object.values(reviewFields), id];
    try{
        const { rows: [review] } = await client.query(`
            UPDATE reviews
            SET ${setString}
            WHERE id=$${valuesArray.length}
            RETURNING *;
        `, valuesArray);
        if (!review){
            throw{
                name: "MissingReview",
                message: "No review by that id exists."
            }
        }
        return review;
    }catch(error){
        throw error;
    }
}

const destroyReview = async (reviewId) => {
    try{
        const { rows: [deletedReviewId] } = await client.query(`
            DELETE FROM reviews
            WHERE id=$1
            RETURNING id;
        `, [reviewId])
        if (!deletedReviewId){
            throw{
                name: "MissingReview",
                message: "No review by that id exists."
            }
        }
        return deletedReviewId;
    }catch(error){
        throw error;
    }
}

module.exports = {
    createReview,
    getReviewsByUser,
    getReviewById,
    getReviewByProductId,
    updateReview,
    destroyReview
}