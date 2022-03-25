import { useState } from "react";
import InputFields from "../shared/InputFields";

const ProductForm = () => {
  const [productFormData, setProductFormData] = useState({title: '', artist: '', description: '', price: '0', inventoryQuantity: 0, imgURL: ''})

  return (
    <form>
      <InputFields state={productFormData} setState={setProductFormData} />
      <button>Confirm Product</button>
    </form>
  )
}

export default ProductForm;