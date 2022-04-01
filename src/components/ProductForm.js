import { useState } from "react";
import InputFields from "../shared/InputFields";
import "./ProductForm.css";

const ProductForm = ({ state, setState, handleSubmit }) => {

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <InputFields state={state} setState={setState} />
      <button>Confirm Product</button>
    </form>
  )
}

export default ProductForm;