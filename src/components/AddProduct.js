import { ProductForm } from "./";
import { useState } from "react";
import { addProduct } from "../api/productsApi";
import { useUserContext } from "../context/UserContext";
import Card from "../shared/Card";
import SingleProduct from "./SingleProduct";
import { addCategoryToProduct } from "../api/categoryApi";
import { useNavigate } from "react-router";

const AddProduct = ({ products, setProducts, categories }) => {
  const { token } = useUserContext();
  const navigate = useNavigate();
  const [productFormData, setProductFormData] = useState({title: '', artist: '', description: '', price: '', inventoryQuantity: 0, imgURL: ''})
  const [categoryIds, setCategoryIds] = useState([]);

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const product = await addProduct(productFormData, token);
      // adds categories to our newly created product at the same time
      const id_categories = await Promise.all(categoryIds.map((categoryId) => {
        return addCategoryToProduct(product.id, categoryId, token);
      }));
      let newCategories = []
      // creates our categories array to update our local state product w the categories
      id_categories.forEach(category => {
        categories.forEach(_category => {
          if (_category.id === category.categoryId) {
            newCategories.push(_category)
          }
        })
      })
      product.categories = newCategories;
      product.reviews = [];
      const newProducts = products;
      newProducts.push(product);
      setProducts(newProducts);
      navigate("/products");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h2>Add Product</h2>
      <Card>
        <SingleProduct product={productFormData} />
      </Card>
      <Card>
        <ProductForm state={productFormData} setState={setProductFormData} handleSubmit={handleAdd} categories={categories} categoryIds={categoryIds} setCategoryIds={setCategoryIds} />
      </Card>
    </>
  )
}

export default AddProduct;