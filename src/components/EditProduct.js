import ProductForm from "./ProductForm";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import SingleProduct from "./SingleProduct";
import Card from "../shared/Card";

const EditProduct = ({ products, setProducts }) => {
  const { editProductId } = useParams();
  const [productToEdit, setProductToEdit] = useState({});

  useEffect(() => {
    const [product] = products.filter(product => product.id === Number(editProductId));
    // remove fields that don't need to be edited
    delete product.reviews
    delete product.categories
    setProductToEdit(product);
  }, [])

  const handleEdit = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h2>Edit Product</h2>
      <Card>
        <SingleProduct product={productToEdit}/>
      </Card>
      <ProductForm state={productToEdit} setState={setProductToEdit} handleSubmit={handleEdit} />
    </>
  )
}

export default EditProduct;