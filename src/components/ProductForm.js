import InputFields from "../shared/InputFields";
import Button from "../shared/Button";
import "./ProductForm.css";

const ProductForm = ({ state, setState, handleSubmit }) => {

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <InputFields state={state} setState={setState} />
      <Button>Confirm Product</Button>
    </form>
  )
}

export default ProductForm;