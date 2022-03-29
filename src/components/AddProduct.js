import { ProductForm } from "./";
import { useState } from "react";
import { addProduct } from "../api/productsApi";
import { useUserContext } from "../context/UserContext";

const AddProduct = ({ products, setProducts }) => {
  const { token } = useUserContext();
  const [productFormData, setProductFormData] = useState({title: '', artist: '', description: '', price: '0', inventoryQuantity: 0, imgURL: ''})

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
      <ProductForm state={productFormData} setState={setProductFormData} handleSubmit={handleAdd}/>
    </>
  )
}

export default AddProduct;