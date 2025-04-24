import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Writing from "./pages/Writing.tsx";
import "./index.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/writing" element={<Writing />} />
        </Routes>
    );
}
export default App;