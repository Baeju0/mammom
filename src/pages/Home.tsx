import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Calendar from "../features/Calendar.tsx";
import {useState} from "react";
import {isSameDay} from "date-fns";
import Popup from "../components/Popup.tsx";

export default function Home() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    // 기록한 날짜 예시 데이터, JS는 달이 0부터 시작해서 3이 4월임.
    const recordedDate = [new Date(2025, 3, 5), new Date(2025, 3, 13)];

    return (
        <>
            <div>
                <section>
                    <div/>
                    <h1 className="base-text">
                        따뜻한 하루를 시작해요!
                    </h1>
                    <div className="col-start-3 justify-self-end">
                        <Link to="/writing">
                          <Button>
                            <Heart color="#FFFFFF" className="mr-2"/>오늘의 기분
                          </Button>
                        </Link>
                    </div>
                </section>

                <main className="grid grid-cols-2 grid-rows-min gap-6 h-full py-10">
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
                            <Popup onClose={() => setShowPopup(false)}
                                   selected={selectedDate}
                                   title={"선택한 날짜"}>
                                {`${selectedDate.toLocaleDateString('ko-KR')}를 선택하셨어요!`}
                            </Popup>
                        )}
                    </Card>

                    <Card title="데이터" className="col-start-1 row-start-2">
                        컴포넌트 추가 공간
                    </Card>
                </main>
            </div>
        </>
    );
}