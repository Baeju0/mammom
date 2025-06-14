import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import {ArrowRight, NotebookPen} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import Calendar from "../components/Calendar.tsx";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import DiaryPopup from "../components/DiaryPopup.tsx";
import useUserLocation from "../hooks/useUserLocation.ts";
import RecommendedActivities from "../components/RecommendedActivities.tsx";
import DataChart from "../components/DataChart.tsx";
import {useStore} from "../store/store.ts";
import {supabase} from "../util/supabaseClient.ts";
import {DiaryEntry} from "../types/diary.ts";

interface Weather {
    temp: number;
    main: string;
    icon: string;
}

export default function Home() {
    const user = useStore((state) => state.user);
    const [recordedDates, setRecordedDates] = useState<Date[]>([]);
    const [dailyEntry, setDailyEntry] = useState<DiaryEntry | null>(null);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPopup, setShowPopup] = useState(false);
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

    // 일기 작성된 날짜 조회
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
    }, [user]);

    // 기록된 날짜 중 선택한 날짜의 일기 팝업 표시
    useEffect(() => {
        if (!user || !selectedDate) {
            setDailyEntry(null);
            return;
        }

        setDailyEntry(null);
        (async () => {
            const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
            const {data, error} = await supabase
                .from("diary_entry")
                .select(`id, title, content,
                         entry_date, emotion_color_id, symptom_id,
                         custom_emotion_color, custom_symptom, profile_id`)
                .eq("profile_id", user.id)
                .eq("entry_date", selectedDateStr)
                .maybeSingle();

            if (error) {
                console.log("일기 조회 실패: ", error);
            }
            setDailyEntry(data || null);
        })();
    }, [user, selectedDate]);

    useEffect(() => {
        setShowPopup(!!dailyEntry);
    }, [dailyEntry]);

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
                            }}
                        />
                            {showPopup && selectedDate && dailyEntry && (
                                <DiaryPopup
                                    title={dailyEntry.title}
                                    subTitle={format(selectedDate, 'yyyy년 MM월 dd일의 일기')}
                                            emotion={{
                                                      name: dailyEntry.custom_emotion_color
                                                            ? "기타"
                                                            : useStore.getState().emotionColors.find(
                                                                (color) => color.id === dailyEntry?.emotion_color_id)?.name || "기본 감정",
                                                      hex_code: dailyEntry.custom_emotion_color
                                                                ? dailyEntry.custom_emotion_color
                                                                : useStore.getState().emotionColors.find(
                                                                    (color) => color.id === dailyEntry?.emotion_color_id)?.hex_code || "#000000"
                                                     }}
                                            symptom={dailyEntry.custom_symptom ||
                                                         useStore.getState().symptoms.find(
                                                            (symptom) => symptom.id === dailyEntry?.symptom_id)?.emoji || "🫥"}
                                            content={dailyEntry.content}
                                            onDetail={handleGoToWritingDetail}
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