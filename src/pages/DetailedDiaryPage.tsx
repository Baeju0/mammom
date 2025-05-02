import {useNavigate} from "react-router-dom";
import Card from "../components/Card.tsx";
import {isLightColor} from "../util/isLightColor.ts";

// 예시 데이터
const diaryDetail = {
    id: 1,
    date: "2025-05-01",
    title: "행복한 하루",
    emotion: { name: "기쁨", color: "#FFD600" },
    symptom: "😊",
    content: "오늘은 날씨가 좋아서 산책을 다녀왔다! 행복했다!",
};

export default function DetailedDiaryPage() {
    const navigate = useNavigate();
    const textColor = isLightColor(diaryDetail.emotion.color) ? "#222" : "#fff";

    return (
        <Card
            backable
            onBack={() => navigate(-1)}>

        <div className="diary-detail-container">
            <div className="diary-detail-date">
                {new Date(diaryDetail.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>

            <h1 className="diary-detail-title">{diaryDetail.title}</h1>

            <div className="diary-detail-circles">
                <div className="circle-layout">
                    <div
                        className="popup-circle border"
                        style={{ background: diaryDetail.emotion.color,
                                borderColor: diaryDetail.emotion.color }}
                    >
            <span
                className="text-xs font-bold"
                style={{ color: textColor }}
            >
              {diaryDetail.emotion.name}
            </span>
                    </div>
                    <span className="popup-circle-text">감정</span>
                </div>
                <div className="circle-layout">
                    <div
                        className="popup-circle"
                        style={{ borderColor: diaryDetail.emotion.color }}
                    >
                        <span className="text-xl">{diaryDetail.symptom}</span>
                    </div>
                    <span className="popup-circle-text">신체 증상</span>
                </div>
            </div>

            <div className="diary-detail-content">
                {diaryDetail.content}
            </div>
        </div>
        </Card>
    );
}