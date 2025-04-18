import './index.css';
import Card from "./components/Card.tsx";
import Button from "./components/Button.tsx";
import {Heart, Menu} from "lucide-react";
import Logo from "./assets/logo.svg";

function App() {

    return (
        <div className="w-full min-h-screen bg-gradient">

            <div className="p-5">
                <header className="flex items-center justify-between px-30 py-5">
                    <img src={Logo} alt="맘몸일기 로고"/>
                    <div className="flex items-center space-x-4">
                        <button
                            aria-label="메뉴 열기"
                            onClick={() => {
                                // onClick 로직 작성
                            }}
                        >
                            <Menu size={28} color="#934311"/>
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-3 items-center max-w-4xl mx-auto px-4 py-5">
                    <div />
                    <h1 className="base-text">
                        따뜻한 하루를 시작해요!
                    </h1>
                    <div className="col-start-3 justify-self-end">
                        <Button>
                            <Heart color="#FFFFFF" className="mr-2"/>오늘의 기분</Button>
                    </div>
                </section>

                <main className="grid grid-cols-2 grid-rows-min gap-6 h-full max-w-4xl mx-auto py-10">
                    <Card title="추천 활동" className="col-start-1 row-start-1">
                        컴포넌트 추가 공간
                    </Card>

                    <Card title="달력"
                          className="col-start-2 row-start-1 row-span-2">
                        컴포넌트 추가 공간
                    </Card>

                    <Card title="데이터" className="col-start-1 row-start-2">
                        컴포넌트 추가 공간
                    </Card>
                </main>
            </div>

            <footer className="bg-black text-white p-6 text-center text-sm">
                &copy; Baeju0
            </footer>
        </div>
    );
}

export default App;