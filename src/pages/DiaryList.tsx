import {useNavigate} from "react-router-dom";
import {isLightColor} from "../util/isLightColor.ts";

// 예시 데이터
const diaryList = [
    {
        id: 1,
        date: "2025-05-01",
        title: "행복한 하루",
        emotion: { name: "기쁨", color: "#FFD600" },
        symptom: "😊",
        content: "오늘은 날씨가 좋아서 산책을 다녀왔다! 행복했다!",
    },
    {
        id: 2,
        date: "2025-04-30",
        title: "조금 힘든 하루",
        emotion: { name: "슬픔", color: "#2196F3" },
        symptom: "😴",
        content: "오늘은 할 게 많아서 힘들었다... 몸이 좀 피곤해서 일찍 잘 것이다...!",
    },
];

export default function DiaryList() {
    const navigate = useNavigate();

    return (
        <div className="writing-list-layout">
            <h2 className="text-2xl font-bold mb-4">일기 작성 내역</h2>
            <ul className="space-y-4">
                {diaryList.map((diary) => {
                    const textColor = isLightColor(diary.emotion.color) ? "#222" : "#fff";
                    return (
                        <li
                            key={diary.id}
                            className="writing-list"
                            onClick={() => navigate(`/writing-list/${diary.id}`)}
                        >
                            <div className="writing-list-date">
                                {new Date(diary.date).toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>

                            <div className="writing-list-item">
                                <div
                                    className="writing-list-circle"
                                    style={{ background: diary.emotion.color }}
                                >
                                    <span className="text-xs font-bold" style={{ color: textColor }}>
                                        {diary.emotion.name}
                                    </span>
                                </div>

                                <div
                                    className="writing-list-circle border"
                                    style={{ borderColor: diary.emotion.color }}
                                >
                                    <span className="text-xs">{diary.symptom}</span>
                                </div>
                                    <span className="ml-2 font-semibold">{diary.title}</span>
                            </div>

                            <div className="writing-list-text">
                                {diary.content.length > 40
                                    ? diary.content.slice(0, 40) + "..."
                                    : diary.content}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}