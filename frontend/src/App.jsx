import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import heroImage from "./assets/hero-img.png";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <img src={heroImage} alt="Healthcare Hero" className="hero-image" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
