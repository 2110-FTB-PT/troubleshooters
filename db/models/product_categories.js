const client = require('../client')

const addCategoryToProduct = async ({ productId, categoryId}) => {
  try {
    const { rows: [productCategory] } = await client.query(`
      INSERT INTO product_categories("productId", "categoryId") 
      VALUES ($1, $2)
      RETURNING *;
    `, [productId, categoryId]);

    return productCategory;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addCategoryToProduct
}