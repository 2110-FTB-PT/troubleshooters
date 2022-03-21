import { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { HomePage, Products, SingleProduct } from './';

const App = () => {
  const [products, setProducts] = useState([])

  return (
    <div className="App">
      <nav className='navbar'>
        <Link to='/'>Home</Link>
        <Link to='/products'>Products</Link>
      </nav>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/products' element={<Products products={products} setProducts={setProducts} />} />
        <Route path='/products/:productId' element={<SingleProduct products={products}/>} />
      </Routes>
    </div>
  );
};

export default App;