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
import {useStore} from "./store/store.ts";
import {useEffect} from "react";
import {supabase} from "./util/supabaseClient.ts";
import RedirectAuth from "./components/RedirectAuth.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
    const setUser = useStore((state) => state.setUser);
    const setNickname = useStore((state) => state.setNickname);

    // 새로고침 시에도 로그인 유지
    useEffect(() => {
        (async () => {
            const {data} = await supabase.auth.getSession();
            const user = data.session?.user ?? null;
            setUser(user);

            if(user) {
                const {data:profile} = await supabase
                    .from("profiles")
                    .select("nickname")
                    .eq("id", user.id)
                    .single();
                setNickname(profile?.nickname ?? "");
            } else {
                setNickname("");
            }
        })();


        // 로그인 상태 변화 감시
        const {data : listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const user = session?.user ?? null;
                setUser(user);
                if (user) {
                    supabase
                        .from("profiles")
                        .select("nickname")
                        .eq("id", user.id)
                        .single()
                        .then(({data}) => setNickname(data?.nickname ?? ""));
                } else {
                    setNickname("");
                }
            });
        return () => {
            listener.subscription.unsubscribe();
        };
    }, [setUser, setNickname]);

    return (
        <div className="bg-gradient bg-layout font-noto">
            <Header/>
            <main className="bg-main">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={
                        <RedirectAuth>
                            <Login/>
                        </RedirectAuth>
                        }/>
                    <Route path="/sign-up" element={
                        <RedirectAuth>
                        <SignUp/>
                        </RedirectAuth>
                    }/>

                    <Route element={<ProtectedRoute/>}>
                    <Route path="/writing" element={<WritingPage/>}/>
                    <Route path="/activities-detail/:id" element={<RecommendDetailPage/>}/>
                    <Route path="/data-detail" element={<DataPage/>}/>
                    <Route path="/writing-list" element={<DiaryList/>}/>
                    <Route path="/writing-list/:id" element={<DetailedDiaryPage/>}/>
                    <Route path="/writing-list/:id/edit" element={<DiaryEditPage/>}/>
                    </Route>

                </Routes>
            </main>
                <Footer/>
        </div>
);
}
export default App;