import {useEffect, useState} from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import {useNavigate, useParams} from "react-router-dom";
import { isLightColor } from "../util/isLightColor";
import Circle from "../components/Circle.tsx";
import ColorSelector from "../components/ColorSelector.tsx";
import Popup from "../components/Popup.tsx";
import SymptomSelector from "../components/SymptomSelector.tsx";
import {useStore} from "../store/store.ts";
import {supabase} from "../util/supabaseClient.ts";
import {DiaryEntry} from "../types/diary.ts";

export default function DiaryEditPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const entryId = Number(id);

    const emotionColors = useStore((state) => state.emotionColors);
    const symptoms = useStore((state) => state.symptoms);

    const [date, setDate] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSymptomId, setSelectedSymptomId] = useState<number | null>(null);
    const [customSymptom, setCustomSymptom] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const [colorSelectorOpen, setColorSelectorOpen] = useState(false);
    const [symptomSelectorOpen, setSymptomSelectorOpen] = useState(false);

    const textColor = isLightColor(selectedColor) ? "#222" : "#fff";

    useEffect(() => {
        if (!entryId) return;
        (async () => {
            const {data, error} = await supabase
                .from("diary_entry")
                .select("*")
                .eq("id", entryId)
                .single();

            if (error) {
                console.log("일기 조회 실패!", error);
                return;
            }
            setDate(data.entry_date);
            setTitle(data.title);
            setContent(data.content);

            if (data.custom_emotion_color && data.custom_emotion_color.trim() !== "") {
                setSelectedColor(data.custom_emotion_color);
            } else {
                const emotionRecord = emotionColors.find((color) => color.id === data.emotion_color_id);
                setSelectedColor(emotionRecord?.hex_code || "");
            }

            if (data.custom_symptom && data.custom_symptom.trim() !== "") {
                setCustomSymptom(data.custom_symptom);
                setSelectedSymptomId(null);
            } else {
                setCustomSymptom("");
                setSelectedSymptomId(data.symptom_id);
            }
        })();
    }, [entryId, emotionColors]);

    const handleSave = async () => {
        if (title.trim().length < 3) {
            alert("일기 제목은 최소 3자 이상 작성해주세요!");
            return;
        }
        if (content.trim().length < 10) {
            alert("일기 내용은 최소 10자 이상 작성해주세요!");
            return;
        }
        if (!selectedColor) {
            alert("오늘의 감정 색상 또는 커스텀 색상을 하나 선택해주세요!");
            return;
        }
        if (!customSymptom.trim() &&!selectedSymptomId) {
            alert("오늘의 신체 증상 또는 직접 입력한 증상을 기록해주세요!");
            return;
        }

    const matchedEmotion = emotionColors.find((color) => color.hex_code === selectedColor);

    const payload: Partial<DiaryEntry> = {
        title,
        content,
    };

    if (matchedEmotion) {
        payload.emotion_color_id = matchedEmotion.id;
        payload.custom_emotion_color = null;
    } else {
        payload.emotion_color_id = null;
        payload.custom_emotion_color = selectedColor;
    }

    if (customSymptom.trim() !== "") {
        payload.custom_symptom = customSymptom.trim();
        payload.symptom_id = null;
    } else if (selectedSymptomId) {
        payload.symptom_id = selectedSymptomId;
        payload.custom_symptom = null;
    }

    const {error} = await supabase
        .from("diary_entry")
        .update(payload)
        .eq("id", entryId)

    if (error) {
        console.log("일기 수정 실패!", error);
        return;
    }

    alert("일기 수정이 완료되었습니다!");
    navigate(`/writing-list/${entryId}`);
    };

    const selectedSymptomRecord = symptoms.find((symptom) => symptom.id === selectedSymptomId);

    return (
        <div className="edit-container">
            <Card title="일기 수정" backable onBack={() => navigate(-1)} className="card-large">
                <div className="mb-2 text-center">
                    {new Date(date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>

                <div className="diary-detail-circles">
                        <Circle label="감정"
                                color={selectedColor}
                                textColor={textColor}
                                bordered
                                onClick={()=> setColorSelectorOpen(true)}
                        > {emotionColors.find((color) => color.hex_code === selectedColor)?.name || "기타"}
                        </Circle>

                            {colorSelectorOpen && (
                                <Popup
                                    title="감정 선택"
                                    onClose={() => setColorSelectorOpen(false)}
                                    onSave={() => {setColorSelectorOpen(false);}}
                                >
                                <ColorSelector
                                emotionColors={emotionColors}
                                selectedColor={selectedColor}
                                setSelectedColor={setSelectedColor}
                                />
                                </Popup>
                            )}

                        <Circle label="증상"
                                bordered
                                onClick={()=> setSymptomSelectorOpen(true)}
                        > {customSymptom.trim() !== "" ? "🤔" : selectedSymptomRecord?.emoji || "?"}
                        </Circle>

                            {customSymptom.trim() !== "" ? (
                            <span className="custom-symptom-box">증상 : {customSymptom}</span>
                            ) : (
                                selectedSymptomRecord && <span className="custom-symptom-box">증상 : {selectedSymptomRecord.name}</span>
                            )}

                            {symptomSelectorOpen && (
                                <Popup
                                    title="신체 증상 선택"
                                    onClose={() => setSymptomSelectorOpen(false)}
                                    onSave={() => setSymptomSelectorOpen(false)}
                                >
                                    <SymptomSelector
                                        symptoms={symptoms}
                                        selectedSymptomId={selectedSymptomId}
                                        setSelectedSymptomId={setSelectedSymptomId}
                                        customSymptom={customSymptom}
                                        setCustomSymptom={setCustomSymptom}
                                    />
                                </Popup>
                            )}
                </div>

                <Input
                    title="일기 제목"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="일기 제목을 입력하세요."
                />
                <TextArea
                    title="일기 내용"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="일기 내용을 입력하세요."
                />
                <div className="edit-btn-container">
                    <Button onClick={handleSave}>저장</Button>
                </div>
            </Card>
        </div>
    );
};