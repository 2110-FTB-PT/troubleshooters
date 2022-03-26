import ProductForm from "./ProductForm";
import { useState } from "react";
import { addProduct } from "../api/productsApi";

const AddProduct = ({ token }) => {
  const [productFormData, setProductFormData] = useState({title: '', artist: '', description: '', price: '0', inventoryQuantity: 0, imgURL: ''})

  const handleAdd = async (event) => {
    event.preventDefault();
    console.log('hi');
    try {
      // need token
      const token = 'apsdof'
      const products = await addProduct(productFormData, token)
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <h2>Add Product</h2>
      <ProductForm state={productFormData} setState={setProductFormData} handleSubmit={handleAdd}/>
    </>
  )
}

export default AddProduct;