import { useParams } from "react-router-dom";
import Card from "../components/Card.tsx";

interface ActivityDetailType {
    [key: string]: {
        title: string;
        reason: string;
        how: string;
        time: string;
        tip: string;
    }
}

const activityDetails:ActivityDetailType = {
    tea: {
        title: "🍵 따뜻한 차 마시기",
        reason: "따뜻한 차는 몸과 마음을 진정시켜줘요!",
        how: "좋아하는 차를 천천히 마셔보세요!",
        time: "아침, 저녁",
        tip: "마음이 편안해질 때까지 천천히 호흡하세요!",
    },
    walk: {
        title: "🚶 산책하기",
        reason: "가벼운 운동은 기분 전환에 효과적이에요. 햇빛을 쬐면 세로토닌 분비가 촉진돼요!",
        how: "집 근처 공원이나 골목을 10~20분 정도 걸어보세요. 너무 멀지 않아도 괜찮아요!",
        time: "오후 4시 이전 (햇빛이 있는 시간대)",
        tip: "좋아하는 음악을 들으며 걸어보세요. 감정이 조금씩 정돈될 수 있어요!",
    },
};

export default function RecommendDetailPage() {
    const { id } = useParams<{ id: string }>();
    const activity = activityDetails[id ?? ""];

    if (!activity) return <div>활동 정보를 찾을 수 없습니다.</div>;

    return (
        <Card title="추천 활동 상세정보">
        <div>
            <h2>{activity.title}</h2>
            <p>이 감정에 추천하는 이유 : <br />{activity.reason}</p>
            <p>어떻게 하면 좋을까요? <br />{activity.how}</p>
            <p>추천 시간대 : {activity.time}</p>
            <p>팁!<br />{activity.tip}</p>
        </div>
        </Card>
    );
}