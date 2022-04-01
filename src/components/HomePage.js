import dig from '../assets/WebAssets/dig.jpg'

const HomePage = () => {
  return (
    <div className="home">
      <div className="transbox">
        <div className="welcome">
          Welcome Crate Diggers!
        </div>
      </div>
      <img src={dig} className="dig" />
    </div>
  );
};
export default HomePage;
