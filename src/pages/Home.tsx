import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import {NotebookPen} from "lucide-react";
import { Link } from "react-router-dom";
import Calendar from "../components/Calendar.tsx";
import {useEffect, useState} from "react";
import {isSameDay} from "date-fns";
import Popup from "../components/Popup.tsx";
import useUserLocation from "../hooks/useUserLocation.ts";
import RecommendedActivities from "../components/RecommendedActivities.tsx";
import DataChart from "../components/DataChart.tsx";

interface Weather {
    temp: number;
    main: string;
    icon: string;
}

export default function Home() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const { latitude, longitude } = useUserLocation();
    const [weather, setWeather] = useState<Weather | null>(null);
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    useEffect(() => {
        if (latitude == null || longitude == null) return;

        const fetchWeather = async () => {
            const res = await fetch(
                (`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
            );
            const json = await res.json();
            setWeather({
                temp: json.main.temp.toFixed(1),
                main: json.weather[0].main,
                icon: json.weather[0].icon
            });
            console.log(json);
        };
        fetchWeather();
    }, [latitude, longitude, API_KEY]);

    // 기록한 날짜 예시 데이터, JS는 달이 0부터 시작해서 3이 4월임.
    const recordedDate = [new Date(2025, 3, 5), new Date(2025, 3, 13)];

    return (
            <div>
                <section className="flex justify-center">
                    <div className="mb-5">
                        <Link to="/writing">
                            <Button>
                                <NotebookPen color="#FFFFFF" className="mr-3"/>오늘의 하루 기록하기
                            </Button>
                        </Link>
                    </div>
                </section>

                <div className="weather-info-box">
                    {weather && (
                        <img src={`https://openweathermap.org/img/wn/${weather?.icon}@2x.png`}
                             alt={weather?.main}
                             width={24}
                             height={24}
                             className="weather-icon-bg"
                        />)}
                    <span>{weather?.main} | {weather?.temp}°C </span>
                </div>

                <main className="grid grid-cols-2 grid-rows-min gap-6 h-full py-3">
                    <Card title="추천 활동" className="col-start-1 row-start-1">
                        <RecommendedActivities/>
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
                        <DataChart/>
                    </Card>
                </main>
            </div>
    );
}