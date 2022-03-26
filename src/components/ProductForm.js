import { useState } from "react";
import InputFields from "../shared/InputFields";

const ProductForm = ({ state, setState, handleSubmit }) => {

  return (
    <form onSubmit={handleSubmit}>
      <InputFields state={state} setState={setState} />
      <button>Confirm Product</button>
    </form>
  )
}

export default ProductForm;