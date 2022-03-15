const client = require("../client.js");

const createCategory = async ({ name }) => {
try {
if (!name) {
    throw {
        name: "NoCategory",
        message: "Category can't be empty. Please provide a category name."
    }
}
const name_lowercase = name.toLowerCase()
const { rows: [category] } = await client.query(`
    INSERT INTO categories(name)
    VALUES ($1)
    RETURNING *;
`, [name_lowercase])
    return category;
}
catch (error){
throw error;
}
}

exports.modules = {
    createCategory
};