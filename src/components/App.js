import { Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';

const App = () => {
  return (
    <div className="App">
      <nav className='navbar'>
        <Link to='/'>Home</Link>
      </nav>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;