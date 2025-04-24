import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Writing from "./pages/Writing.tsx";
import "./index.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

function App() {
    return (
        <div className="w-full min-h-screen bg-gradient">
          <Header/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/writing" element={<Writing />} />
            </Routes>
          <Footer/>
        </div>
    );
}
export default App;