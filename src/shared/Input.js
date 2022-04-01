import { useEffect, useState } from "react";
const Input = ({ name, value, handleChange }) => {
  // set the initial value of our state to the init value of the state mapped over
  const [input, setInput] = useState(value)
  // whenever our input changes, update our state in a higher level component
  // avoids rerendering from prop changes
  useEffect(() => {
    handleChange(input)
  }, [input])

  // set our type for our input field
  let typeSetter = '';
  if (typeof value === 'number') {
    typeSetter = 'number'
  } else {
    typeSetter = 'text'
  }

  return (
    <>
      <label>{name}</label>
      <input placeholder={name} type={typeSetter} value={input} onChange={e => {
        if (typeSetter === 'text') {
          setInput(e.target.value);
        } else if (typeSetter === 'number') {
          setInput(Number(e.target.value));
        }
      }}/>
    </>
  )
}

export default Input;