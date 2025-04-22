import './index.css';
import Card from "./components/Card.tsx";
import Button from "./components/Button.tsx";
import {Heart, Menu, X} from "lucide-react";
import Logo from "./assets/logo.svg";
import { Link } from "react-router-dom";
import Calendar from "./features/Calendar.tsx";
import {useState} from "react";
import {isSameDay} from "date-fns";

function App() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    // 기록한 날짜 예시 데이터, JS는 달이 0부터 시작해서 3이 4월임.
    const recordedDate = [new Date(2025, 3, 5), new Date(2025, 3, 13)];

    return (
        <div className="w-full min-h-screen bg-gradient">

            <div className="p-5">
                <header className="flex items-center justify-between px-30 py-5">
                    <Link
                        to="/"
                        aria-label="메인 페이지로 이동"
                        className="flex items-center space-x-2">
                        <img src={Logo} alt="맘몸일기 로고" className="h-10 w-auto"/>
                        <span className="font-pretendard font-bold text-[24px] text-[#F44268]">
                         맘몸일기
                        </span>
                    </Link>

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
                    <div/>
                    <h1 className="font-noto base-text">
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
                        <Calendar
                            recordedDate={recordedDate}
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date ?? null);
                                setShowPopup(
                                    !!date && recordedDate.some(d => d && isSameDay(d, date))
                                );
                            }}
                        />
                        {showPopup && selectedDate && (
                            <div className="popup">
                                <X onClick={() => setShowPopup(!showPopup)}/>
                                {`Hello! ${selectedDate.toDateString()}`}
                            </div>
                        )}
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