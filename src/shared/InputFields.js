import Input from "./Input";

const InputFields = ({ state, setState }) => {
  const keys = Object.keys(state);

  return (
    <>
      {keys.map(objKey => {
        const handleChange = (input) => {
          setState({...state, [objKey]: input})
        }
        return <Input key={`${objKey}`} name={objKey} value={state[objKey]} setState={setState} handleChange={handleChange} />
      })}
    </>
  )
}

export default InputFields;