import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WritingPage from "./pages/WritingPage.tsx";
import "./index.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import RecommendDetailPage from "./pages/RecommendDetailPage.tsx";
import DataPage from "./pages/DataPage.tsx";
import DetailedDiaryPage from "./pages/DetailedDiaryPage.tsx";
import DiaryList from "./pages/DiaryList.tsx";
import DiaryEditPage from "./pages/DiaryEditPage.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";

function App() {
    return (
        <div className="bg-gradient bg-layout font-noto">
            <Header/>
            <main className="bg-main">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                    <Route path="/writing" element={<WritingPage/>}/>
                    <Route path="/activities-detail/:id" element={<RecommendDetailPage/>}/>
                    <Route path="/data-detail" element={<DataPage/>}/>
                    <Route path="/writing-list" element={<DiaryList/>}/>
                    <Route path="/writing-list/:id" element={<DetailedDiaryPage/>}/>
                    <Route path="/writing-list/:id/edit" element={<DiaryEditPage/>}/>
                </Routes>
            </main>
                <Footer/>
        </div>
);
}
export default App;