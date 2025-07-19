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
import {getEmotionSymptomEntry} from "../util/getEmotionSymptomEntry.ts";
import {hasWrittenToday} from "../util/recommendUtils.ts";

const SEOUL = {lat: 37.6, lon: 127};
interface Weather {
    temp: number;
    main: string;
    icon: string;
}

export default function Home() {
    const {emotionColors, symptoms} = useStore.getState();
    const user = useStore((state) => state.user);
    const locationAgreed = useStore((state) => state.locationAgreed);
    const setLocationAgreed = useStore((state) => state.setLocationAgreed);
    const setWeatherStore = useStore((state) => state.setWeather);

    const [recordedDates, setRecordedDates] = useState<Date[]>([]);
    const [dailyEntry, setDailyEntry] = useState<DiaryEntry | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [userWeather, setUserWeather] = useState<Weather | null>(null);

    const navigate = useNavigate();
    const { latitude, longitude } = useUserLocation(!!user && locationAgreed);
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const [hasDiary, setHasDiary] = useState<boolean|null>(null);

    useEffect(() => {
        if (!user) {
            setHasDiary(false);
            return;
        }
        hasWrittenToday(user.id)
            .then(setHasDiary)
            .catch(() => setHasDiary(false));
    }, [user]);
    const title = hasDiary ? "🎯오늘의 맞춤 추천 활동!" : "🌱 기본 추천 활동!";

    function handleGoToWritingDetail(id: number) {
        navigate(`/writing-list/${id}`);
    }
    function handleGoToDataDetail() {
        navigate("/data-detail");
    }

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

    // 여기는 사용자 위치에 따른 날씨 표시
    useEffect(() => {
        if (latitude == null || longitude == null) return;

        (async () => {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
            const json = await res.json();
            setUserWeather({
                temp: Number(json.main.temp.toFixed(1)),
                main: json.weather[0].main,
                icon: json.weather[0].icon
            });
        })();
    }, [latitude, longitude, API_KEY]);

    // DB에 저장할 서울 날씨, 추후 지역별로 확장 고려
    useEffect(() => {
        (async () => {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${SEOUL.lat}&lon=${SEOUL.lon}&appid=${API_KEY}&units=metric`);
            const json = await res.json();
            setWeatherStore({
                temp: Number(json.main.temp.toFixed(1)),
                main: json.weather[0].main,
                icon: json.weather[0].icon
            });
        })();
    }, [API_KEY, setWeatherStore]);

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
                {userWeather && (
                    <img src={`https://openweathermap.org/img/wn/${userWeather.icon}@2x.png`}
                         alt={userWeather.main}
                         width={24}
                         height={24}
                         className="weather-icon-bg"
                    />)}
                <span>{userWeather?.main} | {userWeather?.temp}°C </span>
            </div>

            <main className="card-layout">
                <Card title= {title} className="recommend-card">
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
                                    emotion={getEmotionSymptomEntry(dailyEntry, emotionColors, symptoms).emotion}
                                    symptom={getEmotionSymptomEntry(dailyEntry, emotionColors, symptoms).symptom}
                                    content={dailyEntry.content}
                                    onDetail={() => handleGoToWritingDetail(dailyEntry.id)}
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