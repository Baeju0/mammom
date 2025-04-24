import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WritingPage from "./pages/WritingPage.tsx";
import "./index.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

function App() {
    return (
        <div className="bg-gradient bg-layout font-noto">
            <Header/>
            <main className="bg-main">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/writing" element={<WritingPage/>}/>
                </Routes>
            </main>
                <Footer/>
        </div>
);
}
export default App;