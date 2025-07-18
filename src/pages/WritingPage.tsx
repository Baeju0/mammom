import ColorSelector from "../components/ColorSelector.tsx";
import Card from "../components/Card.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Input from "../components/Input.tsx";
import TextArea from "../components/TextArea.tsx";
import Button from "../components/Button.tsx";
import SymptomSelector from "../components/SymptomSelector.tsx";
import {useStore} from "../store/store.ts";
import {DiaryEntryInsert} from "../types/diary.ts";
import {supabase} from "../util/supabaseClient.ts";
import {format} from "date-fns";

export default function WritingPage() {
    const navigate = useNavigate();
    const today = new Date();
    const todayString = format(today, "yyyy-MM-dd");

    const emotionColors = useStore((state) => state.emotionColors);
    const symptoms = useStore((state) => state.symptoms);
    const user = useStore((state) => state.user);
    const weather = useStore((state) => state.weather);

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSymptomId, setSelectedSymptomId] = useState<number | null>(null);
    const [customSymptom, setCustomSymptom] = useState<string>("");

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const [saveLoading, setSaveLoading] = useState(false);

    const handleSave = async () => {
        if (saveLoading) return;
        setSaveLoading(true);

        if (!user?.id) {
            alert("사용자 정보가 올바르지 않습니다. 로그인 후 다시 시도해주세요.");
            return;
        }

        if (title.trim().length < 3) {
            alert("일기 제목은 최소 3자 이상 작성해주세요!");
            return;
        }

        if (content.trim().length < 10) {
            alert("일기 내용은 최소 10자 이상 작성해주세요!");
            return;
        }

        const matchedEmotion = emotionColors.find((color) => color.hex_code === selectedColor);
        const matchedSymptom = symptoms.find((symptom) => symptom.id === selectedSymptomId);

        if (!selectedColor) {
            alert("오늘의 감정 색상 또는 커스텀 색상을 하나 선택해주세요!");
            return;
        }

        if (!matchedSymptom && !customSymptom) {
            alert("오늘의 신체 증상 또는 직접 입력한 증상을 기록해주세요!");
            return;
        }

        if (selectedSymptomId === null && !customSymptom.trim()) {
            alert("기타 증상을 입력해주세요!");
            return;
        }

        const payload: DiaryEntryInsert = {
            title,
            content,
            entry_date: today.toISOString().split("T")[0],
            profile_id: user!.id,
            emotion_color_id: matchedEmotion ? matchedEmotion.id : null,
            symptom_id: matchedSymptom ? matchedSymptom.id :null,
            custom_emotion_color: matchedEmotion ? null : selectedColor,
            custom_symptom: matchedSymptom ? null : customSymptom,
        };

        const {error} = await supabase
            .from("diary_entry")
            .insert(payload);
        if (error) {
            console.log("일기 저장 실패:", error);
            return alert("일기 저장에 실패했어요..");
        }

        if (weather) {
            const {error: insertError} = await supabase
                .from("weather_data")
                .insert({
                    date: todayString,
                    condition: weather.main,
                    temp: Math.round(weather.temp),
                });

            if (insertError) {
                if (insertError.code === "23505") {
                    await supabase
                        .from("weather_data")
                        .update({
                            condition: weather.main,
                            temp: Math.round(weather.temp),
                        })
                        .eq("date", todayString);
                } else {
                    // if (import.meta.env.MODE === "development") console.error(insertError);
                }
            }
        }

        setSaveLoading(false);
        alert("일기 저장 완료!");
        navigate("/");
    }

    return(
        <>
        <div className="w-full flex justify-center px-2">오늘의 감정</div>
            <ColorSelector
                emotionColors={emotionColors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
            />

            <Card
                title="오늘의 일기 (하루 1회 작성)"
                backable
                onBack={() => navigate(-1)}
                className="card-large"
            >
                <div className="mb-2 text-center">
                    {today.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <div className="circle mx-auto"
                         style={{backgroundColor: selectedColor}}
                    ></div>
                    <Input
                        title="일기 제목"
                        placeholder="오늘 하루의 제목을 작성해보세요. (최소 3자 이상)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextArea
                        title="일기 내용"
                        placeholder="오늘 하루를 기록해보세요. (최소 10자 이상)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </Card>
            <Card
                title="오늘의 신체 증상"
                className="card-large">
                <SymptomSelector
                    symptoms={symptoms}
                    selectedSymptomId={selectedSymptomId}
                    setSelectedSymptomId={setSelectedSymptomId}
                    customSymptom={customSymptom}
                    setCustomSymptom={setCustomSymptom}
                />
                <Button onClick={handleSave}>저장</Button>
            </Card>
        </>
    )
}