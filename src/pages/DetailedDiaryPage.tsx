import {useNavigate, useParams} from "react-router-dom";
import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import Circle from "../components/Circle.tsx";
import {useEffect, useState} from "react";
import {supabase} from "../util/supabaseClient.ts";
import {DiaryEntry} from "../types/diary.ts";
import {getEmotionSymptomEntry} from "../util/getEmotionSymptomEntry.ts";
import {useStore} from "../store/store.ts";
import {isLightColor} from "../util/isLightColor.ts";

export default function DetailedDiaryPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState<DiaryEntry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            navigate(-1);
            return;
        }
        (async () => {
            const {data, error} = await supabase
                .from("diary_entry")
                .select(`id, title, content,
                 entry_date, emotion_color_id, symptom_id,
                 custom_emotion_color, custom_symptom, profile_id,
                 created_at, updated_at`)
                .eq("id", Number(id))
                .single();
            if (error) {
                console.log("일기 내용 조회 실패!", error);
                navigate(-1);
            } else {
                setEntry(data);
            }
            setLoading(false);
        })();
    },[id, navigate]);

    if (loading) return <div>로딩 중.....</div>;
    if (!entry) return <div>오잉!? 일기를 찾을 수 없습니다!</div>

    const handleDelete = async () => {
        if (!entry) return;
        if (!window.confirm("정말 이 일기를 삭제하시겠습니까?")) return;

        const {error} = await supabase
            .from("diary_entry")
            .delete()
            .eq("id", entry.id);
        if (error) {
            alert("일기 삭제 실패!");
            console.log("일기 삭제 실패!", error);
        } else {
            alert("일기 삭제 성공!");
            navigate("/");
        }
    }

    const {emotion, symptom} = getEmotionSymptomEntry(
        entry,
        useStore.getState().emotionColors,
        useStore.getState().symptoms
    );

    const textColor = isLightColor(emotion.hex_code) ? "#222" : "#fff";

    return (
        <Card backable onBack={() => navigate(-1)}>
            <div className="diary-detail-container">
                <div className="diary-detail-date">
                    {new Date(entry.entry_date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>

                <h1 className="diary-detail-title">{entry.title}</h1>
                <div className="diary-detail-circles">
                    <Circle label="감정"
                            color={emotion.hex_code}
                            textColor={textColor}
                            bordered
                    > {emotion.name}
                    </Circle>
                    <Circle label="증상"
                            bordered
                    > {symptom.emoji}
                    </Circle>
                    {entry?.custom_symptom && (
                        <span className="custom-symptom-box">
                            {entry?.custom_symptom ? `기타 증상: ${entry?.custom_symptom}` : `증상: ${symptom.name}`}</span>
                    )}
                </div>

                <div className="diary-detail-content">
                    {entry.content}
                </div>
            </div>
            <div className="edit-btn-container">
                <div className="edit-btn">
                    <Button onClick={() => navigate(`/writing-list/${entry.id}/edit`)}>
                        수정하기
                    </Button>
                    <Button className="!bg-red-100 !text-red-500" onClick={handleDelete}>
                        삭제
                    </Button>
                </div>
            </div>
        </Card>
);
}