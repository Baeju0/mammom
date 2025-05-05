import {useNavigate} from "react-router-dom";
import Card from "../components/Card.tsx";
import {isLightColor} from "../util/isLightColor.ts";
import Button from "../components/Button.tsx";
import Circle from "../components/Circle.tsx";

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
                <Circle label="감정"
                        color={diaryDetail.emotion.color}
                        textColor={textColor}
                        bordered
                > {diaryDetail.emotion.name}
                </Circle>
                <Circle label="증상"
                        bordered
                > {diaryDetail.symptom}
                </Circle>
            </div>

            <div className="diary-detail-content">
                {diaryDetail.content}
            </div>
        </div>
            <Button onClick={()=>navigate(`/writing-list/${diaryDetail.id}/edit`)}>수정하기</Button>
        </Card>
    );
}