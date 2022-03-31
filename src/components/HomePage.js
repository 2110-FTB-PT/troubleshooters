const HomePage = () => {
  return (
    <ul className="home">
      <br></br>
      <h1>Welcome to Crate Diggers!</h1>
      <div className="container2">
        <img
        src={splash}
        alt="digging"
        id="splash"
        />
        <div className="overlay">
    <h2 className="text2">"Where words fail, music speaks" -Hans Christian Andersen</h2>
    </div>
      </div>
    </ul>
  );
};
export default HomePage;
