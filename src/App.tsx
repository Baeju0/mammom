import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WritingPage from "./pages/WritingPage.tsx";
import "./index.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import RecommendDetailPage from "./pages/RecommendDetailPage.tsx";

function App() {
    return (
        <div className="bg-gradient bg-layout font-noto">
            <Header/>
            <main className="bg-main">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/writing" element={<WritingPage/>}/>
                    <Route path="/activities-detail/:id" element={<RecommendDetailPage/>}/>
                </Routes>
            </main>
                <Footer/>
        </div>
);
}
export default App;