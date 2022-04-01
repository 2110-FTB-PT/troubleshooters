import ProductForm from "./ProductForm";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import SingleProduct from "./SingleProduct";
import Card from "../shared/Card";
import { updateProduct } from "../api/productsApi";
import { useUserContext } from "../context/UserContext";

const EditProduct = ({ products, setProducts, categories }) => {
  const navigate = useNavigate();
  const { editProductId } = useParams();
  const [productToEdit, setProductToEdit] = useState({});
  const { token } = useUserContext();
  const [storeCategories, setStoreCategories] = useState([])
  const [storeReviews, setStoreReviews] = useState([])

  useEffect(() => {
    const [product] = products.filter(product => product.id === Number(editProductId));
    // remove fields that don't need to be edited
    setStoreReviews(product.reviews);
    delete product.reviews;
    setStoreCategories(product.categories);
    delete product.categories;
    setProductToEdit(product);
    // restores our product to its original state if the admin backs out of the edit
    // window.onpopstate = () => {
    //   product.reviews = storeReviews;
    //   product.categories = storeCategories;
    // }
  }, [])

  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      const updatedProduct = await updateProduct(productToEdit, token)
      let copyProducts = products;
      copyProducts.forEach((product, index) => {
        if (product.id === updatedProduct.id) {
          copyProducts[index] = updatedProduct;
          copyProducts[index].reviews = storeReviews;
          copyProducts[index].categories = storeCategories;
        }
      });
      setProducts(copyProducts);
      navigate('/products');
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
      <Card>
        <ProductForm state={productToEdit} setState={setProductToEdit} handleSubmit={handleEdit} categories={categories}/>
      </Card>
    </>
  )
}

export default EditProduct;