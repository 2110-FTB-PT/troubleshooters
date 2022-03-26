import PropTypes from 'prop-types'

function Card({ children, reverse, handleClick }) {

    return(
        <div
        className="card"
        style={{
            backgroundColor: reverse ? 'rgba(0,0,0,0.4)' : '#fff',
            color: reverse ? '#fff' : '#000',
        }}
        onClick={handleClick && handleClick}
        >
            {children}
        </div>)
}

Card.defaultProps={
    reverse: false
}

Card.propTypes={
    children: PropTypes.node.isRequired,
    reverse: PropTypes.bool,
}

export default Card