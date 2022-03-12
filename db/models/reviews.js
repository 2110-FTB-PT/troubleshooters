const client = require("../client.js");
const { getUserById } = require("./users.js");

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
        const user = await getUserById(creatorId)
        if (!user){
            throw{
                name: "InvalidUser",
                message: "User does not exist."
            }
        }
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
        // if no review by that id exists; throw an error
        await getReviewById(id) 
        const { rows: [review] } = await client.query(`
            UPDATE reviews
            SET ${setString}
            WHERE id=$${valuesArray.length}
            RETURNING *;
        `, valuesArray);
        return review;
    }catch(error){
        throw error;
    }
}

const destroyReview = async (reviewId) => {
    try{
        // if no review by that id exists; throw an error
        await getReviewById(reviewId)
        const { rows: [deletedReviewId] } = await client.query(`
            DELETE FROM reviews
            WHERE id=$1
            RETURNING id;
        `, [reviewId])
        return deletedReviewId;
    }catch(error){
        throw error;
    }
}

module.exports = {
    createReview,
    getReviewsByUser,
    getReviewById,
    updateReview,
    destroyReview
}