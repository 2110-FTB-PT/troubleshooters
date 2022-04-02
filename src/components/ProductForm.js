import InputFields from "../shared/InputFields";
import Button from "../shared/Button";
import { useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import "./ProductForm.css";

const ProductForm = ({ state, setState, handleSubmit, categories, storeCategories, categoryIds, setCategoryIds }) => {
  useEffect(() => {
    if (storeCategories) {
      let initialIds = [];
      storeCategories.forEach(category => {
        initialIds.push(category.id);
      });
      setCategoryIds(initialIds);
    }
  }, [storeCategories])

  const handleChange = (event) => {
    setCategoryIds(event.target.value)
  }

  return (
    <form className="product-form">
      <InputFields state={state} setState={setState} />
      <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        multiple
        value={categoryIds}
        onChange={handleChange}
        input={<OutlinedInput label="Categories" />}
        renderValue={(selectedCategoryIds) => {
          const filteredCategories = categories.filter(category => selectedCategoryIds.includes(category.id));
          let categoryNames = [];
          filteredCategories.forEach(category => {
            categoryNames.push(category.name);
          })
          return categoryNames.join(', ');
        }}
      >
        {categories.map((category) => (
          <MenuItem key={category.name} value={category.id}>
            <Checkbox checked={categoryIds.includes(category.id)} />
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
      </Select>
      <Button onClick={handleSubmit}>Confirm Product</Button>
    </form>
  )
}

export default ProductForm;