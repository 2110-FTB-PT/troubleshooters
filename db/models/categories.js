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

const getAllCategories = async () => {
    try {
        const { rows: categories } = await client.query(`
        SELECT * FROM categories;
        `);
    
        return categories;
    }
    catch (error) {
    throw error;
    }
    }

const deleteCategory = async (id) => {
    try {
        await client.query(`
        DELETE FROM product_categories
        WHERE "categoryId" = $1;
        `, [id])
        const { rows: [deletedCategoryId] } = await client.query(`
        DELETE FROM categories
        WHERE id = $1
        RETURNING id;
        `, [id]);
        
    return deletedCategoryId;
    }
    catch (error) {
        throw error;
    }
}
module.exports = {
    createCategory,
    getAllCategories,
    deleteCategory
};