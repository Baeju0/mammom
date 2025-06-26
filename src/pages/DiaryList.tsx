import {useNavigate} from "react-router-dom";
import {isLightColor} from "../util/isLightColor.ts";
import {DiaryEntry} from "../types/diary.ts";
import {useEffect, useState} from "react";
import {supabase} from "../util/supabaseClient.ts";
import {useStore} from "../store/store.ts";
import {getEmotionSymptomEntry} from "../util/getEmotionSymptomEntry.ts";

export default function DiaryList() {
    const navigate = useNavigate();

    const emotionColors = useStore((state) => state.emotionColors);
    const symptoms = useStore((state) => state.symptoms)

    const [diaryList, setDiaryList] = useState<DiaryEntry[]>([]);

    useEffect(() => {
        (async () => {
            const { data, error } = await supabase
                .from("diary_entry")
                .select("*")
                .order("entry_date", {ascending: false});

            if (error) {
                console.log("일기 리스트 조회 실패!", error);
                setDiaryList([]);
                return;
            }
                setDiaryList(data ?? []);
        })();
    }, []);

    return (
        <div className="writing-list-layout">
            <h2 className="text-2xl font-bold mb-4">일기 작성 내역</h2>
            <ul className="space-y-4">
                {diaryList.map((diary) => {
                    const { emotion, symptom } = getEmotionSymptomEntry(diary, emotionColors, symptoms);
                    const textColor = isLightColor(emotion.hex_code) ? "#222" : "#fff";

                    return (
                        <li
                            key={diary.id}
                            className="writing-list"
                            onClick={() => navigate(`/writing-list/${diary.id}`)}
                        >
                            <div className="writing-list-date">
                                {new Date(diary.entry_date).toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>

                            <div className="writing-list-item">
                                <div className="writing-list-circle" style={{ background: emotion.hex_code }}>
                                    <span className="text-xs font-bold" style={{ color: textColor }}>
                                        {emotion.name}
                                    </span>
                                </div>

                                <div className="writing-list-circle border" style={{ borderColor: emotion.hex_code }}>
                                    <span className="text-xs">
                                        {symptom.emoji}
                                    </span>
                                </div>
                                    <span className="ml-2 font-semibold">
                                        {diary.title}
                                    </span>
                            </div>

                            <div className="writing-list-text">
                                {diary.content.length > 40 ? diary.content.slice(0, 40) + "..." : diary.content}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}