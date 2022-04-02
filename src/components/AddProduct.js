import { ProductForm } from "./";
import { useState } from "react";
import { addProduct } from "../api/productsApi";
import { useUserContext } from "../context/UserContext";
import Card from "../shared/Card";
import SingleProduct from "./SingleProduct";

const AddProduct = ({ products, setProducts, categories }) => {
  const { token } = useUserContext();
  const [productFormData, setProductFormData] = useState({title: '', artist: '', description: '', price: '', inventoryQuantity: 0, imgURL: ''})
  const [categoryIds, setCategoryIds] = useState([]);

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const product = await addProduct(productFormData, token);
      const newProducts = products;
      newProducts.push(product);
      setProducts(newProducts);
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