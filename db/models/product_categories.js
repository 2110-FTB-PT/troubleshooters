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

const deleteProductCategory = async (productCategoryId) => {
  try {
    const { rows: [_productCategoryId] } = await client.query(`
      DELETE FROM product_categories
      WHERE id = $1
      RETURNING id;
    `, [productCategoryId]);

    if (!_productCategoryId) {
      throw {
        name: "MissingRelation",
        message: "That category isn't attached to that product"
      }
    }

    return _productCategoryId;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addCategoryToProduct,
  deleteProductCategory
}