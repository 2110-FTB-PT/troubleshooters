import dig from '../assets/WebAssets/dig.jpeg'
import dig2 from '../assets/WebAssets/dig2.jpg'


const HomePage = () => {
  return (
    <div className="home">
           <img src={dig} className="dig2"/>
 <div className="transbox">
        <span className="welcome">Welcome</span>
        <br></br>
        <span className="welcome">Crate</span>
        <br></br>
        <span className="welcome">Diggers!</span>
      </div>
    </div>

  );
};
export default HomePage;
