import spinner from '../assets/WebAssets/spinner.gif'

function Spinner() {
    return (
        <img
        src={spinner}
        alt='Loading...'
        id="spinner"
        style={{width: '100px', margin: 'auto', display: 'block'}}
        />
    )
}

export default Spinner