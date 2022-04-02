import ProductForm from "./ProductForm";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import SingleProduct from "./SingleProduct";
import Card from "../shared/Card";
import { updateProduct } from "../api/productsApi";
import { useUserContext } from "../context/UserContext";
import { addCategoryToProduct } from "../api/categoryApi";

const EditProduct = ({ products, setProducts, categories }) => {
  const navigate = useNavigate();
  const { editProductId } = useParams();
  const [productToEdit, setProductToEdit] = useState({});
  const [categoryIds, setCategoryIds] = useState([]);
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
  }, [])

  // restores our product to its original state if the admin backs out of the edit
  window.onpopstate = () => {
    let copyProducts = products;
    copyProducts.forEach((currProduct, index) => {
      if (productToEdit.id === currProduct.id) {
        copyProducts[index].reviews = storeReviews;
        copyProducts[index].categories = storeCategories;
      }
    });
    setProducts(copyProducts);
  }

  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      const updatedProduct = await updateProduct(productToEdit, token)
      let copyProducts = products;
      // grab ids of newly added categories
      const newCategoryIds = categoryIds.filter(categoryId => {
        let isNewCategory = true;
        storeCategories.forEach(category => {
          if (category.id === categoryId) {
            isNewCategory = false;
          }
        })
        return isNewCategory;
      });
      const id_categories = await Promise.all(newCategoryIds.map((categoryId) => {
        return addCategoryToProduct(editProductId, categoryId, token);
      }));
      // add newly added categories into our storeCategories state
      let newCategories = storeCategories
      id_categories.forEach(category => {
        categories.forEach(_category => {
          if (_category.id === category.categoryId) {
            console.log(_category)
            newCategories.push(_category);
          }
        })
      })
      // rebuild all our products
      copyProducts.forEach((product, index) => {
        if (product.id === updatedProduct.id) {
          copyProducts[index] = updatedProduct;
          copyProducts[index].reviews = storeReviews;
          copyProducts[index].categories = newCategories;
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
        <ProductForm state={productToEdit} setState={setProductToEdit} handleSubmit={handleEdit} categories={categories} storeCategories={storeCategories} categoryIds={categoryIds} setCategoryIds={setCategoryIds}/>
      </Card>
    </>
  )
}

export default EditProduct;