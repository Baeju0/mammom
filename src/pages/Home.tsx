import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import {ArrowRight, NotebookPen} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import Calendar from "../components/Calendar.tsx";
import {useEffect, useState} from "react";
import {isSameDay} from "date-fns";
import DiaryPopup from "../components/DiaryPopup.tsx";
import useUserLocation from "../hooks/useUserLocation.ts";
import RecommendedActivities from "../components/RecommendedActivities.tsx";
import DataChart from "../components/DataChart.tsx";
import {useStore} from "../store/store.ts";
import {supabase} from "../util/supabaseClient.ts";

interface Weather {
    temp: number;
    main: string;
    icon: string;
}

export default function Home() {
    const [recordedDates, setRecordedDates] = useState<Date[]>([]);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const user = useStore((state) => state.user);
    const locationAgreed = useStore((state) => state.locationAgreed);
    const setLocationAgreed = useStore((state) => state.setLocationAgreed);

    function handleGoToWritingDetail() {
        navigate("/writing-list/:id");
    }

    const navigate = useNavigate();
    function handleGoToDataDetail() {
        navigate("/data-detail");
    }

    const { latitude, longitude } = useUserLocation(!!user && locationAgreed);
    const [weather, setWeather] = useState<Weather | null>(null);
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    // 일기 날짜 조회
    useEffect(() => {
        if (!user) return;

        (async () => {
            const {data, error} = await supabase
                .from("diary_entry")
                .select("entry_date")
                .eq("profile_id", user.id);

            if (error) {
                console.log("일기 날짜 조회 실패: ", error);
                return;
            }

            const dates = (data || [])
                .map((row) => row.entry_date)
                .filter((date): date is string => typeof date === "string")
                .map((date) => new Date(date));

            setRecordedDates(dates);
        })();
    })

    // 위치 정보 동의한 유저인지 확인
    useEffect(() => {
        if (!user) return;
        supabase
            .from("profiles")
            .select("location_agreed")
            .eq("id", user.id)
            .single()
            .then(({data}) => {
                setLocationAgreed(!!data?.location_agreed);
            });
    }, [user, setLocationAgreed]);

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
            // console.log(json);
        };
        fetchWeather();
    }, [latitude, longitude, API_KEY]);

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

            <main className="card-layout">
                <Card title="추천 활동" className="recommend-card">
                    <RecommendedActivities/>
                </Card>

                <Card title="달력"
                      className="calendar-card">
                    <div className="mt-5">
                        {user ? <>
                            <Calendar
                                recordedDate={recordedDates}
                                selected={selectedDate}
                                onSelect={(date) => {
                                    setSelectedDate(date ?? null);
                                    setShowPopup(
                                        !!date && recordedDates.some(d => d && isSameDay(d, date))
                                );
                            }}
                        />
                            {showPopup && selectedDate && (
                                <DiaryPopup title={`${selectedDate.toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}의 일기`}
                                            subTitle={"일기 제목"}
                                            emotion={{name: "기쁨", color: "#FFD600"}}
                                            symptom="❌"
                                            content="일기 내용"
                                            onDetail={() => {
                                                handleGoToWritingDetail()
                                            }}
                                            onClose={() => setShowPopup(false)}
                                >
                                </DiaryPopup>
                            )}</>
                            : <Calendar/>}
                    </div>
                </Card>

                <Card
                    title={
                        <div className="data-card-plus">
                            <span className="data-title">감정 색상 Top5</span>
                            <button
                                onClick={handleGoToDataDetail}
                                className="data-plus-font"
                                type="button"
                            >
                                더보기 <ArrowRight width={14} height={14}/>
                            </button>
                        </div>
                    }
                    className=""
                >
                    <DataChart/>
                </Card>
            </main>
        </div>
    );
}