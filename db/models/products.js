const client = require("../client.js");

const createProduct = async ({ title, description, price, inventoryQuantity, imgURL }) => {
  try {
    if (!title, !description, !price, !inventoryQuantity) {
      throw {
        name: "MissingRequiredFields",
        message: "Please provide the title, description, price, and quantity"
      }
    }
    const { rows: [product] } = await client.query(`
      INSERT INTO products(title, description, price, "inventoryQuantity", "imgURL") 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [title, description, price, inventoryQuantity, imgURL]);

    return product;
  } catch (error) {
    throw error;
  }
}

// helper function to both get a single product by id AND 
// construct our ideal product object that contains both the reviews and categories
const getProductById = async (productId) => {
  try {
    const { rows: [product] } = await client.query(`
      SELECT * FROM products
      WHERE id = $1; 
    `, [productId]);

    // returns undefined if no products exist
    if (!product) {
      return product;
    }

    const { rows: reviews } = await client.query(`
      SELECT * FROM reviews
      WHERE productId = $1;
    `, [productId]);

    const { rows: categories } = await client.query(`
      SELECT categories.*, product_categories.id AS "productCategoryId
      FROM categories
      JOIN product_categories ON categories.id = product_categories."categoryId"
      WHERE product_categories."productId" = $1; 
    `, [productId]);

    const newProduct = { ...product, reviews, categories };

    return newProduct;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createProduct
}